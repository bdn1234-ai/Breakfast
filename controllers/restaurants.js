const Restaurant = require('../models/restaurants');
const Dish = require('../models/dishes');
const Order = require('../models/orders')
const { cloudinary } = require("../cloudinary");


module.exports.index = async (req, res) => {
    const restaurants = await Restaurant.find({});
    res.render('restaurants/index', { restaurants });
}

module.exports.renderNewForm = async (req, res) => {
    res.render('restaurants/new');
}

module.exports.createRestaurant = async (req, res, next) => {
    const restaurant = new Restaurant(req.body.restaurant);
    restaurant.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    restaurant.author = req.user._id;
    
    await restaurant.save();
    req.user.restaurant = restaurant._id;
    await req.user.save();
    req.flash('success', 'Successfully create a Restaurant!');
    res.redirect('/restaurants');
}

module.exports.showRestaurant = async (req, res, next) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!restaurant) {
        req.flash('error', 'Cannot find that Breakfast!');
        return res.redirect('/breakfasts');
    }
    
    res.render("restaurants/show", { restaurant });
}

module.exports.showMenu = async (req, res, next) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id).populate('dishes');
    res.render('restaurants/menu', { restaurant });
}

module.exports.renderNewDishForm = async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id)
    res.render('restaurants/newDish', {restaurant} );
}

module.exports.createDish = async (req, res, next) => {
    const restaurant = await Restaurant.findById(req.params.id);
    const dish = new Dish(req.body.dish); 
    dish.image = {
        url: req.file.path,
        filename: req.file.filename
    };
    restaurant.dishes.push(dish);
    await dish.save();
    await restaurant.save();
    req.flash('success', 'Successfully create a new dish!');
    res.redirect(`/restaurants/${restaurant._id}/menu`);
}

module.exports.renderEditRestaurant = async (req, res, next) => {
    const id = req.params.id;
    const restaurant = await Restaurant.findById(id);
    res.render('restaurants/edit', { restaurant });
}

module.exports.editRestaurant = async (req, res, next) => {
    const id = req.params.id;
    const restaurant = await Restaurant.findByIdAndUpdate(id, { ...req.body.restaurant }, { new: true });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await restaurant.images.push(...imgs);
    await restaurant.save();
    req.flash('success', 'Successfully update Restaurant!');
    res.redirect(`/restaurants/${restaurant._id}`);
}

module.exports.deleteRestaurant = async (req, res, next) => {
    const { id } = req.params;
    await Restaurant.findByIdAndDelete(id);
    req.flash('success', 'Successfully delete Restaurant!');
    res.redirect('/restaurants');
}

module.exports.order = async (req, res, next) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);

    const cartData = JSON.parse(req.body.dishes);
    const order = new Order();
    let price = 0;
    for (let item of cartData) {
        price += item.price * item.quantity;
    }
    order.price = price;
    order.dishes = cartData.map(f => ({ title: f.name, quantity: f.quantity }));
    order.date = new Date(Date.now());
    order.isSent = false;
    order.note = req.body.note;
    order.floor = req.user.floor;
    order.room = req.user.room;
    order.name = req.user.name;
    order.phone = req.user.phone;
    
    restaurant.orders.push(order);
    await order.save();
    await restaurant.save();
 
    req.flash('success', "Order successful!");
    res.redirect(`/restaurants/${id}`);
}

module.exports.showOrders = async (req, res) => {
    const id = req.params.id;
    const restaurant = await Restaurant.findById(id).populate('orders'); 
    
    res.render('orders/dashboard', { restaurant })
}

module.exports.showOrdersByFloor = async (req, res) => {
    const { id, number } = req.params;
    const restaurant = await Restaurant.findById(id).populate('orders');
    res.render('orders/showOrdersByFloor', { restaurant, number });
}

module.exports.orderFilter = async (req, res) => {
    const id = req.params.id;
    
    const restaurant = await Restaurant.findById(id)
        .populate({
            path: 'orders',
            populate: {
                path: 'dishes', // Lồng thêm dishes trong order
            }
        })
    
    const orders = [];
    for (let i = 1; i < 81; i++) {
        const filter = restaurant.orders.filter(order => order.floor === i && order.isSent === false);    

        const result = {};
        for (let items of filter) {
            for (let item of items.dishes) {
                // Nếu món đã tồn tại, cộng dồn quantity
                if (result[item.title]) {
                    result[item.title] += item.quantity;
                } else {
                    result[item.title] = item.quantity;
                }
            }
        }
        orders.push(result);
    }
    res.render('orders/orderFilter', { orders, restaurant });
}

module.exports.sent = async (req, res, next) => {
    const { id, orderId} = req.params;
    const order = await Order.findById(orderId);
    order.isSent = true;
    await order.save();
    req.flash('success', 'Mission completed!');
    res.redirect(`/restaurants/${id}/order`);
}

module.exports.showCompletedOrder = async (req, res, next) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id).populate('orders');
    res.render('orders/completedOrder', {restaurant})
}


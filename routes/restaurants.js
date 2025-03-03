const express = require('express');
const router = express.Router();
const restaurants = require('../controllers/restaurants');
const catchAsync = require('../utils/catchAsync');

const { isLoggedIn, isShopOwner } = require('../middleware');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.route('/')
    .get(restaurants.index)
    .post(isLoggedIn, upload.array('image'), catchAsync(restaurants.createRestaurant));

router.get('/new', isLoggedIn, restaurants.renderNewForm); 



router.route('/:id')
    .get(catchAsync(restaurants.showRestaurant))
    .put(isLoggedIn, isShopOwner, upload.array('image'), catchAsync(restaurants.editRestaurant))
    .delete(isLoggedIn, isShopOwner, catchAsync(restaurants.deleteRestaurant))

router.get('/:id/edit', isLoggedIn, isShopOwner, restaurants.renderEditRestaurant);

router.get('/:id/new', isLoggedIn, isShopOwner, restaurants.renderNewDishForm); 

router.route('/:id/menu')
    .get(catchAsync(restaurants.showMenu))
    .post(isLoggedIn, isShopOwner, upload.single('image'), restaurants.createDish)

router.route('/:id/order')
    .get(isLoggedIn, isShopOwner, catchAsync(restaurants.showOrders))
    .post(isLoggedIn, catchAsync(restaurants.order))

router.get('/:id/completedOrder', isLoggedIn, isShopOwner, catchAsync(restaurants.showCompletedOrder))    

router.get('/:id/order/filter',isLoggedIn, isShopOwner, catchAsync(restaurants.orderFilter))

router.get('/:id/floor/:number', isLoggedIn, isShopOwner, catchAsync(restaurants.showOrdersByFloor))

router.put('/:id/order/:orderId', isLoggedIn, isShopOwner, catchAsync(restaurants.sent));    

 
//can xac thuc joi va validateRoute

module.exports = router;

        
const Breakfast = require('../models/breakfasts');
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const breakfasts = await Breakfast.find({});
    res.render('breakfasts/index', { breakfasts });
}


module.exports.createBreakfast = async (req, res, next) => {
    const breakfast = new Breakfast(req.body.breakfast);
    breakfast.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    breakfast.author = req.user._id;
    const timestamp = Date.now();
    const date = new Date(timestamp);
    breakfast.date = date;
    await breakfast.save();
    console.log(breakfast);
    req.flash('success', 'Successfully create a Breakfast!');
    res.redirect('/breakfasts');
}

module.exports.renderNewForm = (req, res) => {
    res.render("breakfasts/new");
}

module.exports.showBreakfast = async (req, res, next) => {
    const { id } = req.params;
    const breakfast = await Breakfast.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!breakfast) {
        req.flash('error', 'Cannot find that Breakfast!');
        return res.redirect('/breakfasts');
    }
    res.render("breakfasts/show", { breakfast });
}

module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const breakfast = await Breakfast.findById(id);
    if (!breakfast) {
        req.flash('error', 'Cannot find that Breakfast!');
        return res.redirect('/breakfasts');
    }
    res.render('breakfasts/edit', { breakfast });
}

module.exports.editBreakfast = async (req, res, next) => {
    const { id } = req.params;
    const breakfast = await Breakfast.findByIdAndUpdate(id, { ...req.body.breakfast }, { new: true });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await breakfast.images.push(...imgs);
    await breakfast.save();
    req.flash('success', 'Successfully update Breakfast!');
    res.redirect(`/breakfasts/${breakfast._id}`);
}
// module.exports.editBreakfast = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const breakfast = await Breakfast.findByIdAndUpdate(id, { ...req.body.breakfast }, { new: true });

//         if (!breakfast) {
//             req.flash('error', 'Cannot find that breakfast!');
//             return res.redirect('/breakfasts');
//         }

//         // Chỉ xử lý ảnh nếu có file upload
//         console.log(req.files);
//         if (req.files && req.files.length > 0) {
//             const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
//             await breakfast.images.push(...imgs);
//             await breakfast.save();
//             console.log(breakfast);
//         }

//         req.flash('success', 'Successfully updated Breakfast!');
//         res.redirect(`/breakfasts/${breakfast._id}`);
//     } catch (err) {
//         console.error('Error in editBreakfast:', err);
//         req.flash('error', 'Something went wrong!');
//         res.redirect('/breakfasts');
//     }
// };



module.exports.deleteBreakfast = async (req, res, next) => {
    const { id } = req.params;
    await Breakfast.findByIdAndDelete(id);
    req.flash('success', 'Successfully delete Breakfast!');
    res.redirect('/breakfasts');
}

module.exports.randomBreakfast = async (req, res) => {
    try {
        const breakfasts = await Breakfast.find({});

        if (breakfasts.length === 0) {
            return res.status(404).send("No breakfasts found");
        }

        const randomIndex = Math.floor(Math.random() * breakfasts.length);
        const selectedBreakfast = breakfasts[randomIndex];

        res.redirect(`/breakfasts/${selectedBreakfast._id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
}
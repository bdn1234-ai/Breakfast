const express = require('express');
const router = express.Router();
const breakfasts = require('../controllers/breakfasts');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isBreakfastAuthor, validateBreakfast } = require('../middleware');
const multer = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage });



router.route('/')
    .get(breakfasts.index)
    .post(isLoggedIn, upload.array('image'), validateBreakfast, catchAsync(breakfasts.createBreakfast))

router.get('/random', breakfasts.randomBreakfast);

router.get('/new', isLoggedIn, breakfasts.renderNewForm)

router.route('/:id')
    .get(catchAsync(breakfasts.showBreakfast))
    .put(isLoggedIn, isBreakfastAuthor, upload.array('image'), validateBreakfast, catchAsync(breakfasts.editBreakfast))
    .delete(isLoggedIn, isBreakfastAuthor, catchAsync(breakfasts.deleteBreakfast))


router.get('/:id/edit', isLoggedIn, isBreakfastAuthor, catchAsync(breakfasts.renderEditForm))


module.exports = router;


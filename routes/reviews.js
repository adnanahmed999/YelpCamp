const express = require('express')
const router = express.Router({ mergeParams: true})

const catchAsync = require('../utils/catchAsync')

const CampGround = require('../models/campground');
const Review = require('../models/reviews');

const ExpressError = require('../utils/ExpressError')
const {reviewSchema} = require('../schemas')

const validateReview = (req, res, next)=> 
{
    const result = reviewSchema.validate(req.body);
    if(result.error)  {   
        throw new ExpressError(result.error.details[0].message, 500)
    } else { next() }
}

router.post('/',validateReview ,catchAsync( async(req,res)=> 
{   
    const camp = await CampGround.findById(req.params.id)
    const newReview = new Review(req.body)
    camp.review.push(newReview)
    await camp.save()
    await newReview.save()
    res.redirect(`/campgrounds/${camp._id}`)
}))

router.delete('/:ReviewId', catchAsync( async(req,res)=>
{
    const { id, ReviewId } = req.params
    await CampGround.findByIdAndUpdate(id, {$pull: {review: ReviewId}})
    await Review.findByIdAndDelete(ReviewId)
    console.log('out')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router
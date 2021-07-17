const express = require('express')
const router = express.Router()

const catchAsync = require('../utils/catchAsync')
const CampGround = require('../models/campground');

const ExpressError = require('../utils/ExpressError')
const {campgroundSchema} = require('../schemas')

const validateCampground = (req, res, next)=> 
{
    const result = campgroundSchema.validate(req.body);
    if(result.error)  {   
        throw new ExpressError(result.error.details[0].message, 500)
    } else { next() }
}

router.get('/', catchAsync( async (req,res)=> 
{  
    console.log("total list !!!") 
    const campgrounds = await CampGround.find()
    res.render('campgrounds/index.ejs',{campgrounds})
}))

router.get('/new', catchAsync( async (req,res)=> 
{   
    res.render('campgrounds/new.ejs')
}))

router.post('/',validateCampground, catchAsync( async (req,res)=> 
{   
    const newCamp = new CampGround(req.body)
    await newCamp.save()
    res.redirect(`/campgrounds/${newCamp._id}`)
}))

router.get('/:id', catchAsync( async (req,res)=> 
{   
        const campground = await CampGround.findById(req.params.id).populate('review')
        res.render('campgrounds/show.ejs',{campground})
}))

router.get('/:id/edit', catchAsync( async (req,res)=>
{   
        const id = req.params.id
        const campground = await CampGround.findById(id)
        res.render('campgrounds/edit',{campground})
}))

router.put('/:id',validateCampground, catchAsync( async (req,res)=> 
{   
        const campground = await CampGround.findByIdAndUpdate(req.params.id, req.body)
        res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id', catchAsync( async (req,res)=>
{
    await CampGround.findByIdAndDelete(req.params.id)
    res.redirect("/campgrounds")
}))

router.delete('/:id', async (req,res)=>
{   
    id = req.params.id
    await CampGround.findByIdAndDelete(id)
    req.redirect('/campgrounds')
} )

module.exports = router
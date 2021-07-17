const express = require('express')
const path = require('path')
const mongoose = require('mongoose');
const CampGround = require('./models/campground');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate') // for making boilerplate
const ExpressError = require('./utils/ExpressError')
const catchAsync = require('./utils/catchAsync')
const Joi = require('joi') // this is for preventing error.
const {campgroundSchema, reviewSchema} = require('./schemas')
const Review = require('./models/reviews');
const { CallTracker } = require('assert');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

mongoose.connect('mongodb://localhost/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex:true, 
    useUnifiedTopology: true})
        .then( ()=> {
            console.log("Connection Open")
        } )
        .catch( (err)=> {
            console.log(err)
        } )

const app = express()

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
mongoose.set('useFindAndModify', false);

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

app.engine('ejs', ejsMate);

app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

app.get('/', (req,res)=>
{
    res.render('campgrounds/home.ejs')
})

app.all('*', (req, res, next)=>
{
    next(new ExpressError('Page not found', 404)) 
})

app.use((err, req, res, next)=>
{
    const {statusCode=500} = err
    if(!err.message) err.message='Something went Wrong!!'
    res.status(statusCode).render('error', {err})
})

app.listen(3000, ()=> console.log("Serving on Port 3000") )
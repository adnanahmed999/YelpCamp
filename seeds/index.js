const mongoose = require('mongoose');
const CampGround = require('../models/campground')
const cities = require('./cities')
const {descriptors, places} = require('./seedHelpers')

// descriptors
// places

mongoose.connect('mongodb://localhost/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex:true, 
    useUnifiedTopology: true})
        .then( ()=>
        {
            console.log("Connection Open")
        } )
        .catch( (err)=>
        {
            console.log(err)
        } )

const RandomTitle = (arrayyy)=>
{
    return arrayyy[Math.floor(Math.random()*arrayyy.length)]
}

const seedDb = async ()=> {
    await CampGround.deleteMany()
    for(let i=0; i<50; i++)
    {
        const rand = Math.floor(Math.random()*1000)
        const randCity = cities[rand]
        const price = Math.floor(Math.random()*20) + 10
        const camp = new CampGround({
            location:`${randCity.city}-${randCity.state}`, title:`${RandomTitle(descriptors)} ${RandomTitle(places)}`,
            image:`https://source.unsplash.com/collection/483251`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni, ad. Quos dolore eos, ipsam hic praesentium provident facilis voluptatibus, necessitatibus voluptatum sit minus maiores voluptate, odit voluptas fugit magnam asperiores.' ,
            price: price 
        })
        await camp.save()
    }
    
}
    

seedDb().then( ()=> mongoose.connection.close())
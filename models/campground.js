const mongoose = require('mongoose')
const Review = require('./reviews')
const Schema = mongoose.Schema

const CampGroundSchema = new Schema( {
    title:String,
    price:Number,
    description:String,
    location:String,
    image:String,
    review: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
} )

CampGroundSchema.post('findOneAndDelete',async (deletedData)=> {
    if(deletedData) {
        await Review.deleteMany({
            _id: {
                $in: deletedData.review
            }
        })
    }
})

module.exports = mongoose.model('CampGround',CampGroundSchema)

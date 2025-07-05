const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const PropertySchema =  new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'users', required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    location: {
        type: {
            gps: {latitude: {type: Number}, longitude: {type: Number},},
            ghanaPostAddress: {type: String},
        },
        required: true,
        validate: {
            validator: function (v) {
                // ensure either GPS or Ghana Post Address is provided
                return (v.gps && v.gps.latitude && v.gps.longitude) || v.ghanaPostAddress;
            },
            message: 'Either GPS coordinates or Ghana Post Digital Address is required',
        },
    },
    images: [{type: String}],  //Array for max of 5 image URLs
    type: {type: String, enum: ['room', 'building', 'apartment'], required: true},
    beds: {type: Number, default: 0},
    baths: {type: Number, default: 0},
    createdAt: {type: Date, default: Date.now},
})


const PropertyModel = mongoose.model('properties', PropertySchema)

module.exports = PropertyModel
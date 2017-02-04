import mongoose from 'mongoose'

const Schema = mongoose.Schema

mongoose.Promise = global.Promise

const orderItemSchema = new Schema({
    primary_product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    secondary_product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    toppings: [{
        type: Schema.Types.ObjectId,
        ref: 'Topping'
    }],
    size: {
        type: String,
        enum: ['s', 'l', 'xl']
    }
})

export default mongoose.model('OrderItem', orderItemSchema)
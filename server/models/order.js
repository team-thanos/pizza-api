import mongoose from 'mongoose'

import OrderItem from './order-item'

const Schema = mongoose.Schema

mongoose.Promise = global.Promise

const orderSchema = new Schema({
    created_by: String,
    store: {
        type: Schema.Types.ObjectId,
        ref: 'Store'
    },
    items: [OrderItem.schema],
    created_at: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["neu", "backend", "fertig"],
        default: "neu"
    }
})

export default mongoose.model('Order', orderSchema)
import mongoose from 'mongoose'

const Schema = mongoose.Schema

mongoose.Promise = global.Promise

const productSchema = new Schema({
    name: String,
    description: String,
    price_s : Number,
    price_l : Number,
    price_xl: Number
})

export default mongoose.model('Product', productSchema)
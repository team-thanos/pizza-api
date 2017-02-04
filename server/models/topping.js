import mongoose from 'mongoose'

const Schema = mongoose.Schema

mongoose.Promise = global.Promise

const toppingSchema = new Schema({
    name        : String,
    description : String,
    price       : Number
})

export default mongoose.model('Topping', toppingSchema)
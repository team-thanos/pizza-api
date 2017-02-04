import mongoose from 'mongoose'

const Schema = mongoose.Schema

mongoose.Promise = global.Promise

const storeSchema = new Schema({
    name        : String,
    street      : String,
    postalCode  : String,
    city        : String,
    phoneNumber : String
})

export default mongoose.model('Store', storeSchema)
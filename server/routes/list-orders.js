import 'babel-polyfill'
import Router from 'koa-router'

import { baseApi } from '../config'

import Order from '../models/order'

const router = new Router()

router.prefix(`/${baseApi}/list-orders`)

/**
 * List all orders stored in the system.
 * This method is not very efficient as it returns all orders and the client has to filter them by store if neccessary.
 */
router.get('/', async(ctx) => {

    const orders = await Order.find()
        .populate('items.primary_product')
        .populate('items.secondary_product')
        .populate('items.toppings')
        .populate('store')

    ctx.body = orders
})

export default router
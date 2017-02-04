import 'babel-polyfill'
import Router from 'koa-router'

import lodash from 'lodash'
import mongoose from 'mongoose'

import AREA_CODES_DATA from '../mock-data/area-codes'
import PRODUCT_DATA    from '../mock-data/product'
import STORES_DATA     from '../mock-data/stores'
import TOPPINGS_DATA   from '../mock-data/toppings'

import Order        from '../models/order'
import OrderItem    from '../models/order-item'
import Product      from '../models/product'
import Store        from '../models/store'
import Topping      from '../models/topping'

import { baseApi } from '../config'

import each from 'async-each'

// ---
const OPT_PRICE_TOPPING = [0.25, 0.50, 0.75, 1.00]
const OPT_PRICE_S  = [5.49 , 5.99 , 6.49 , 6.99 ]
const OPT_PRICE_L  = [7.49 , 7.99 , 8.49 , 8.99 ]
const OPT_PRICE_XL = [11.49, 11.99, 12.49, 12.99]
const OPT_SIZE_OPTS = {s: 2, l: 3, xl: 5}
const OPT_NUM_CUSTOMERS = 50
const OPT_NUM_ORDERS_PER_CUSTOMER_MIN = 1
const OPT_NUM_ORDERS_PER_CUSTOMER_MAX = 5
const OPT_NUM_ORDER_ITEMS_PER_ORDER_MIN = 1
const OPT_NUM_ORDER_ITEMS_PER_ORDER_MAX = 12
const OPT_ORDER_STATUS = ["neu", "backend", "fertig"]

// create new router
const resetDbRouter = new Router();
resetDbRouter.prefix(`/${baseApi}/reset-db`);

resetDbRouter.get('/', async (ctx) => {

    // drops the database and reinitializes itself again post-drop
    mongoose.connection.db.dropDatabase(() => {

        var customers   = []
        var toppings    = []
        var products    = []
        var stores      = []
        var orders      = []

        // now only returns a phone number since the customer model has been removed for simplicity
        var createRandomCustomer = () => {
            return lodash.sample(AREA_CODES_DATA) + "/" + lodash.random(100000, 9999999)
        }

        // create a random order composed of random order items for a specific customer
        var createRandomOrderForCustomer = (customer) => {

            // create new order for the given customer
            var order = new Order()
            order.created_at.setTime(order.created_at.getTime() - 1000 * lodash.random(5 * 60, 48 * 60))
            order.created_by = customer

            // set random order status
            order.status = lodash.sample(OPT_ORDER_STATUS);
            
            // make a random store responsible for processing the order
            order.store = lodash.sample(stores);

            // create a random number of random order items
            let num_items = lodash.random(OPT_NUM_ORDER_ITEMS_PER_ORDER_MIN, OPT_NUM_ORDER_ITEMS_PER_ORDER_MAX)
            for (let i = 0; i < num_items; ++i) {
                order.items.push(createOrderItem())
            }

            return order
        }

        // create a random order item
        var createOrderItem = () => {

            // create new order item
            const orderItem = new OrderItem()

            // select random product size
            const size = lodash.sample(Object.keys(OPT_SIZE_OPTS))
            const maxNumToppings = OPT_SIZE_OPTS[size]
            orderItem.size = size

            // select random product(s)
            var apply_combo = false
            if ('s' != size) {
                if (lodash.random() <= 0.75) {
                    apply_combo = true
                }
            }
            if (! apply_combo) {
                orderItem.primary_product = lodash.sample(products)
                orderItem.secondary_product = orderItem.primary_product
            } else {
                var randomProducts = lodash.sampleSize(products, 2)
                orderItem.primary_product = randomProducts[0]
                orderItem.secondary_product = randomProducts[1]
            }

            // add a random number of unique toppings limited by the chosen product size
            const numToppings = lodash.random(0, maxNumToppings)
            lodash.sampleSize(toppings, numToppings).forEach((topping) => orderItem.toppings.push(topping))

            return orderItem
        };

        // load stores from fixture
        STORES_DATA.forEach(data => stores.push(new Store(data)))

        // load toppings from fixture + set random topping price
        TOPPINGS_DATA.forEach(data => {
            let topping = new Topping(data)
            topping.price = lodash.sample(OPT_PRICE_TOPPING)
            toppings.push(topping)
        })

        // create products from mock data + add some random stuff
        PRODUCT_DATA.forEach((data) => {

            // create new product
            const product = new Product(data)

            // assign pseudo random prices
            product.price_s  = lodash.sample(OPT_PRICE_S)
            product.price_l  = lodash.sample(OPT_PRICE_L)
            product.price_xl = lodash.sample(OPT_PRICE_XL)

            // add product to queue
            products.push(product)
        })

        // create random customers and orders
        for (let i = 0; i < OPT_NUM_CUSTOMERS; ++i) {

            // create customer
            let customer = createRandomCustomer()
            customers.push(customer)

            // create a random number of random orders for each customer
            let num_orders = lodash.random(OPT_NUM_ORDERS_PER_CUSTOMER_MIN, OPT_NUM_ORDERS_PER_CUSTOMER_MAX)
            for (let i = 0; i < num_orders; ++i) {
                orders.push(createRandomOrderForCustomer(customer));
            }
        }

        each(toppings   , async (topping)   => await topping.save())
        each(products   , async (product)   => await product.save())
        each(stores     , async (store)     => await store.save())
        each(orders     , async (order)     => await order.save())
    });

    ctx.body = {"msg": "init OK"}
});

export default resetDbRouter;
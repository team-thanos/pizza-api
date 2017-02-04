import RouterFactory from '../lib/RouterFactory';

import listOrdersRouter from './list-orders'
import resetDbRouter    from './reset-db';

import Order    from '../models/order'
import Product  from '../models/product'
import Store    from '../models/store'
import Topping  from '../models/topping'

const routes = [
    resetDbRouter,
    listOrdersRouter,
    RouterFactory.prototype.create('order'  , Order  ),
    RouterFactory.prototype.create('product', Product),
    RouterFactory.prototype.create('store'  , Store  ),
    RouterFactory.prototype.create('topping', Topping)
];

export default function (app) {
    routes.forEach((route) => {
        app .use(route.routes())
            .use(route.allowedMethods({
                throw: true
            }));
    })
}
import RouterFactory from '../lib/RouterFactory';

import initRouter from './init';
import listOrdersRouter from './list-orders'

import Order    from '../models/order'
import Product  from '../models/product'
import Store    from '../models/store'
import Topping  from '../models/topping'

const routes = [
    initRouter,
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
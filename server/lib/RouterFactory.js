import 'babel-polyfill'
import Router from 'koa-router'

import { baseApi } from '../config'

/**
 * Router Factory
 */

function RouterFactory() {
}

RouterFactory.prototype.create = function(pathFragment, modelClass) {

    const router = new Router();

    router.prefix(`/${baseApi}/${pathFragment}`);

    // GET /api/<name>
    router.get('/', RouterFactory.prototype.findAllFactoryFn(modelClass));

    // POST /api/<name>
    router.post('/', RouterFactory.prototype.createOneFactoryFn(modelClass));

    // GET /api/<name>/id
    router.get('/:id', RouterFactory.prototype.findByIdFactoryFn(modelClass));

    // PUT /api/<name>/id
    router.put('/:id', RouterFactory.prototype.updateOneFactoryFn(modelClass));

    // DELETE /api/<name>/id
    router.delete('/:id', RouterFactory.prototype.deleteOneFactoryFn(modelClass));

    return router;
};

RouterFactory.prototype.findAllFactoryFn = function(modelClass) {
    return async(ctx) => {
        ctx.body = await modelClass.find();
    };
};

RouterFactory.prototype.findByIdFactoryFn = function(modelClass) {
    return async(ctx) => {
        try {
            const record = await modelClass.findById(ctx.params.id);
            if (!record) {
                ctx.throw(404);
            }
            ctx.body = record;
        } catch (err) {
            if (err.name === 'CastError' || err.name === 'NotFoundError') {
                ctx.throw(404);
            }
            ctx.throw(500);
        }
    };
};

RouterFactory.prototype.createOneFactoryFn = function(modelClass) {
    return async(ctx) => {
        try {
            const record = await new modelClass(ctx.request.body).save();
            ctx.body = record;
        } catch (err) {
            ctx.throw(422);
        }
    };
};

// does not return the updated record
RouterFactory.prototype.updateOneFactoryFn = function(modelClass) {
    return async(ctx) => {
        try {
            const record = await modelClass.findByIdAndUpdate(ctx.params.id, ctx.request.body);
            if (!record) {
                ctx.throw(404);
            }
            ctx.body = record;
        } catch (err) {
            if (err.name === 'CastError' || err.name === 'NotFoundError') {
                ctx.throw(404);
            }
            ctx.throw(500);
        }
    };
};

RouterFactory.prototype.deleteOneFactoryFn = function(modelClass) {
    return async(ctx) => {
        try {
            const record = await modelClass.findByIdAndRemove(ctx.params.id);
            if (!record) {
                ctx.throw(404);
            }
            ctx.body = record;
        } catch (err) {
            if (err.name === 'CastError' || err.name === 'NotFoundError') {
                ctx.throw(404);
            }
            ctx.throw(500);
        }
    }
};

export default RouterFactory;
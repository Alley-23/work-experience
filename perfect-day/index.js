global.__IS_SERVER__ = true;
global.__IS_CLIENT__ = false;

import 'babel-polyfill';
import koa from 'koa';
import KoaRouter from 'koa-router';
import render from './middleware/render';
import createStore from './view/store';

var router = KoaRouter();
var app = koa();

router
    .get('/', function * (next) {
        yield next;
    })
    .get('/theme/:id', function * (next) {
        var actions = require('./view/action/theme');
        yield actions.getThemeById(this.params.id)(this.reduxStore.dispatch);
        yield next;
    });

app
    .use(function * (next) {
        this.reduxStore = createStore({});
        yield next;
    })
    .use(router.routes())
    .use(render);

app.listen(3000);
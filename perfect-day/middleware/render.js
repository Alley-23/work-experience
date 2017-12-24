import React from 'react';
import ReactDomServer from 'react-dom/server';
import { match, RoutingContext } from 'react-router';
import { Provider } from 'react-redux';
import routes from '../view/route/index.js';
import fs from 'fs';

function serverRender (url, store) {
    return new Promise(function (res, rej) {
        match({ routes: routes, location: url }, function (error, redirectLocation, renderProps) {
            var html;

            if (error) {
                rej(error);
                return;
            }

            if (redirectLocation) {
                return res({
                    redirect: redirectLocation
                });
            }

            html = ReactDomServer.renderToString(
                (
                    <Provider store={store}>
                        <RoutingContext {...renderProps} />
                    </Provider>
                )
            );

            return res({
                html: html
            });
        });
    });
}

module.exports = function * (next) {
    var ctx = this;
    var html = fs.readFileSync('./view/index.html', 'UTF-8');
    var store = this.reduxStore;
    serverRender(this.request.url, store)
        .then(function (result) {
            if (result.html) {
                ctx.body = html
                    .replace(/<%= HTML %>/g, result.html)
                    .replace(/<%= __INIT_DATA__ %>/, JSON.stringify(store.getState()))
                    .replace(/<%= LIBJS %>/, 'http://s1.wm1t.com/party/lib.js')
                    .replace(/<%= APPJS %>/, 'http://s1.wm1t.com/party/app.js')
                    .replace(/<%= STYLE %>/, 'http://s1.wm1t.com/party/style/index.css');
            }
        })
        .catch(function (err) {
            ctx.body = err.message;
        });

    yield next;
};
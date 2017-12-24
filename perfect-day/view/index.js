import React from 'react';
import ReactDom from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';

import store from './store';
import * as util from './util';
import routes from './route/index.js';
import * as BackendAPI from '../lib/backend_api';
import '../static/style/index.css';

if (util.isWeixin()) {
    document.body.classList.add('weixin');
    if (window.location.pathname !== '/payment') {
        BackendAPI.getWeixinConfig(window.location.href)
            .then(function (config) {
                config.jsApiList = [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'onMenuShareQZone',
                    'startRecord',
                    'stopRecord',
                    'onVoiceRecordEnd',
                    'playVoice',
                    'pauseVoice',
                    'stopVoice',
                    'onVoicePlayEnd',
                    'uploadVoice',
                    'downloadVoice',
                    'chooseImage',
                    'previewImage',
                    'uploadImage',
                    'downloadImage',
                    'translateVoice',
                    'getNetworkType',
                    'openLocation',
                    'getLocation',
                    'hideOptionMenu',
                    'showOptionMenu',
                    'hideMenuItems',
                    'showMenuItems',
                    'hideAllNonBaseMenuItem',
                    'showAllNonBaseMenuItem',
                    'closeWindow',
                    'scanQRCode',
                    'chooseWXPay',
                    'openProductSpecificView',
                    'addCard',
                    'chooseCard',
                    'openCard'
                ];
                window.wx.config(config);
            });
    }
}

if (util.isAndroid()) {
    document.body.classList.add('android');
}

if (util.isIOS()) {
    document.body.classList.add('ios');
}

ReactDom.render(
    <Provider store={store}>
        <Router history={ browserHistory }>
            {routes}
        </Router>
    </Provider>
, document.getElementById('app'));
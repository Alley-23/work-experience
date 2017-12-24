import { combineReducers } from 'redux';
import _ from 'underscore';

import * as themeReducers from './theme';
import * as caseReducers from './case';
import * as comboReducers from './combo';
import * as userReducers from './user';
import * as invitationReducers from './invitation';
import * as albumReducers from './album';
import * as orderReducers from './order';
import * as commodityReducers from './commodity';
import * as couponReducers from './coupon';
import * as cityReducers from './city';
import * as qrcodeReducers from './qrcode';
import * as bannerReducers from './banner';
import * as placeReducers from './place';

export default combineReducers(
    _.extend({},
        placeReducers,
        themeReducers,
        caseReducers,
        comboReducers,
        userReducers,
        invitationReducers,
        albumReducers,
        orderReducers,
        commodityReducers,
        couponReducers,
        cityReducers,
        qrcodeReducers,
        bannerReducers
    )
);

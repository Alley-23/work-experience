import request from 'superagent';
import Promise from './promise.js';
import Log from './log.js';
import _ from 'underscore';

var CA = Log.getCaInfo();

function url (path) {
    return 'http://m.party.wanmei.cn/api' + path;
}

function handleError (res) {
    var data, error = null;
    if (!res || !res.body) {
        return new Error('服务器异常，请稍后再试');
    }
    if (typeof res.body === 'object') {
        data = res.body;
    } else {
        try {
            data = JSON.parse(res.response.body);
        } catch(ex) {
            return new Error(res.response.statusCode === 500 ? '服务器异常，请稍后再试' : '网络异常，请稍后再试');
        }
    }

    error = new Error(data.message);
    error.code = data.code;
    error.data = data.data;

    return error;
}

function wrapper (fn) {
    return function (...args) {
        return new Promise(function (res, rej) {
            fn.apply(this, args)
                .query({_v: Date.now()})
                .set('X-CA', [
                    'ca_s:' + CA.ca_s,
                    'ca_n:' + CA.ca_n,
                    'ca_k:' + CA.ca_k,
                    'ca_i:' + CA.ca_i].join('|')
                )
                .end(function (err, result) {
                    if (err) {
                        rej(handleError(result));
                    } else {
                        res(result.body.data);
                    }
                });
        });
    };
}

export const getThemeDetail = wrapper(function  (params) {
    return request('GET', url('/theme/' + params.themeId))
        .query(_.extend({}, params, { themeId: undefined }));
});

export const getThemeList = wrapper(function (params) {
    return request('GET', url('/theme'))
        .query(params);
});

export const getThemeCategory = wrapper(function () {
    return request('GET', url('/theme/catalog'));
});

export const getComboList = wrapper(function (params) {
    return request('GET', url('/combo'))
        .query(params);
});

export const getComboDetail = wrapper(function (params) {
    return request('GET', url('/combo/' + params.comboId));
});

export const sendAuthCode = wrapper(function (params) {
    return request('POST', url('/session/auth_code'))
        .type('form')
        .send(params);
});

export const bindUserPhone = wrapper(function (params) {
    return request('PATCH', url('/user'))
        .type('form')
        .send(params);
});

export const getCurrentUser = wrapper(function () {
    return request('GET', url('/user'));
});

export const getQRCode = wrapper(function () {
    return request('GET', url('/user/qrcode'));
});

export const getInvitationList = wrapper(function () {
    return request('GET', url('/invitation'));
});

export const getInvitationDetail = wrapper(function (params) {
    return request('GET', url('/invitation/' + params.id))
            .query({sign: params.sign});
});

export const createInvitation = wrapper(function (params) {
    return request('POST', url('/invitation'))
            .type('json')
            .send(params);
});

export const getWeixinConfig = wrapper(function (site) {
    return request('GET', url('/wx/config'))
        .query({
            url: site
        });
});

export const createOrder = wrapper(function (params) {
    return request('POST', url('/order'))
        .send(params);
});

export const getAlbum = wrapper(function () {
    return request('GET', url('/album/'));
});

export const getAlbumByIdSign = wrapper(function (id, sign) {
    return request('GET', url(`/album/${id}/`)).query({sign});
});

export const getOrderDetail = wrapper(function (code, params) {
    return request('GET', url('/order/' + code))
        .query(params);
});

export const updateOrder = wrapper(function (code, params) {
    return request('PUT', url('/order/' + code))
        .send(params);
});

export const getOrderPaymentParams = wrapper(function (params) {
    return request('GET', url(`/order/${params.orderCode}/payment/${params.payId}`));
});

export const getOrderList = wrapper(function () {
    return request('GET', url('/order'));
});

export const getCommodityList = wrapper(function (params) {
    return request('GET', url('/commodity'))
        .query(params);
});

export const getCommodityDetailById = wrapper(function (id) {
    return request('GET', url('/commodity/' + id));
});

export const getAdultCommodity = wrapper(function (params) {
    return request('GET', url('/commodity/adult')).query(params);
});

export const getChildCommodity = wrapper(function (params) {
    return request('GET', url('/commodity/child')).query(params);
});

export const getPlaceList = wrapper(function (params) {
    return request('GET', url('/place'))
        .query(params);
});

export const getPlaceDetail = wrapper(function (params) {
    return request('GET', url(`/place/${params.placeId}`));
});

export const getPlaceCategory = wrapper(function () {
    return request('GET', url('/place/catalog'));
});

export const getPlaceDistrict = wrapper(function (params) {
    return request('GET', url('/place/district'))
        .query(params);
});

export const getCouponList = wrapper(function (params) {
    return request('GET', url('/coupon'))
        .query(params);
});

export const createAlbumShare = wrapper(function (albumId, imgIds) {
    return request('POST', url('/album/share/' + albumId))
        .type('json')
        .send(imgIds);
});

export const getAlbumSharePhone = wrapper(function (shareId, sign) {
    return request('GET', url(`/album/share/${shareId}/image`)).query({sign});
});

export const getAlbumShare = wrapper(function (shareId, sign) {
    return request('GET', url(`/album/share/${shareId}`)).query({sign});
});

export const ipToCity = wrapper(function () {
    return request('GET', url('/geo/ip2city'));
});

export const getBanner = wrapper(function (params) {
    return request('GET', url('/banner')).query(params);
});

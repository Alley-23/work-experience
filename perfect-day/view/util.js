import Cookie from '../lib/cookie';

export function isWeixin () {
    return /micromessenger/i.test(window.navigator.userAgent);
}

export function isIOS () {
    return /iPad|iPhone|iPod/.test(window.navigator.userAgent);
}

export function isAndroid () {
    return /android/i.test(window.navigator.userAgent);
}

export function resizeQiniuURL (params) {
    var query = '?imageView2/';

    query += params.cut ? '1/' : '2/';

    if (params.width) {
        query += 'w/' + parseInt(params.width) + '/';
    }

    if (params.height) {
        query += 'h/' + parseInt(params.height) + '/';
    }

    return params.url + query;
}

export function setWeixinShareConfig (config) {
    if (isWeixin()) {
        window.wx.ready(function () {
            [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone'
            ].forEach(function (api) {
                window.wx[api](config);
            });
        });
    }
}

export function defaultWxShare() {
    if (isWeixin()) {
        setWeixinShareConfig({
            title: '完美主题派对',
            desc: '最专业的儿童派对服务，梦幻般的派对体验',
            imgUrl: 'http://7xrz9e.com2.z0.glb.qiniucdn.com/party%E5%AE%8C%E7%BE%8E%E6%B4%BE%E5%AF%B91.jpg',
            link: 'http://m.party.wanmei.cn/'
        });
    }
}

export function loginToWeixin () {
    window.location.href = 'http://m.party.wanmei.cn/api/session/weixin?callback=' + encodeURIComponent(window.location.href);
}

export function weixinUserSessionErrorHandler (err) {
    if (isNeedLoginError(err)) {
        loginToWeixin();
    } else {
        throw err;
    }
}

export function isNeedLoginError (err) {
    return !!(err && err.code === -330004);
}

export function getCityId(query = {}) {
    let cityId = query.cityId || Cookie.get('cityId') || '1';
    Cookie.set('cityId', cityId);
    return cityId;
}

export function createAjaxAction (
    request, meta, FETCHING, FETCHED, FETCH_FAIL
) {
    return function (dispatch) {
        dispatch({
            type: FETCHING,
            meta: meta
        });
        request(meta)
            .then(
                (data) => dispatch({
                    type: FETCHED,
                    meta: meta,
                    payload: data
                }),
                (err) => dispatch({
                    type: FETCH_FAIL,
                    meta: meta,
                    payload: err
                })
            );
    };
}

export function createAjaxReducer (
    FETCHING,
    FETCHED,
    FETCH_FAIL
) {
    return function (
        state = { fetching: false, error: null, data: null, meta: null },
        action
    ) {
        switch (action.type) {
            case FETCHING:
                return {
                    fetching: true,
                    data: null,
                    meta: action.meta,
                    error: null
                };
            case FETCHED:
                return {
                    data: action.payload,
                    error: null,
                    meta: action.meta,
                    fetching: false
                };
            case FETCH_FAIL:
                return {
                    fetching: false,
                    meta: action.meta,
                    error: action.payload,
                    data: null
                };
            default:
                return state;
        }
    };
}

export function createAjaxListReducer(
    FETCHING,
    FETCHED,
    FETCH_FAIL
) {
    return function (
        state = { fetching: false, error: null, data: [], meta: null },
        action
    ) {
        switch (action.type) {
            case FETCHING:
                return {
                    fetching: true,
                    data: state.data,
                    meta: action.meta,
                    error: null
                };
            case FETCHED:
                let data = action.payload.data;
                let meta = action.meta;
                meta.page = action.payload.page;
                meta.pageSize = action.payload.pageSize;
                meta.total = action.payload.total;

                if (action.payload.page !== 0) {
                    data = state.data.concat(data);
                }

                if (data.length < (meta.page + 1) * meta.pageSize) {
                    meta.total = data.length;
                }

                return {
                    data: data,
                    error: null,
                    meta: meta,
                    fetching: false
                };
            case FETCH_FAIL:
                return {
                    fetching: false,
                    meta: action.meta,
                    error: action.payload,
                    data: state.data
                };
            default:
                return state;
        }
    };
}

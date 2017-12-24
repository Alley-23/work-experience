import _ from 'underscore';

import Cookie from './cookie.js';
import Promise from './promise.js';

var UUID_NAME = '__UUID';
var SID_NAME = '__SID';
var CA_NAME = '__CA';

var isWeixin = window.navigator.userAgent.match(/micromessenger\/([\d\.]+)/i);

var getUA = (function () {
    var result = [];

    result.push(['sc',[window.screen.width, window.screen.height].join('x')].join(':'));

    if (isWeixin) {
        result.push(['weixin', isWeixin[1]].join(':'));
    }

    return result.join('|');
})();

function getCaInfo() {
    var urlParams = getUrlParams();

    var fromUrl = {
        ca_s: urlParams.ca_s,
        ca_i: urlParams.ca_i,
        ca_n: urlParams.ca_n,
        ca_k: urlParams.ca_k
    };

    var fromLocal = (Cookie.get(CA_NAME) || '').split('|').reduce(function (ret, pair) {
        pair = pair.split(':');
        if (pair[0]) {
            ret[pair[0]] = decodeURIComponent(pair[1]);
        }
        return ret;
    }, {});

    var hasNewCaInfo = Object.keys(fromUrl).some(function (key) {
        return !!fromUrl[key];
    });

    var result = _.defaults({}, hasNewCaInfo ? fromUrl : fromLocal, {
        ca_s: '-',
        ca_i: '-',
        ca_n: '-',
        ca_k: '-'
    });

    var caStr = Object.keys(result).reduce(function (ret, key) {
        if (key && result[key] && result[key] !== '-') {
            ret.push(key + ':' + result[key]);
        }
        return ret;
    }, []).join('|');

    if (caStr) {
        Cookie.set(CA_NAME, caStr, {
            path: '/',
            domain: '.wanmei.cn'
        });
    } else {
        Cookie.remove(CA_NAME);
    }

    return result;
}

function getSid () {
    var sid = Cookie.get(SID_NAME);
    if (sid) {
        return sid;
    }

    sid = createUUID();

    Cookie.set(SID_NAME, sid, {
        domain: '.wanmei.cn',
        path: '/'
    });

    return sid;
}

var getUUID = (function () {
    var uuid = Cookie.get(UUID_NAME);
    if (uuid) {
        return uuid;
    }

    uuid = window.localStorage.getItem(UUID_NAME);

    if (!uuid) {
        uuid = createUUID();
    }

    Cookie.set(UUID_NAME, uuid, {
        path: '/',
        domain: '.wanmei.cn',
        expires: 86400 * 365// 1 years
    });

    try {
        window.localStorage.setItem(UUID_NAME, uuid);
    } catch (ex) {
        // ignore
    }

    return uuid;
})();

function createUUID () {
    /* jshint ignore:start */
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c == 'x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
    /* jshint ignore:end */
}

function getUrlParams () {
    var search = parseUrlQuery(window.location.search.replace(/^\?/, ''));
    var hash = parseUrlQuery(window.location.hash.replace(/^#/, '').split('?')[1] || '');

    return _.extend({}, hash, search);
}

function parseUrlQuery (str) {
    return str.split('&')
        .reduce(function (ret, pair) {
            pair = pair.split('=');
            if (pair[0]) {
                ret[pair[0]] = decodeURIComponent(pair[1]);
            }

            return ret;
        }, {});
}

function send (server, log) {
    var img = new Image();
    var caInfo = getCaInfo();

    Promise.all([
        getUUID,
        getUA
    ])
        .then(function (result) {
            var info = _.extend({
                ua: result[1],
                url: window.location.href,
                uid: (Cookie.get('ACCESS_USER_ID') || '-').replace(/^"(.*)"$/, '$1'),
                sid: getSid(),
                uuid: result[0],
                _rand: Date.now(),
                refer: document.referrer
            }, caInfo, log);

            img.src = server + Object.keys(info).map(function (key) {
                return key + '=' + (encodeURIComponent(info[key]) || '-');
            }).join('&');
        });
}

exports.getCaInfo = function () {
    return getCaInfo();
};

exports.sendPV = function (pt) {
    return send('http://s.wanmei.cn/p.gif?', {pt: pt || '-'});
};

exports.sendEV = function (pt, et) {
    return send('http://s.wanmei.cn/e.gif?', {
        et: et || '-',
        pt: pt || '-'
    });
};

exports.fetal = function (message, stack) {
    stack = (stack || '').split('\n').map(function (line) {
        return line.replace(/(at.*?)\(.*(:\d)*\)/g, '$1 $2').trim();
    }).join('|');

    return send('http://s.wanmei.cn/j.gif?', {
        m: message,
        s: stack
    });
};
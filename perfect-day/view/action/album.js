import {
    PHOTO_LIST_FETCHING,
    PHOTO_LIST_FETCH_SUCCESS,
    PHOTO_lIST_FETCH_FAIL,
    PHOTO_DETAIL_FETCHING,
    PHOTO_DETAIL_FETCH_SUCCESS,
    PHOTO_DETAIL_FETCH_FAIL,
    SHARE_PHOTO_FETCHING,
    SHARE_PHOTO_FETCH_SUCCESS,
    SHARE_PHOTO_FETCH_FAIL,
    ALBUM_SHARE_FETCHING,
    ALBUM_SHARE_FETCH_SUCCESS,
    ALBUM_SHARE_FETCH_FAIL
} from '../constant';
import {getAlbum, getAlbumByIdSign, getAlbumSharePhone, getAlbumShare} from '../../lib/backend_api';
import * as Util from '../util';


export function getPhotoListFetch (query) {
    return Util.createAjaxAction(
        getAlbum,
        query,
        PHOTO_LIST_FETCHING,
        PHOTO_LIST_FETCH_SUCCESS,
        PHOTO_lIST_FETCH_FAIL
    );
}

export function getPhotoDetailFetch(id, sign) {
    return function (dispatch) {
        dispatch({
            type: PHOTO_DETAIL_FETCHING
        });
        getAlbumByIdSign(id, sign)
            .then(function (data) {
                data.urlMapping = data.images.reduce(function (ret, item) {
                    ret[item.id] = item.url;
                    return ret;
                }, {});
                dispatch({
                    type: PHOTO_DETAIL_FETCH_SUCCESS,
                    payload: data,
                    meta: {id, sign}
                });
            })
            .catch(function (err) {
                dispatch({
                    type: PHOTO_DETAIL_FETCH_FAIL,
                    payload: err.message,
                    meta: {id, sign}
                });
            });

    };
}

export function getAlbumShareFetch (id, sign) {
    return Util.createAjaxAction(
        getAlbumShare.bind(null, id, sign),
        {id, sign},
        ALBUM_SHARE_FETCHING,
        ALBUM_SHARE_FETCH_SUCCESS,
        ALBUM_SHARE_FETCH_FAIL
    );
}

export function getSharePhotoFetch (id, sign) {
    return Util.createAjaxAction(
        getAlbumSharePhone.bind(null, id, sign),
        {id, sign},
        SHARE_PHOTO_FETCHING,
        SHARE_PHOTO_FETCH_SUCCESS,
        SHARE_PHOTO_FETCH_FAIL
    );
}

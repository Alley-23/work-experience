import * as BackendAPI from '../../lib/backend_api';
import {
    COUPON_LIST_FETCHING,
    COUPON_LIST_FETCH_SUCCESS,
    COUPON_LIST_FETCH_FAIL
} from '../constant';

export function getCouponList (params) {
    return function (dispatch) {
        dispatch({
            type: COUPON_LIST_FETCHING,
            meta: params
        });

        BackendAPI.getCouponList(params)
            .then(
                (data) => dispatch({
                    type: COUPON_LIST_FETCH_SUCCESS,
                    payload: data,
                    meta: params
                }),
                (err) => dispatch({
                    type: COUPON_LIST_FETCH_FAIL,
                    error: true,
                    payload: err,
                    meta: params
                })
            );
    };
}
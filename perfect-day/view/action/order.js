import _ from 'underscore';
import * as BackendAPI from '../../lib/backend_api';
import {
    UPDATE_ORDER_FORM,
    CLEAR_ORDER_FORM,
    ORDER_DETAIL_FETCHING,
    ORDER_DETAIL_FETCH_SUCCESS,
    ORDER_DETAIL_FETCH_FAIL,
    ORDER_LIST_FETCHING,
    ORDER_LIST_FETCH_SUCCESS,
    ORDER_LIST_FETCH_FAIL
} from '../constant';

export function updateOrderForm (data) {
    return function (dispatch) {
        dispatch({
            type: UPDATE_ORDER_FORM,
            payload: data
        });
    };
}

export function clearOrderForm () {
    return function (dispatch) {
        dispatch({
            type: CLEAR_ORDER_FORM
        });
    };
}

export function getOrderDetail (code, params) {
    return function (dispatch) {
        var meta = _.extend({}, { code }, params);
        dispatch({
            type: ORDER_DETAIL_FETCHING,
            meta
        });

        BackendAPI.getOrderDetail(code, params)
            .then(
                (data) => dispatch({
                    type: ORDER_DETAIL_FETCH_SUCCESS,
                    payload: data,
                    meta
                }),
                (err) => dispatch({
                    type: ORDER_DETAIL_FETCH_FAIL,
                    error: true,
                    payload: err,
                    meta
                })
            );
    };
}

export function getOrderList () {
    return function (dispatch) {
        dispatch({
            type: ORDER_LIST_FETCHING
        });

        BackendAPI.getOrderList()
            .then(
                (data) => dispatch({
                    type: ORDER_LIST_FETCH_SUCCESS,
                    payload: data
                }),
                (err) => dispatch({
                    type: ORDER_LIST_FETCH_FAIL,
                    error: true,
                    payload: err
                })
            );
    };
}
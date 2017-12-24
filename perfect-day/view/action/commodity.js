import * as BackendAPI from '../../lib/backend_api';
import {
    COMMODITY_LIST_FETCHING,
    COMMODITY_LIST_FETCH_SUCCESS,
    COMMODITY_LIST_FETCH_FAIL,
    ADULT_COMMODITY_FETCHING,
    ADULT_COMMODITY_FETCH_SUCCESS,
    ADULT_COMMODITY_FETCH_FAIL,
    CHILD_COMMODITY_FETCHING,
    CHILD_COMMODITY_FETCH_SUCCESS,
    CHILD_COMMODITY_FETCH_FAIL
} from '../constant';

export function getCommodityList (params) {
    return function (dispatch) {
        dispatch({
            type: COMMODITY_LIST_FETCHING
        });

        BackendAPI.getCommodityList(params)
            .then(
                (data) => dispatch({
                    type: COMMODITY_LIST_FETCH_SUCCESS,
                    payload: data,
                    meta: params
                }),
                (err) => dispatch({
                    type: COMMODITY_LIST_FETCH_FAIL,
                    error: true,
                    payload: err,
                    meta: params
                })
            );
    };
}

export function getAdultCommodity (params) {
    return function (dispatch) {
        dispatch({
            type: ADULT_COMMODITY_FETCHING,
            meta: params
        });

        BackendAPI.getAdultCommodity(params)
            .then(
                (data) => dispatch({
                    type: ADULT_COMMODITY_FETCH_SUCCESS,
                    payload: data,
                    meta: params
                }),
                (err) => dispatch({
                    type: ADULT_COMMODITY_FETCH_FAIL,
                    error: true,
                    payload: err,
                    meta: params
                })
            );
    };
}

export function getChildCommodity (params) {
    return function (dispatch) {
        dispatch({
            type: CHILD_COMMODITY_FETCHING,
            meta: params
        });

        BackendAPI.getChildCommodity(params)
            .then(
                (data) => dispatch({
                    type: CHILD_COMMODITY_FETCH_SUCCESS,
                    payload: data,
                    meta: params
                }),
                (err) => dispatch({
                    type: CHILD_COMMODITY_FETCH_FAIL,
                    error: true,
                    payload: err,
                    meta: params
                })
            );
    };
}
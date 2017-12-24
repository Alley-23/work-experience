import {
    COMBO_LIST_FETCHING,
    COMBO_LIST_FETCH_SUCCESS,
    COMBO_LIST_FETCH_FAIL,
    COMBO_DETAIL_FETCHING,
    COMBO_DETAIL_FETCH_SUCCESS,
    COMBO_DETAIL_FETCH_FAIL
} from '../constant';
import * as BackendAPI from '../../lib/backend_api';
import { createAjaxAction } from '../util';

export function getComboList (params) {
    return createAjaxAction(
        BackendAPI.getComboList,
        params,
        COMBO_LIST_FETCHING,
        COMBO_LIST_FETCH_SUCCESS,
        COMBO_LIST_FETCH_FAIL
    );
}

export function getComboDetail (params) {
    return createAjaxAction(
        BackendAPI.getComboDetail,
        params,
        COMBO_DETAIL_FETCHING,
        COMBO_DETAIL_FETCH_SUCCESS,
        COMBO_DETAIL_FETCH_FAIL
    );
}
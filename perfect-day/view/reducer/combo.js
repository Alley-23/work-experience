import {
    COMBO_LIST_FETCHING,
    COMBO_LIST_FETCH_FAIL,
    COMBO_LIST_FETCH_SUCCESS,
    COMBO_DETAIL_FETCHING,
    COMBO_DETAIL_FETCH_FAIL,
    COMBO_DETAIL_FETCH_SUCCESS
} from '../constant';
import { createAjaxListReducer, createAjaxReducer } from '../util';

export const comboList = createAjaxListReducer(
    COMBO_LIST_FETCHING,
    COMBO_LIST_FETCH_SUCCESS,
    COMBO_LIST_FETCH_FAIL
);

export const comboDetail = createAjaxReducer(
    COMBO_DETAIL_FETCHING,
    COMBO_DETAIL_FETCH_SUCCESS,
    COMBO_DETAIL_FETCH_FAIL
);
import {
    THEME_DETAIL_FETCHING,
    THEME_DETAIL_FETCH_SUCCESS,
    THEME_DETAIL_FETCH_FAIL,
    THEME_LIST_FETCHING,
    THEME_LIST_FETCH_FAIL,
    THEME_LIST_FETCH_SUCCESS,
    THEME_CATEGORY_FETCHING,
    THEME_CATEGORY_FETCH_FAIL,
    THEME_CATEGORY_FETCH_SUCCESS
} from '../constant';
import * as BackendAPI from '../../lib/backend_api.js';
import { createAjaxAction } from '../util';

export function getThemeDetail (params) {
    return createAjaxAction(
        BackendAPI.getThemeDetail,
        params,
        THEME_DETAIL_FETCHING,
        THEME_DETAIL_FETCH_SUCCESS,
        THEME_DETAIL_FETCH_FAIL
    );
}

export function getThemeList (params) {
    return createAjaxAction(
        BackendAPI.getThemeList,
        params,
        THEME_LIST_FETCHING,
        THEME_LIST_FETCH_SUCCESS,
        THEME_LIST_FETCH_FAIL
    );
}

export function getThemeCategory () {
    return createAjaxAction(
        BackendAPI.getThemeCategory,
        null,
        THEME_CATEGORY_FETCHING,
        THEME_CATEGORY_FETCH_SUCCESS,
        THEME_CATEGORY_FETCH_FAIL
    );
}
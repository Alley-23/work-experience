import {
    THEME_DETAIL_FETCH_SUCCESS,
    THEME_DETAIL_FETCH_FAIL,
    THEME_DETAIL_FETCHING,
    THEME_LIST_FETCHING,
    THEME_LIST_FETCH_FAIL,
    THEME_LIST_FETCH_SUCCESS,
    THEME_CATEGORY_FETCHING,
    THEME_CATEGORY_FETCH_SUCCESS,
    THEME_CATEGORY_FETCH_FAIL
} from '../constant';
import { createAjaxReducer, createAjaxListReducer } from '../util';

export const themeCategory = createAjaxReducer(
    THEME_CATEGORY_FETCHING,
    THEME_CATEGORY_FETCH_SUCCESS,
    THEME_CATEGORY_FETCH_FAIL
);

export const themeDetail = createAjaxReducer(
    THEME_DETAIL_FETCHING,
    THEME_DETAIL_FETCH_SUCCESS,
    THEME_DETAIL_FETCH_FAIL
);

export const themeList = createAjaxListReducer(
    THEME_LIST_FETCHING,
    THEME_LIST_FETCH_SUCCESS,
    THEME_LIST_FETCH_FAIL
);
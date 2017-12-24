import {
    PLACE_LIST_FETCHING,
    PLACE_LIST_FETCH_SUCCESS,
    PLACE_LIST_FETCH_FAIL,
    PLACE_DETAIL_FETCHING,
    PLACE_DETAIL_FETCH_SUCCESS,
    PLACE_DETAIL_FETCH_FAIL
} from '../constant';
import { createAjaxListReducer, createAjaxReducer } from '../util';

export const placeList = createAjaxListReducer(
    PLACE_LIST_FETCHING,
    PLACE_LIST_FETCH_SUCCESS,
    PLACE_LIST_FETCH_FAIL
);

export const placeDetail = createAjaxReducer(
    PLACE_DETAIL_FETCHING,
    PLACE_DETAIL_FETCH_SUCCESS,
    PLACE_DETAIL_FETCH_FAIL
);
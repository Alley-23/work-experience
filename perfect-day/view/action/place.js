import * as BackendAPI from '../../lib/backend_api';
import {
    PLACE_LIST_FETCHING,
    PLACE_LIST_FETCH_SUCCESS,
    PLACE_LIST_FETCH_FAIL,
    PLACE_DETAIL_FETCHING,
    PLACE_DETAIL_FETCH_SUCCESS,
    PLACE_DETAIL_FETCH_FAIL
} from '../constant';
import { createAjaxAction } from '../util';

export function getPlaceList (meta) {
    return createAjaxAction(
        BackendAPI.getPlaceList,
        meta,
        PLACE_LIST_FETCHING,
        PLACE_LIST_FETCH_SUCCESS,
        PLACE_LIST_FETCH_FAIL
    );
}

export function getPlaceDetail (meta) {
    return createAjaxAction(
        BackendAPI.getPlaceDetail,
        meta,
        PLACE_DETAIL_FETCHING,
        PLACE_DETAIL_FETCH_SUCCESS,
        PLACE_DETAIL_FETCH_FAIL
    );
}
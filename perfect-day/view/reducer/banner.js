import {
    BANNER_FETCHING,
    BANNER_FETCH_SUCCESS,
    BANNER_FETCH_FAIL
} from '../constant';
import * as Util from '../util';

export const banner = Util.createAjaxReducer(
    BANNER_FETCHING,
    BANNER_FETCH_SUCCESS,
    BANNER_FETCH_FAIL
);
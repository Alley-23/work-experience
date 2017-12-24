import * as Util from '../util';
import * as BackendAPI from '../../lib/backend_api';
import {
    BANNER_FETCHING,
    BANNER_FETCH_SUCCESS,
    BANNER_FETCH_FAIL
} from '../constant';


export function getBanner (query={ cityId: 1}) {
    return Util.createAjaxAction(
        BackendAPI.getBanner,
        query,
        BANNER_FETCHING,
        BANNER_FETCH_SUCCESS,
        BANNER_FETCH_FAIL
    );
}
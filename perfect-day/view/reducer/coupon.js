import objectAssign from 'object-assign';
import {
    COUPON_LIST_FETCH_SUCCESS,
    COUPON_LIST_FETCH_FAIL,
    COUPON_LIST_FETCHING
} from '../constant';

export function couponList (state, action) {
    if (!state) {
        state = {
            fetching: false,
            error: null,
            data: null,
            meta: null
        };
    }

    switch (action.type) {
        case COUPON_LIST_FETCH_SUCCESS:
            return objectAssign({}, {
                error: null,
                fetching: false,
                data: action.payload,
                meta: action.meta
            });
        case COUPON_LIST_FETCH_FAIL:
            return objectAssign({}, {
                error: action.payload,
                fetching: false,
                data: null,
                meta: action.meta
            });
        case COUPON_LIST_FETCHING:
            return {
                error: false,
                fetching: true,
                data: null,
                meta: action.meta
            };
        default:
            return state;
    }
}
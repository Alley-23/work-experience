import objectAssign from 'object-assign';
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

export function commodityList (state, action) {
    if (!state) {
        state = {
            fetching: false,
            error: null,
            data: null,
            meta: null
        };
    }

    switch (action.type) {
        case COMMODITY_LIST_FETCH_SUCCESS:
            return objectAssign({}, {
                error: null,
                fetching: false,
                data: action.payload,
                meta: action.meta
            });
        case COMMODITY_LIST_FETCH_FAIL:
            return objectAssign({}, {
                error: action.payload,
                fetching: false,
                data: null,
                meta: action.meta
            });
        case COMMODITY_LIST_FETCHING:
            return {
                error: false,
                fetching: true,
                data: null,
                meta: null
            };
        default:
            return state;
    }
}

export function adultCommodity (state, action) {
    if (!state) {
        state = {
            fetching: false,
            error: null,
            data: null,
            meta: null
        };
    }

    switch (action.type) {
        case ADULT_COMMODITY_FETCH_SUCCESS:
            return objectAssign({}, {
                error: null,
                fetching: false,
                data: action.payload,
                meta: action.meta
            });
        case ADULT_COMMODITY_FETCH_FAIL:
            return objectAssign({}, {
                error: action.payload,
                fetching: false,
                data: null,
                meta: action.meta
            });
        case ADULT_COMMODITY_FETCHING:
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
export function childCommodity (state, action) {
    if (!state) {
        state = {
            fetching: false,
            error: null,
            data: null,
            meta: null
        };
    }

    switch (action.type) {
        case CHILD_COMMODITY_FETCH_SUCCESS:
            return objectAssign({}, {
                error: null,
                fetching: false,
                data: action.payload,
                meta: action.meta
            });
        case CHILD_COMMODITY_FETCH_FAIL:
            return objectAssign({}, {
                error: action.payload,
                fetching: false,
                data: null,
                meta: action.meta
            });
        case CHILD_COMMODITY_FETCHING:
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
import objectAssign from 'object-assign';
import { CASE_DETAIL_FETCH_FAIL, CASE_DETAIL_FETCH_SUCCESS, CASE_LIST_FETCH_SUCCESS } from '../constant';

export function caseDetail (state, action) {
    if (!state) {
        state = {
            error: null,
            data: null
        };
    }

    switch (action.type) {
        case CASE_DETAIL_FETCH_FAIL:
            return objectAssign({}, {
                error: action.payload,
                data: null
            });
        case CASE_DETAIL_FETCH_SUCCESS:
            return objectAssign({}, {
                error: null,
                data: action.payload
            });
        default:
            return state;
    }
}

export function caseList (state, action) {
    if (!state) {
        state = {
            data: null
        };
    }
    switch (action.type) {
        case CASE_LIST_FETCH_SUCCESS:
            return {
                data: action.payload
            };
        default:
            return state;
    }
}
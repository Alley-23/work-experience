import objectAssign from 'object-assign';
import { USER_FETCH_SUCCESS, USER_FETCH_FAIL, USER_FETCHING } from '../constant';

export function user (state, action) {
    if (!state) {
        state = {
            fetching: false,
            error: null,
            data: null
        };
    }

    switch (action.type) {
        case USER_FETCH_SUCCESS:
            return objectAssign({}, {
                error: null,
                fetching: false,
                data: action.payload
            });
        case USER_FETCH_FAIL:
            return objectAssign({}, {
                error: action.payload,
                fetching: false,
                data: null
            });
        case USER_FETCHING:
            return {
                error: false,
                fetching: true,
                data: null
            };
        default:
            return state;
    }
}
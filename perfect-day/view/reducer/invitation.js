import objectAssign from 'object-assign';
import {
    INVITATION_LIST_FETCHING,
    INVITATION_LIST_FETCH_SUCCESS,
    INVITATION_LIST_FETCH_FAIL,
    INVITATION_DETAIL_FETCHING,
    INVITATION_DETAIL_FETCH_SUCCESS,
    INVITATION_DETAIL_FETCH_FAIL
} from '../constant';
import { createAjaxReducer } from '../util';

export function invitationList (state, action) {
    if (!state) {
        state = {
            fetching: false,
            error: null,
            data: null
        };
    }

    switch (action.type) {
        case INVITATION_LIST_FETCH_SUCCESS:
            return objectAssign({}, {
                error: null,
                fetching: false,
                data: action.payload
            });
        case INVITATION_LIST_FETCH_FAIL:
            return objectAssign({}, {
                error: action.payload,
                fetching: false,
                data: null
            });
        case INVITATION_LIST_FETCHING:
            return {
                error: false,
                fetching: true,
                data: null
            };
        default:
            return state;
    }
}

export const invitationDetail = createAjaxReducer(
    INVITATION_DETAIL_FETCHING,
    INVITATION_DETAIL_FETCH_SUCCESS,
    INVITATION_DETAIL_FETCH_FAIL
);

import {
    INVITATION_LIST_FETCHING,
    INVITATION_LIST_FETCH_SUCCESS,
    INVITATION_LIST_FETCH_FAIL,
    INVITATION_DETAIL_FETCHING,
    INVITATION_DETAIL_FETCH_SUCCESS,
    INVITATION_DETAIL_FETCH_FAIL
} from '../constant';
import * as BackendAPI from '../../lib/backend_api';
import * as Util from '../util';

export function getInvitationList () {
    return function (dispatch) {
        dispatch({
            type: INVITATION_LIST_FETCHING
        });

        BackendAPI.getInvitationList()
            .then(
                (data) => dispatch({
                    type: INVITATION_LIST_FETCH_SUCCESS,
                    payload: data
                }),
                (err) => dispatch({
                    type: INVITATION_LIST_FETCH_FAIL,
                    error: true,
                    payload: err
                })
            );
    };
}

export function getInvitationDetail (params) {
    return Util.createAjaxAction(
        BackendAPI.getInvitationDetail,
        params,
        INVITATION_DETAIL_FETCHING,
        INVITATION_DETAIL_FETCH_SUCCESS,
        INVITATION_DETAIL_FETCH_FAIL
    );
}

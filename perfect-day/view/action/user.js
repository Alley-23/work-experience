import * as BackendAPI from '../../lib/backend_api';
import { USER_FETCH_SUCCESS, USER_FETCH_FAIL, USER_FETCHING } from '../constant';

export function getCurrentUser () {
    return function (dispatch) {
        dispatch({
            type: USER_FETCHING
        });

        BackendAPI.getCurrentUser()
            .then(
                (data) => dispatch({
                    type: USER_FETCH_SUCCESS,
                    error: false,
                    payload: data
                }),
                (err) => dispatch({
                    type: USER_FETCH_FAIL,
                    error: false,
                    payload: err
                })
            );
    };
}
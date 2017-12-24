import {
    USER_QRCODE_FETCHING,
    USER_QRCODE_FETCH_SUCCESS,
    USER_QRCODE_FETCH_FAIL
} from '../constant';
import Promise from '../../lib/Promise';
import {getCurrentUser, getQRCode} from '../../lib/backend_api';


export function getUserQRCodeFetch() {
    return function (dispatch) {
        dispatch({
            type: USER_QRCODE_FETCHING
        });
        Promise.all([getCurrentUser(), getQRCode()])
            .then(function (args) {
                dispatch({
                    type: USER_QRCODE_FETCH_SUCCESS,
                    data: args[1],
                    user: args[0]
                });
            })
            .catch(function (err) {
                dispatch({
                    type: USER_QRCODE_FETCH_FAIL,
                    err: err.message
                });
            });

    };
}

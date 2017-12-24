import {
    USER_QRCODE_FETCHING,
    USER_QRCODE_FETCH_SUCCESS,
    USER_QRCODE_FETCH_FAIL
} from '../constant';

export function userQRCode(state = {loading: true}, action) {
    switch (action.type) {
        case USER_QRCODE_FETCHING:
            return {
                loading: true
            };
        case USER_QRCODE_FETCH_SUCCESS:
            return {
                loading: false,
                data: action.data,
                user: action.user,
                err: null
            };
        case USER_QRCODE_FETCH_FAIL:
            return {
                loading: false,
                err: action.err,
                data: null
            };
        default:
            return state;
    }
}

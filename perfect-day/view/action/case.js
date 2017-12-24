import { CASE_LIST_FETCH_SUCCESS, CASE_DETAIL_FETCH_SUCCESS, CASE_DETAIL_FETCH_FAIL } from '../constant';
import CASE_DATA from '../data/cases.json';

export function getCaseList () {
    return function (dispatch) {
        dispatch({
            type: CASE_LIST_FETCH_SUCCESS,
            error: false,
            payload: CASE_DATA
        });
    };
}

export function getCaseById (id) {
    return function (dispatch) {
        var temp;
        for (var i = 0; i < CASE_DATA.length; i++) {
            temp = CASE_DATA[i];
            if (temp.id.toString() === id.toString()) {
                dispatch({
                    type: CASE_DETAIL_FETCH_SUCCESS,
                    error: false,
                    payload: temp
                });
                return;
            }
        }

        dispatch({
            type: CASE_DETAIL_FETCH_FAIL,
            error: true,
            payload: new Error('未找到相关案例')
        });
    };
}
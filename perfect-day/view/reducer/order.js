import _ from 'underscore';
import objectAssign from 'object-assign';

import {
    UPDATE_ORDER_FORM,
    CLEAR_ORDER_FORM,
    ORDER_DETAIL_FETCHING,
    ORDER_DETAIL_FETCH_SUCCESS,
    ORDER_DETAIL_FETCH_FAIL,
    ORDER_LIST_FETCH_SUCCESS,
    ORDER_LIST_FETCH_FAIL,
    ORDER_LIST_FETCHING
} from '../constant';

var ORDER_FORM_DEFAULT = {
    comboId: null,
    themeId: null,
    placeId: null,
    ticketId: null,
    orderCode: null,
    partyTime: null,
    kidName: null,
    kidGender: 1,
    kidBirthday: null,
    kidRemark: null,
    partyKidsNumber: null,
    partyParentsNumber: null,
    contactPhone: null,
    commodities: null
};

export function orderForm (state, action) {
    if (!state) {
        state = ORDER_FORM_DEFAULT;
    }

    if (action.type === UPDATE_ORDER_FORM) {
        return _.defaults({}, action.payload, state);
    } else if (action.type === CLEAR_ORDER_FORM) {
        return ORDER_FORM_DEFAULT;
    } else {
        return state;
    }
}

export function orderDetail (state, action) {
    if (!state) {
        state = {
            fetching: false,
            error: null,
            data: null,
            meta: null
        };
    }

    switch (action.type) {
        case ORDER_DETAIL_FETCH_SUCCESS:
            return objectAssign({}, {
                error: null,
                fetching: false,
                data: action.payload,
                meta: action.meta
            });
        case ORDER_DETAIL_FETCH_FAIL:
            return objectAssign({}, {
                error: action.payload,
                fetching: false,
                data: null,
                meta: action.meta
            });
        case ORDER_DETAIL_FETCHING:
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

export function orderList (state, action) {
    if (!state) {
        state = {
            fetching: false,
            error: null,
            data: null
        };
    }

    switch (action.type) {
        case ORDER_LIST_FETCH_SUCCESS:
            return objectAssign({}, {
                error: null,
                fetching: false,
                data: action.payload
            });
        case ORDER_LIST_FETCH_FAIL:
            return objectAssign({}, {
                error: action.payload,
                fetching: false,
                data: null
            });
        case ORDER_LIST_FETCHING:
            return {
                error: false,
                fetching: true,
                data: null
            };
        default:
            return state;
    }
}
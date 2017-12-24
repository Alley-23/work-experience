import {
    CITY_UPDATING,
    CITY_UPDATE
} from '../constant';

export function city (state, action) {
    if (!state) {
        state = {
            updating: false,
            data: null
        };
    }

    switch (action.type) {
        case CITY_UPDATING:
            return {
                updating: true,
                data: null
            };
        case CITY_UPDATE:
            return {
                updating: false,
                data: action.payload
            };
        default:
            return state;
    }
}
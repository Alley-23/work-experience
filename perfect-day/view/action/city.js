import * as BackendAPI from '../../lib/backend_api';
import Cookie from '../../lib/cookie';
import { CITY_UPDATE, CITY_UPDATING } from '../constant';
import CITY_DATA from '../data/city.json';

export function getCityInfo () {
    return function (dispatch) {
        dispatch({
            type: CITY_UPDATING
        });

        var cityId = Cookie.get('cityId');

        var defaults = {
            id: '1',
            name: CITY_DATA['1'].name
        };

        if (cityId && CITY_DATA[cityId]) {
            defaults = {
                id: cityId,
                name: CITY_DATA[cityId].name
            };
        }

        BackendAPI.ipToCity()
            .then(
                (data) => {
                    if (CITY_DATA[data.id]) {
                        Cookie.set('cityId', data.id);

                        dispatch({
                            type: CITY_UPDATE,
                            payload: {
                                id: data.id,
                                name: CITY_DATA[data.id].name
                            }
                        });
                    } else {
                        dispatch({
                            type: CITY_UPDATE,
                            payload: defaults
                        });
                    }
                },
                () => dispatch({
                    type: CITY_UPDATE,
                    payload: defaults
                })
            );
    };
}

export function setCityInfo (params) {
    return function (dispatch) {
        var cityId = params.cityId;
        var cityInfo = CITY_DATA[cityId];
        if (cityInfo) {
            cityInfo = {
                id: cityId,
                name: cityInfo.name
            };
        } else {
            cityInfo = {
                id: '1',
                name: CITY_DATA['1'].name
            };
        }

        Cookie.set('cityId', cityInfo.id);

        dispatch({
            type: CITY_UPDATE,
            payload: {
                id: params.cityId,
                name: params.name || cityInfo.name
            }
        });
    };
}
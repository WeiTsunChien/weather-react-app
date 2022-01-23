import {
    GET_CURRENT_WEATHER_REPORTS,
    GET_WEATHER_FORECASTS,
    GET_SUN_TIME
} from '../constants/actionTypes';

const INIT_STATE = {
    currentWeatherReports: [],
    cityFilters: [],
    weatherForecasts: [],
    sumTime: {
        date: null,
        sunriseTime: null,
        sunsetTime: null,
    }
};

export default function (state = INIT_STATE, action) {
    switch (action.type) {
        case GET_CURRENT_WEATHER_REPORTS:
            //console.log("weatherReducer 取得當前天氣報告");

            let cities = action.payload.map(item => item.CITY);
            //console.log(cities);

            let uniqueCities = [...new Set(cities)];
            //console.log(uniqueCities);

            let cityFilters = uniqueCities.map((city) => {
                return {
                    text: city,
                    value: city,
                };
            });

            return { ...state, currentWeatherReports: action.payload, cityFilters };
        case GET_WEATHER_FORECASTS:
            return { ...state, weatherForecasts: action.payload };
        case GET_SUN_TIME:
            return { ...state, sumTime: action.payload };
        default:
            return state;
    }
}
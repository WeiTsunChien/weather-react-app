import {
    GET_CURRENT_WEATHER_REPORTS,
    GET_WEATHER_FORECASTS,
    GET_SUN_TIME
} from '../constants/actionTypes';
import API from '../config/axiosConfig';
import { TOKEN } from '../constants/appSettings';
import { extractLevel1Props } from '../js/objectHandler.js';
import { convertNameValueArrayToObject } from '../js/arrayHandler.js';
import { getPeriod } from '../js/functions';

//現在天氣觀測報告
export const getCurrentWeatherReports = () => async dispatch => {
    const url = `/O-A0003-001?Authorization=${TOKEN}&elementName=WDSD,TEMP,Weather&parameterName=CITY,TOWN`;

    try {
        const response = await API.get(url);

        if (response.status == 200) {

            let data = response.data.records.location.map((report) => {
                let level1Obj = extractLevel1Props(report);
                let time = report['time'];
                let parameter = convertNameValueArrayToObject(report['parameter']);
                let weatherElement = convertNameValueArrayToObject(report['weatherElement']);
                weatherElement.TEMP = Math.round(weatherElement.TEMP);

                if (weatherElement.TEMP == -99)
                    weatherElement.TEMP = '無資料';

                weatherElement.WDSD = weatherElement.WDSD == "-99" ?
                    '無資料' :
                    `${Number(weatherElement.WDSD).toFixed(1)}m/h`;

                if (weatherElement.Weather == '-99')
                    weatherElement.Weather = '無資料';

                return { ...level1Obj, ...time, ...weatherElement, ...parameter };
            });

            dispatch({
                type: GET_CURRENT_WEATHER_REPORTS,
                payload: data
            });
        }
    } catch (error) {
        console.error(error);
    }
}

//今明 36 小時天氣預報
export const getWeatherForecasts = (cityName) => async dispatch => {
    const url = `/F-C0032-001?Authorization=${TOKEN}&locationName=${cityName}&sort=time`;

    try {
        const response = await API.get(url);

        if (response.status == 200) {
            let data = [];
            const location = response.data.records.location[0];

            if (location.weatherElement.length) {
                const firstElement = location.weatherElement[0];

                data.push({
                    startTime: firstElement.time[0].startTime,
                    endTime: firstElement.time[0].endTime,
                });
                data.push({
                    startTime: firstElement.time[1].startTime,
                    endTime: firstElement.time[1].endTime,
                });
                data.push({
                    startTime: firstElement.time[2].startTime,
                    endTime: firstElement.time[2].endTime,
                });
            }

            const wx = location.weatherElement.find(x => x.elementName == 'Wx');
            const poP = location.weatherElement.find(x => x.elementName == 'PoP');
            const minT = location.weatherElement.find(x => x.elementName == 'MinT');
            const maxT = location.weatherElement.find(x => x.elementName == 'MaxT');
            const ci = location.weatherElement.find(x => x.elementName == 'CI');

            for (let index in data) {
                let item = data[index];
                item.period = getPeriod(item.startTime);
                item.wxName = wx.time[index].parameter.parameterName;
                item.wxValue = wx.time[index].parameter.parameterValue;
                item.poP = poP.time[index].parameter.parameterName;
                item.minT = minT.time[index].parameter.parameterName;
                item.maxT = maxT.time[index].parameter.parameterName;
                item.ci = ci.time[index].parameter.parameterName;
            }

            dispatch({
                type: GET_WEATHER_FORECASTS,
                payload: data
            });
        }
    } catch (error) {
        console.error(error);
    }
}

//日出日沒時刻
export const getSumTime = (cityName, date) => async dispatch => {
    const url = `/A-B0062-001?Authorization=${TOKEN}&locationName=${cityName}&dataTime=${date}`;

    try {
        const response = await API.get(url);

        if (response.status == 200) {
            let sumTime = {
                date: null,
                sunriseTime: null,
                sunsetTime: null,
            };

            if (response.data.records.locations.location.length) {
                const location = response.data.records.locations.location[0];
                if (location.time.length) {
                    const time = location.time[0];
                    sumTime.date = date;
                    sumTime.sunriseTime = time.parameter.find(x => x.parameterName == '日出時刻').parameterValue;
                    sumTime.sunsetTime = time.parameter.find(x => x.parameterName == '日沒時刻').parameterValue;
                }
            }

            dispatch({
                type: GET_SUN_TIME,
                payload: sumTime
            });
        }
    } catch (error) {
        console.error(error);
    }
}
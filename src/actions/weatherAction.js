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
    console.log("取得當前天氣報告 1");
    const url = `/O-A0003-001?Authorization=${TOKEN}&elementName=WDSD,TEMP,Weather&parameterName=CITY,TOWN`;

    try {
        const response = await API.get(url);

        if (response.status == 200) {

            console.log("取得當前天氣報告 2 處理回傳資料");

            let data = response.data.records.location.map((report) => {
                let level1Obj = extractLevel1Props(report);
                let time = report['time'];
                let weatherElement = convertNameValueArrayToObject(report['weatherElement']);
                weatherElement.TEMP = Math.round(weatherElement.TEMP);

                if (weatherElement.TEMP == -99)
                    weatherElement.TEMP = '';

                weatherElement.WDSD = weatherElement.WDSD == "-99" ?
                    '' :
                    `${Number(weatherElement.WDSD).toFixed(1)}m/h`;

                if (weatherElement.Weather == '-99')
                    weatherElement.Weather = '';

                //console.log(weatherElement);
                let parameter = convertNameValueArrayToObject(report['parameter']);
                return { ...level1Obj, ...time, ...weatherElement, ...parameter };
            });

            //console.log(data);
            data.push({
                CITY: "新竹市",
                TEMP: "1.80",
                TOWN: "01區",
                WDSD: "1.20",
                Weather: "陰有雨",
                lat: "24.29821780",
                locationName: "國四E5K",
                lon: "120.63496810",
                obsTime: "2022-01-01 17:40:00",
                stationId: "CAF090111001"
            });
            data.push({
                CITY: "新竹市",
                TEMP: "10.80",
                TOWN: "10區",
                WDSD: "1.20",
                Weather: "陰有雨",
                lat: "24.29821780",
                locationName: "國四E5K",
                lon: "120.63496810",
                obsTime: "2022-01-10 17:40:00",
                stationId: "CAF0901110"
            });
            data.push({
                CITY: "新竹市",
                TEMP: "15.80",
                TOWN: "15區",
                WDSD: "1.20",
                Weather: "陰有雨",
                lat: "24.29821780",
                locationName: "國四E5K",
                lon: "120.63496810",
                obsTime: "2022-01-15 17:40:00",
                stationId: "CAF0901115"
            });
            data.push({
                CITY: "新竹市",
                TEMP: "19.80",
                TOWN: "19區",
                WDSD: "1.20",
                Weather: "陰有雨",
                lat: "24.29821780",
                locationName: "國四E5K",
                lon: "120.63496810",
                obsTime: "2022-01-19 17:40:00",
                stationId: "CAF0901119"
            });
            data.push({
                CITY: "新竹市",
                TEMP: "20.80",
                TOWN: "20區",
                WDSD: "1.20",
                Weather: "陰有雨",
                lat: "24.29821780",
                locationName: "國四E5K",
                lon: "120.63496810",
                obsTime: "2022-01-20 17:40:00",
                stationId: "CAF09011"
            });
            data.push({
                CITY: "新竹市",
                TEMP: "22.80",
                TOWN: "22區",
                WDSD: "1.20",
                Weather: "陰有雨",
                lat: "24.29821780",
                locationName: "國四E5K",
                lon: "120.63496810",
                obsTime: "2022-01-22 17:40:00",
                stationId: "CAF0901111"
            });
            data.push({
                CITY: "新竹市",
                TEMP: "31.80",
                TOWN: "31區",
                WDSD: "1.20",
                Weather: "陰有雨",
                lat: "24.29821780",
                locationName: "國四E5K",
                lon: "120.63496810",
                obsTime: "2022-01-31 17:40:00",
                stationId: "CAF0901131"
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
    console.log("取得今明 36 小時天氣預報 1");
    const url = `/F-C0032-001?Authorization=${TOKEN}&locationName=${cityName}&sort=time`;

    try {
        const response = await API.get(url);

        if (response.status == 200) {

            console.log("取得今明 36 小時天氣預報 2 處理回傳資料");
            let data = [];
            const location = response.data.records.location[0];
            //console.log(location.locationName);
            //console.log(location.weatherElement);

            if (location.weatherElement.length) {
                const firstElement = location.weatherElement[0];
                //console.log('第一個元素', firstElement.elementName, firstElement.time);

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
            //console.log('天氣現象', wx);
            const poP = location.weatherElement.find(x => x.elementName == 'PoP');
            //console.log('降雨機率', poP);
            const minT = location.weatherElement.find(x => x.elementName == 'MinT');
            //console.log('最低溫度', minT);
            const maxT = location.weatherElement.find(x => x.elementName == 'MaxT');
            //console.log('最高溫度', maxT);
            const ci = location.weatherElement.find(x => x.elementName == 'CI');
            //console.log('舒適度', ci);

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

            //console.log(data);

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
    console.log("日出日沒時刻 1");
    const url = `/A-B0062-001?Authorization=${TOKEN}&locationName=${cityName}&dataTime=${date}`;

    try {
        const response = await API.get(url);

        if (response.status == 200) {

            console.log("日出日沒時刻 2 處理回傳資料");

            let sumTime = {
                date: null,
                sunriseTime: null,
                sunsetTime: null,
            };

            if (response.data.records.locations.location.length) {
                const location = response.data.records.locations.location[0];
                if (location.time.length) {
                    const time = location.time[0];
                    console.log(time.parameter);
                    sumTime.date = date;
                    sumTime.sunriseTime = time.parameter.find(x => x.parameterName == '日出時刻').parameterValue;
                    sumTime.sunsetTime = time.parameter.find(x => x.parameterName == '日沒時刻').parameterValue;
                }
            }

            console.log(sumTime);

            dispatch({
                type: GET_SUN_TIME,
                payload: sumTime
            });
        }
    } catch (error) {
        console.error(error);
    }
}
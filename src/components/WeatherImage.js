import { connect } from 'react-redux';
import {
    CLEAR_CODES,
    CLOUDY_CODES,
    CLOUDY_FOG_CODES,
    FOG_CODES,
    PARTIALLY_CLEAR_WITH_RAIN_CODES,
    SNOWING_CODES,
    THUNDERSTORM_CODES
} from '../constants/weatherCodes.js';

import dayClear from '../assets/images/day-clear.svg';
import dayCloudy from '../assets/images/day-cloudy.svg';
import dayCloudyFog from '../assets/images/day-cloudy-fog.svg';
import dayFog from '../assets/images/day-fog.svg';
import dayPartiallyClearWithRain from '../assets/images/day-partially-clear-with-rain.svg';
import daySnowing from '../assets/images/day-snowing.svg';
import dayThunderstorm from '../assets/images/day-thunderstorm.svg';

import nightClear from '../assets/images/night-clear.svg';
import nightCloudy from '../assets/images/night-cloudy.svg';
import nightCloudyFog from '../assets/images/night-cloudy-fog.svg';
import nightFog from '../assets/images/night-fog.svg';
import nightPartiallyClearWithRain from '../assets/images/night-partially-clear-with-rain.svg';
import nightSnowing from '../assets/images/night-snowing.svg';
import nightThunderstorm from '../assets/images/night-thunderstorm.svg';

export const WeatherImage = (props) => {
    const { wxValue, sumTime } = props;
    console.log('天氣現象數值', wxValue);
    console.log('太陽時間', sumTime);

    const now = new Date();
    const sunriseTime = new Date(`${sumTime.date} ${sumTime.sunriseTime}`);
    const sunsetTime = new Date(`${sumTime.date} ${sumTime.sunsetTime}`);
    console.log('現在', now);
    console.log('日出', sunriseTime);
    console.log('日落', sunsetTime);

    let isDay = false;
    if (sunriseTime <= now && now <= sunsetTime) {
        isDay = true;
    }

    console.log(`現在是 ${isDay ? '白天' : '夜晚'}`);

    let imgSrc = '';
    const wxCode = Number(wxValue);

    if (isDay) {
        if (CLEAR_CODES.includes(wxCode))
            imgSrc = dayClear;
        else if (CLOUDY_CODES.includes(wxCode))
            imgSrc = dayCloudy;
        else if (CLOUDY_FOG_CODES.includes(wxCode))
            imgSrc = dayCloudyFog;
        else if (FOG_CODES.includes(wxCode))
            imgSrc = dayFog;
        else if (PARTIALLY_CLEAR_WITH_RAIN_CODES.includes(wxCode))
            imgSrc = dayPartiallyClearWithRain;
        else if (SNOWING_CODES.includes(wxCode))
            imgSrc = daySnowing;
        else if (THUNDERSTORM_CODES.includes(wxCode))
            imgSrc = dayThunderstorm;
    }
    else {
        if (CLEAR_CODES.includes(wxCode))
            imgSrc = nightClear;
        else if (CLOUDY_CODES.includes(wxCode))
            imgSrc = nightCloudy;
        else if (CLOUDY_FOG_CODES.includes(wxCode))
            imgSrc = nightCloudyFog;
        else if (FOG_CODES.includes(wxCode))
            imgSrc = nightFog;
        else if (PARTIALLY_CLEAR_WITH_RAIN_CODES.includes(wxCode))
            imgSrc = nightPartiallyClearWithRain;
        else if (SNOWING_CODES.includes(wxCode))
            imgSrc = nightSnowing;
        else if (THUNDERSTORM_CODES.includes(wxCode))
            imgSrc = nightThunderstorm;
    }

    console.log(imgSrc);

    return (
        <div className='weather-image'>
            <img src={imgSrc} />
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        sumTime: state.weatherData.sumTime
    };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(WeatherImage);

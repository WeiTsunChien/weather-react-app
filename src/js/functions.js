export const getPeriod = (_startTime) => {
    //console.log('getPeriod', _startTime);
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const date = today.getDate();

    const todayDayStartTime = new Date(year, month, date, 6);
    //console.log('今天白天開始時間', todayDayStartTime);
    const todayNightStartTime = new Date(year, month, date, 18);
    //console.log('今天夜晚開始時間', todayNightStartTime);

    const tomorrowDayStartTime = new Date(year, month, date + 1, 6);
    //console.log('明天白天開始時間', tomorrowDayStartTime);
    const tomorrowNightStartTime = new Date(year, month, date + 1, 18);
    //console.log('明天夜晚開始時間', tomorrowNightStartTime);

    const startTime = new Date(_startTime);
    //console.log('某個開始時間', startTime);

    if (startTime.toString() == todayDayStartTime.toString()) {
        return '今天白天';
    }
    else if (startTime.toString() == todayNightStartTime.toString()) {
        return '今天晚上';
    }
    else if (startTime.toString() == tomorrowDayStartTime.toString()) {
        return '明天白天';
    }
    else if (startTime.toString() == tomorrowNightStartTime.toString()) {
        return '明天晚上';
    }
    else {
        if (todayDayStartTime <= startTime && startTime <= todayNightStartTime) {
            return '今天白天';
        }
        else if (todayNightStartTime <= startTime && startTime <= tomorrowDayStartTime) {
            return '今天晚上';
        }
        else if (tomorrowDayStartTime <= startTime && startTime <= tomorrowNightStartTime) {
            return '明天白天';
        }
        else if (tomorrowNightStartTime <= startTime) {
            return '明天晚上';
        }
    }
}
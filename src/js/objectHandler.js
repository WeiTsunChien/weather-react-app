export const flattenObject = (obj) => {
    var result = {};

    for (var key in obj) {
        //console.log("key", key);

        if (!obj.hasOwnProperty(key))
            continue;

        if ((typeof obj[key]) == 'object') {
            var flatObject = flattenObject(obj[key]);

            for (var key1 in flatObject) {
                //console.log("key1", key1);

                if (!flatObject.hasOwnProperty(key1))
                    continue;

                result[key + '.' + key1] = flatObject[key1];
            }
        } else {
            result[key] = obj[key];
        }
    }
    return result;
};

export const extractLevel1Props = (obj) => {
    var result = {};

    for (var key in obj) {

        if (!obj.hasOwnProperty(key))
            continue;

        if ((typeof obj[key]) != 'object') {
            result[key] = obj[key];
        }
    }
    return result;
};
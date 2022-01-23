export const convertNameValueArrayToObject = (array) => {
    let result = array.reduce((obj, item) => {
        let name = null;
        let value = null;

        for (let key in item) {
            let k = key.toLowerCase();

            if (k.includes('name')) {
                name = item[key];
            }
            else if (k.includes('value')) {
                value = item[key];
            }
        }

        obj[name] = value;
        return obj;
    }, {});
    return result;
}
import _ from "underscore";

function set_Object_Path(keys, value, obj, type) {
    var key_S = keys.split(">");
    var key_A = obj || this.state;
    var key_L = key_S.length;
    _.each(key_S, function (key, ind) {

        if (ind === (key_L - 1)) {
            if (type == 'PUSH') {
                if (!_.isArray(key_A[key])) key_A[key] = [];
                key_A[key].push(value);
            } else if (type == 'PULL') {
                if (_.isArray(key_A[key])) {
                    key_A[key] = _.reject(key_A[key], function (d, ind) { return ind === value; });
                }
            } else if (type == "EXTEND") {
                if (!_.isObject(key_A[key])) key_A[key] = {};
                _.extend(key_A[key], value)
            }
            else {
                key_A[key] = value
            }
        }
        else {
            if (!_.isObject(key_A[key])) key_A[key] = {};
            key_A = key_A[key];
        }
    })
}
function get_Object_Path(keys, obj, defaultValue) {
    var key_S = keys.split(">");
    var key_A = JSON.parse(JSON.stringify(obj));
    var key_L = key_S.length;
    var res = null;
    _.each(key_S, function (key, ind) {
        if (ind === (key_L - 1)) {
            // key_A[key] = value;
            try {
                if (_.isUndefined(key_A)) {
                    res = defaultValue
                    return
                }
                key_A[key] = key_A[key];
                res = _.isUndefined(key_A[key]) ? defaultValue : key_A[key];
            } catch (err) {
                res = defaultValue
            }
        }
        else {
            if (_.isUndefined(key_A)) {
                res = defaultValue
                return
            }
            key_A = key_A[key];
        }
    })
    return res;
}

const Object_Handler = { get_Object_Path, set_Object_Path }
export default Object_Handler;
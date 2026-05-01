const { v4 } = require('uuid');
const _ = require('underscore');

class funcs {
    functions = {};
    requirements = {};
    error = []
    level = 0;
    id = '';

    constructor(name) {
        this.name = name;
        this.id = v4();
    }
    //arg is a list of arguments to pass to function
    add_function(func, name_) {
        if (!_.isFunction(func)) {
            this.error.push('ERROR TO ADD FUNCTION' + (name) + "")
            return false;
        }
        this.functions[name_] = this.functions[name_] || {};
        this.functions[name_] = func;
        return true;
    }
    set_level(lv) {
        if (_.isNumber(lv)) {
            this.level = lv;
            return true;
        }
        return false;
    }
    add_requirement(arg_A, test_func, name_) {
        if (!_.isFunction(test_func)) {
            this.error.push('AFTER CLASS: ERROR TO ADD ARGUMENT' + (name_) + "")
            return false;
        }
        this.requirements[name_] = this.requirements[name_] || {};
        this.requirements[name_].func = test_func;
        this.requirements[name_].arg = arg_A;
        return true;
    }
    get_keys() {
        var keys = [];
        _.each(this.requirements, function (requirement) {
            keys.push(requirement.arg)
        })
        console.log("🚀 ~ file: funcs.js ~ line 47 ~ funcs ~ get_keys ~ keys", JSON.stringify(keys))
        return _.uniq(_.flatten(keys));
    }
    test_requirments(response) {
        //I assume that extendscript pass an object with key, each key is argument
        // response= {text:"this is the text"}
        //test the requirement pass from the extensdscript
        //respect the function, if a color, the function should test if
        //the value is color and return true
        if (!_.isObject(response)) {
            this.error.push(new Error('Response Error - IS Not Object:' + response))
        }
        var args = {}, con = this;
        var keys = this.get_keys();//flattern arrays and uniq keys
        _.each(keys, function (key) {
            if (_.isUndefined(response[key]) || _.isNull(response[key])) {
                con.error.push(new Error('ERROR=>KEY Not Exist Response:' + key))
            }
            else args[key] = response[key];
        })
        _.each(this.requirements, function (requirement) {
            try {
                requirement.func(args);
            } catch (err) {
                con.error.push(new Error('TEST=>' + JSON.stringify(requirement)))
            }
        })
    }
    do(args) {
        //after test requirement returned from EXTENDSCRIPT
        // run the function that used need after the set
        var con = this;
        _.each(this.functions, function (func) {
            console.log("🚀 ~ file: funcs.js ~ line 80 ~ funcs ~ func", func)
            try {
                func(args);
            } catch (err) {
                console.log("🚀 ~ file: funcs.js ~ line 84 ~ funcs ~ err", err)
                con.error.push(new Error('TEST=> ERROR Function Run ' + JSON.stringify(func)))
            }
        })
    }
}
export default funcs
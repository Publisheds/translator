// type GLOBJ==> a global object is a string that 
// refer to a old state that stored in engine
/*
  id = '';
  _id = '';
  _name = '';
  _function = '';
  level = 0;
   arguments:{
       arg1:{
           name:'arg1',
           value:'555',
           type:'VALUE|GLOBJ'
       }
   }
   ret:{
       ret1:{
           name:"ret1",
           value:'return_value',
           valid:Boolean,
           error:[]
       }
   }
*/

/*
   Error Number value
    0-->Continue
    0-->warning
    0-->ask
    0-->stop
*/

const { v4 } = require('uuid');
const _ = require('underscore');
// import {uuid} from "uuidv4"
var ret_Default_State = {
    name: '',
    value: false,
    valid: false,
    error: [],
}
class ret {
    name = '';
    value = '';
    valid = false;
    error = [];
    set_Name(name) {
        if (!_.isString(name) && !_.isNumber(name)) {
            this.error.push(new Error('Argument Type:' + name + ' is Not Valid Type ')); return false
        }
        this.name = name;
        return true;
    }
    set_Value(value) {
        this.value = value;
        return true;
    }
    set_Valid(value) {
        if (!_.isBoolean(value)) {
            this.error.push(new Error('Argument Type:' + value + ' is Not Valid Type ')); return false
        }
        this.value = value;
        return true;
    }

    constructor(name, value, valid) {
        this.set_Name(name);
        if (value) this.set_Value(value);
        if (valid) this.set_Valid(valid);
    }
}


class arg {
    name = '';
    value = '';
    type = '';
    error = [];
    set_Name(name) {
        if (!_.isString(name) && !_.isNumber(name)) {
            this.error.push(new Error('Argument Type:' + name + ' is Not Valid Type ')); return false
        }
        this.name = name;
        return true;
    }
    set_Value(value) {
        this.value = value;
        return true;
    }
    set_Type(type) {
        if (_.isString(type)) {
            this.type = type;
            return true;
        } else if (_.isNumber(type)) {
            this.type = type == 0 ? 'GLOBJ' : 'VALUE';
            return true;
        }
        else {
            this.error.push(new Error('Argument Type:' + type + ' is Not Valid Type '));
            return false
        }

    }
    constructor(name, type, value) {
        this.set_Name(name);
        this.set_Type(type);
        this.set_Value(value);
    }
}
class action {
    id = '';
    _id = '';
    _name = '';
    _function = '';
    level = 0;
    arguments = {};
    ret = {};
    generate_IDs(func) {
        this.id = v4();
        this._id = v4();
    }
    init() {
        this.generate_IDs()
    }
    set_Name(name) {
        this._name = name;
    }
    set_function(func) {
        this._function = func;
    }
    set_level(NB) {
        this._level = NB;
    }

    add_argument(name, value, type) {
       
        this.arguments[name] = this.arguments[name] || {};
        this.arguments[name] = new arg(name, type, value);
    }
    add_return(name, value, valid) {
        if (!name) return false;
        this.ret[name] = this.ret[name] || {};
        this.ret[name] = new ret(name, value, valid);
        return true;
    }
    constructor(name, func, level) {
        this.init();
        this.set_Name(name);
        this.set_function(func);
        this.set_level(level);
    }
    undo() { }
    get_state(){
        return JSON.parse(JSON.stringify(this))
    }
}
export default action;
// var CHNAGE_TEXT=new action('CHNAGE_TEXT','change_prperty_text',0)
// CHNAGE_TEXT.add_argument('layer','text_layer','GLOBJ')
// CHNAGE_TEXT.add_argument('text','All is Good','VALUE')

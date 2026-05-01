/*
The goal of this function is to add a list of action and use them 
to add an action for example a change of the text
to change the text, I need to add a sat, this sat contain a list
of action that will be used to change text
new Action('find project item') 
new Action('open comp') 
new Action('find layer') 
new Action('find property') 
new Action('change property') 
new Action('close active comp') 
maybe after that we need to open the main comp again, so each sat will present
a function, and because function can include a list of action, and to 
reuse the action
*/

//sat
import _ from 'underscore';
import action from './action';
import funcs from './funcs';
const { v4 } = require('uuid');

class sat {
    name = "";
    lenght = 0;
    id = "";
    list = {};
    cb = {
        succus: {},
        error: {}
    }
    constructor(name) {
        this.name = name;
        this.id = v4();
    }
    add(Action) {
        if (Action instanceof action) {
            this.list[Action._name] = this.list[Action._name] || {};
            this.list[Action._name] = Action;
            this.lenght++;
        } else {
            console.log('The action Not instance of error')
        }
    }
    stringify() {
        return JSON.stringify(this.list);
    }
    error_cb(cl_func) {
        if (cl_func instanceof funcs) this.cb.error = cl_func;
    }
    //this can include notification or change text or color
    //Update UI, run another set
    succes_cb(cl_func) {
        if (cl_func instanceof funcs) this.cb.succus = cl_func;
    }
    do(args) {
        var list_S = this.stringify(this.list);
        console.log("🚀 ~ file: sat.js ~ line 50 ~ sat ~ list_S", list_S)
        if (this.cb.succus instanceof funcs) this.cb.succus.do(args)//instance of func
        if (this.cb.error instanceof funcs) this.cb.error.do(args)//instance of func
    }
    undo() {

    }
}
export default sat
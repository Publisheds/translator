/*
A root is the global list of sat that hold all action for
one cycle; 
this will notify user at end with the list of error
this also should handle the dispatch state from the extendscript
to notify user
this will regenrate the set and the actions


*/

class root {
    sats = {};
    lenght = 0;
    constructor() {
        
    }
    add_sat(sat) {
        this.sats[sat.name] = this.sats[sat.name] || {};
        this.sats[sat.name] = Action;
        this.lenght++;
    }
    do(){
        _.each(sats,function(sat){
            var sat_String=sat.stringify();
            //call extendscript
            //load errors
            //load new values ==> ret_values
            sat.after(ret_values);
        })
    }
    undo(){}
}
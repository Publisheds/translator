const defaultState = {
    arguments: {},
    callback: () => { },
    error: [],
    return: [],
}
class req {
    constructor() {
        this.body = defaultState;
    }
    reset() {
        this.body = defaultState; 
    }
    arguments_Add(obj, key) {
        this.body.arguments[key] = obj
    }
    setReturn(obj) {
        this.body.return.push(obj)
    }
}

export { req }
/**
 * @author Tomer Riko Shalev
 */

/**
 * load jsx scripts dynamically
 */
class ScriptLoader {
    EvalScript_ErrMessage = "EvalScript error."

    constructor() {
        try {
            this.cs = new CSInterface()
        } catch (err) {
            console.log(err)
        }
    }

    get cs() {
        return this._cs
    }

    set cs(val) {
        this._cs = val
    }

    /**
     * loadJSX - load a jsx file dynamically, this
     * will also load all of it's includes which is desirable
     *
     * @param  {type} fileName the file name
     * @return {type}          description
     */
    loadJSX(fileName) {
        var cs = this.cs
        var extensionRoot = cs.getSystemPath(SystemPath.EXTENSION) + "/host/";
        cs.evalScript('$.evalFile("' + extensionRoot + fileName + '")',function(err){
            console.log(err)
        });

        
    }

    /**
     * evalScript - evaluate a JSX script
     *
     * @param  {type} functionName the string name of the function to invoke
     * @param  {type} params the params object
     * @return {Promise} a promise
     */
    escape(key, val) {
        if (typeof (val) != "string") return val;
        return val
            .replace(/[\\]/g, '\\\\')
            .replace(/[\/]/g, '\\/')
            .replace(/[\b]/g, '\\b')
            .replace(/[\f]/g, '\\f')
            .replace(/[\n]/g, '\\n')
            .replace(/[\r]/g, '\\r')
            .replace(/[\t]/g, '\\t')
            .replace(/[\"]/g, '\\"')
            // .replace(/\\'/g, "\\'")
            .replace(/'/g, "####");
    }

    evalScript(functionName, params) {
        var params_string = params ? encodeURIComponent(escape(JSON.stringify(params))) : ''
        console.log("🚀 ~ file: ScriptLoader.js ~ line 65 ~ ScriptLoader ~ evalScript ~ params_string", params_string)
        var eval_string = `${functionName}('${((params_string))}')`
        console.log(eval_string)
        var that = this

        // return new Promise((resolve, reject) => {return resolve(444) })
        return new Promise((resolve, reject) => {
            var callback = function (eval_res) {
                console.log("🚀 ~ file: ScriptLoader.js ~ line 55 ~ ScriptLoader ~ callback ~ eval_res", eval_res)
                // console.log('weird' + eval_res)
                if (typeof eval_res === 'string') {
                    // console.log(eval_res)
                    if (eval_res.toLowerCase().indexOf('error') != -1) {
                        that.log('err eval')
                        resolve(eval_res)

                        return
                    }
                }

                that.log('success eval')

                resolve(eval_res)

                return
            }
            try {
                that.cs.evalScript(eval_string, callback)
            } catch (err) {
                console.log("🚀 ~ file: ScriptLoader.js ~ line 94 ~ ScriptLoader ~ returnnewPromise ~ err", err)

            }
        })

    }
    eval_function(eval_string, callback) {
        this.cs.evalScript(eval_string, callback)
    }
    createScriptError(reason, data) {
        return { reason, data }
    }

    /**
     * log some info with session prefix
     *
     * @param  {string} val what to log
     */
    log(val) {
        console.log(`${this.name} ${val}`)
    }

    get name() {
        return 'ScriptLoader:: '
    }

}

var scriptLoader = new ScriptLoader()

export default scriptLoader
String.prototype.escapeSpecialChars = function () {
    return this.replace(/\\n/g, "\\n")
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f");
};
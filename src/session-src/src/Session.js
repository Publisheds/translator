/**
 * @author Tomer Riko Shalev
 */

import EventEmitter from 'events'
import scriptLoader from './ScriptLoader'
import DataManagers from './managers/DataManagers.js'
import { req } from "./utils"
/**
 * the main plugin session. This can enter the node modules as
 * well as the host
 *
 */
class Session {

    _managers = new DataManagers()

    constructor() {
        //super()

        this.init()
    }

    /**
     * init - session
     *
     */
    init() {
        try {
            // init before everything so I can intercept console.log
            this._managers.init()
            this.log('session is initing...')
            // load jsx file dynamically
            this.log('loading the main jsx file')
            scriptLoader.loadJSX('main.jsx')

            // some testing
            this.test()
            // var fs = require('fs-extra')
            //console.log(fs)
        } catch (err) {
            console.log("erddfr", err)
        }

        this.log('session is inited')
    }


    /**
     * get data managers
     *
     * @return {type}  description
     */
    get managers() {
        return this._managers
    }

    /**
     * scriptLoader - get the script loader
     *
     */
    scriptLoader() {
        return scriptLoader
    }

    /**
     * test - let's test things
     *
     */
    wrap() {



    }
    addItem(obj) {
        return new Promise((resolve, reject) => {
            try {
                scriptLoader.evalScript('addItem', obj).then((res) => {
                    this.log('result is ' + res)
                    resolve(res);
                })
            } catch (err) {
                reject(err)
            }
        })
    }

    async call_function(data, func) {
        console.log("🚀 ~ file: Session.js ~ line 88 ~ Session ~ assign ~ data", data)
        const Req = new req();
        Req.arguments_Add(data, "children");
        const res = await scriptLoader.evalScript(func, Req.body)
        return res
    }
    async AddHeading(data) {
        console.log("🚀 ~ file: Session.js ~ line 88 ~ Session ~ assign ~ data", data)
        const Req = new req();
        Req.arguments_Add(data, "children");
        const res = await scriptLoader.evalScript('AddHeading', Req.body)
        return res
    }
    async reduceHorizontalScale(data) {
        console.log("🚀 ~ file: Session.js ~ line 88 ~ Session ~ assign ~ data", data)
        const Req = new req();
        Req.arguments_Add(data, "children");
        const res = await scriptLoader.evalScript('reduceHorizontalScale', Req.body)
        return res
    }
    async AlignToBottom(data) {
        console.log("🚀 ~ file: Session.js ~ line 88 ~ Session ~ assign ~ data", data)
        const Req = new req();
        Req.arguments_Add(data, "children");
        const res = await scriptLoader.evalScript('AlignToBottom', Req.body)
        return res
    }
    async logging_F(data) {
        console.log("🚀 ~ file: Session.js ~ line 88 ~ Session ~ assign ~ data", data)
        const Req = new req();
        Req.arguments_Add(data, "children");
        const res = await scriptLoader.evalScript('logging_F', Req.body)
        return res
    }
    async get_missing_link(data) {
        console.log("🚀 ~ file: Session.js ~ line 88 ~ Session ~ assign ~ data", data)
        const Req = new req();
        Req.arguments_Add(data, "children");
        const res = await scriptLoader.evalScript('get_missing_link', Req.body)
        return res
    }
    async get_name_current_template(data) {
        const Req = new req();
        const res = await scriptLoader.evalScript('get_name_current_template', Req.body)
        return res
    }
    async CopyFile_F(data) {
        const Req = new req();
        Req.arguments_Add(data, "data");
        console.log("🚀 ~ file: Session.js ~ line 92 ~ Session ~ run ~ Req", Req)
        return await scriptLoader.evalScript('CopyFile_F', Req.body).then((res) => {
            this.log('result is ' + res);
            if(res==="PASS")return true
            else return false;
        });
    }
    async openFile(data) {
        const Req = new req();
        Req.arguments_Add(data, "data");
        return await scriptLoader.evalScript('openFile', Req.body).then((res) => {
            return res
        });
    }
    async updateSwatchesRects(data) {
        const Req = new req();
        Req.arguments_Add(data, "data");
        console.log("🚀 ~ file: Session.js ~ line 92 ~ Session ~ run ~ Req", Req)
        await scriptLoader.evalScript('updateSwatchesRects', Req.body).then((res) => {
            this.log('result is ' + res);
        });
    }
    async save_preset(data) {
        try {
            const Req = new req();
            Req.arguments_Add(data, "data");

            return await scriptLoader.evalScript('save_preset', Req.body).then((res) => {
                this.log('result is ' + res);
                return res;
            });
        } catch (err) {
            return "ERROR: Selecting The " + type
        }
    }

    async processes(data) {
        const Req = new req();
        Req.arguments_Add(data, "data");
        console.log("🚀 ~ file: Session.js ~ line 107 ~ Session ~ await scriptLoader.evalScript ~ Req.body", Req.body)
        await scriptLoader.evalScript('processes', Req.body).then((res) => {
            this.log('result is ' + res);
        });
    }
    async getAllTexts (data) {
        const Req = new req();
        Req.arguments_Add(data, "data");
        console.log("🚀 ~ file: Session.js ~ line 107 ~ Session ~ await scriptLoader.evalScript ~ Req.body", Req.body)
        return await scriptLoader.evalScript('$._ext_ILST.getAllTexts', Req.body).then((res) => {
            this.log('result is ' + res);
            return res
        });
    }
    async setAllTexts (data) {
        const Req = new req();
        Req.arguments_Add(data, "data");
        return await scriptLoader.evalScript('$._ext_ILST.setAllTexts', Req.body).then((res) => {
            return res
        });
    }

    async getPageCount () {
        const Req = new req();
        return await scriptLoader.evalScript('$._ext_ILST.getPageCount', Req.body).then((res) => {
            return res
        });
    }

    async getPageTexts (data) {
        const Req = new req();
        Req.arguments_Add(data, "data");
        return await scriptLoader.evalScript('$._ext_ILST.getPageTexts', Req.body).then((res) => {
            return res
        });
    }

    async setPageTexts (data) {
        const Req = new req();
        Req.arguments_Add(data, "data");
        return await scriptLoader.evalScript('$._ext_ILST.setPageTexts', Req.body).then((res) => {
            return res
        });
    }

    async step1(data) {
        const Req = new req();
        Req.arguments_Add(data, "data");
        console.log("🚀 ~ file: Session.js ~ line 107 ~ Session ~ await scriptLoader.evalScript ~ Req.body", Req.body)
        await scriptLoader.evalScript('step1', Req.body).then((res) => {
            this.log('result is ' + res);
        });
    }
    async step2(data) {
        const Req = new req();
        Req.arguments_Add(data, "data");
        console.log("🚀 ~ file: Session.js ~ line 107 ~ Session ~ await scriptLoader.evalScript ~ Req.body", Req.body)
        await scriptLoader.evalScript('step2', Req.body).then((res) => {
            this.log('result is ' + res);
        });
    }
    
    async line_up(data) {
        const Req = new req();
        Req.arguments_Add(data, "data");
        console.log("🚀 ~ file: Session.js ~ line 107 ~ Session ~ await scriptLoader.evalScript ~ Req.body", Req.body)
        await scriptLoader.evalScript('line_up', Req.body).then((res) => {
            this.log('result is ' + res);
        });
    }
    async runActions(data) {
        const Req = new req();
        Req.arguments_Add(data, "data");
        console.log("🚀 ~ file: Session.js ~ line 107 ~ Session ~ await scriptLoader.evalScript ~ Req.body", Req.body)
        return await scriptLoader.evalScript('runActions', Req.body).then((res) => {
            return res
            this.log('result is ' + res);
        });
    }
    async logger(data) {
        const Req = new req();
        Req.arguments_Add(data, "data");
        console.log("🚀 ~ file: Session.js ~ line 107 ~ Session ~ await scriptLoader.evalScript ~ Req.body", Req.body)
        return await scriptLoader.evalScript('LOGGER.logger', Req.body).then((res) => {
            return res
            this.log('result is ' + res);
        });
    }
    async selectfiles(data) {
        const Req = new req();
        Req.arguments_Add(data, "data");
        console.log("🚀 ~ file: Session.js ~ line 107 ~ Session ~ await scriptLoader.evalScript ~ Req.body", Req.body)
        return await scriptLoader.evalScript('selectfiles', Req.body).then((res) => {
            this.log('result is ' + res);
            return res;
        });
    }
    async get_orders_processed() {
        const Req = new req();
        return await scriptLoader.evalScript('get_orders_processed', Req.body).then((res) => {
            console.log("🚀 ~ file: Session.js ~ line 121 ~ Session ~ awaitscriptLoader.evalScript ~ res", res)
            this.log('result is ' + res);
            try {
                return res;
            } catch (err) {
                return {};
            }
        });
    }
    async init_folder() {
        const Req = new req();
        return await scriptLoader.evalScript('init_folder', Req.body).then((res) => {
            console.log("🚀 ~ file: Session.js ~ line 121 ~ Session ~ awaitscriptLoader.evalScript ~ res", res)
            this.log('result is ' + res);
            try {
                return JSON.parse(res);
            } catch (err) {
                return {};
            }
        });
    }
    async run_actions(data) {
        const Req = new req();
        Req.arguments_Add(data, "data");
        console.log("🚀 ~ file: Session.js ~ line 107 ~ Session ~ await scriptLoader.evalScript ~ Req.body", Req.body)
        await scriptLoader.evalScript('run_actions', Req.body).then((res) => {
            this.log('result is ' + res);
        });
    }
    async eval_function(str) {
        await scriptLoader.eval_function(str)
    }
    async select_prompt(type) {
        try {
            const Req = new req();
            console.log("🚀 ~ file: Session.js ~ line 168 ~ Session ~ select_prompt ~ Req", Req)
            return await scriptLoader.evalScript('select' + type, Req.body).then((res) => {
                console.log("🚀 ~ file: Session.js ~ line 169 ~ Session ~ returnawaitscriptLoader.evalScript ~ res", res)
                this.log('result is ' + res);
                return res;
            });
        } catch (err) {
            console.log("🚀 ~ file: Session.js ~ line 173 ~ Session ~ select_prompt ~ err", err)
            return "ERROR: Selecting The " + type
        }
    }

    test() {
        // var obj = {
        //     name: 'tomer'
        // }
        // scriptLoader.evalScript('get_create_assets_Folder', {}).then((res) => {
        //     localStorage.setItem("asset_Folder", res);
        //     this.log('result is ' + res)
        // })
    }

    /**
     * invoke the plugin
     *
     * @param  {{textures:boolean, masks:boolean, info: boolean, flatten:boolean}} options for plugin
     *
     * @return {object} describes how well the execution of plugin was
     */
    invokePlugin(options) {
        const { folderPath, isFlattenChecked,
            isInfoChecked, isInspectVisibleChecked,
            isMasksChecked, isTexturesChecked,
            isMeaningfulNamesChecked, isHierarchicalChecked } = options

        // i reparse everything to detect failures
        const pluginData = {
            destinationFolder: folderPath,
            exportInfoJson: isInfoChecked,
            inspectOnlyVisibleLayers: isInspectVisibleChecked,
            exportMasks: isMasksChecked,
            exportTextures: isTexturesChecked,
            flatten: !isHierarchicalChecked,
            namePrefix: isMeaningfulNamesChecked ? 'layer' : undefined
        }

        var that = this

        return new Promise((resolve, reject) => {

            scriptLoader.evalScript('invoke_document_worker', pluginData)
                .then((res) => {
                    resolve(JSON.parse(res))
                })
                .catch(err => {
                    reject(err)
                })

        })

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
        return 'Session:: '
    }
    // select_Folder(Label) {
    //     console.log("🚀 ~ file: Session.js ~ line 174 ~ Session ~ select_Folder ~ Label", Label)
    //     if (window.cep) {
    //         var result = window.cep.fs.showOpenDialog(false, true,Label, null, null)
    //         var path = result.data
    //         console.log("🚀 ~ file: Session.js ~ line 91 ~ Session ~ select_Folder ~ path", path)
    //         return Array.isArray(path) ? path[0] : "";
    //     }
    //     return "";
    // }
}

var session = new Session()

export default session

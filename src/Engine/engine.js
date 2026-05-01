const _ = require('underscore');

import action from './action';
import sat from './sat';
import funcs from './funcs';
class engine {

    find_project_item(target_1, target_2, ret, level) {
        var FIND_PROJECT_ITEM_ROOT = new action('FIND_PROJECT_ITEM_ROOT', 'find_project_item', level)
        FIND_PROJECT_ITEM_ROOT.add_argument('name', target_1[0], target_1[1])
        FIND_PROJECT_ITEM_ROOT.add_argument('root', target_2[0], target_2[1])
        FIND_PROJECT_ITEM_ROOT.add_return(ret)
        return FIND_PROJECT_ITEM_ROOT
    }
    find_layer(target, ret, level) {
        var FIND_LAYER = new action('FIND_LAYER', 'find_layer', level)
        FIND_LAYER.add_argument('name', target[0], target[1])
        FIND_LAYER.add_return(ret)
        return FIND_LAYER
    }
    set_color (target_1,target_2,target_3, ret, level) {
        var FIND_LAYER = new action('SET_COLOR', 'set_color', level)
        FIND_LAYER.add_argument('layer', target_1[0], target_1[1])
        FIND_LAYER.add_argument('property_setting', target_2[0], target_2[1])
        FIND_LAYER.add_argument('color_hex', target_3[0], target_3[1])
        FIND_LAYER.add_return(ret)
        return FIND_LAYER
    }
    set_layer_visibility (target_1,target_2, ret, level) {
        var FIND_LAYER = new action('SET_LAYER_VISIBILITY', 'set_layer_visibility', level)
        FIND_LAYER.add_argument('layer', target_1[0], target_1[1])
        FIND_LAYER.add_argument('visibility', target_2[0], target_2[1])
        FIND_LAYER.add_return(ret)
        return FIND_LAYER
    }
    fit_media_in_com(target, level) {
        var FIT_MEDIA_IN_COMP = new action('FIT_MEDIA_IN_COMP', 'fit_media_in_com', level)
        FIT_MEDIA_IN_COMP.add_argument('target', target[0], target[1])
        return FIT_MEDIA_IN_COMP
    }
    open_in_view(target, ret, level) {
        var OPEN_IN_VIEW = new action('OPEN_IN_VIEW', 'open_in_view', level)
        OPEN_IN_VIEW.add_argument('target', target[0], target[1])
        OPEN_IN_VIEW.add_return(ret)
        return OPEN_IN_VIEW
    }
    close_from_view(level) {
        var CLOSE_FROM_VIEW = new action('CLOSE_FROM_VIEW', 'close_from_view', level | 0)
        return CLOSE_FROM_VIEW;
    }
    change_contents(target_1, target_2, level) {
        var CHANGE_TEXT = new action('CHANGE_TEXT', 'change_contents', level | 0)
        CHANGE_TEXT.add_argument('layer', target_1[0], target_1[1])
        CHANGE_TEXT.add_argument('text', target_2[0], target_2[1])
        return CHANGE_TEXT;
    }
    check_path(target_1, ret) {
        var CHECK_PATH = new action('CHECK_PATH_FUN', 'check_path', 3)
        CHECK_PATH.add_argument('path', target_1[0], target_1[1])
        CHECK_PATH.add_return(ret)
        return CHECK_PATH
    }
    place_file(target_1,  ret) {
        var PLACE_FILE = new action('PLACE_FILE', 'place_file', 1)
        PLACE_FILE.add_argument('asset', target_1[0], target_1[1])
        PLACE_FILE.add_return(ret)
        return PLACE_FILE
    }
    import_from_path(target_1, target_2, ret) {
        var IMPORT_FROM_PATH = new action('IMPORT_FROM_PATH', 'import_from_path', 3)
        IMPORT_FROM_PATH.add_argument('target_folder', target_1[0], target_1[1])
        IMPORT_FROM_PATH.add_argument('path', target_2[0], target_2[1])
        IMPORT_FROM_PATH.add_return(ret)
        return IMPORT_FROM_PATH
    }
    find_folder(target_1, ret){
        
        var FIND_FOLDER = new action('FIND_FOLDER', 'find_folder', 3)
        FIND_FOLDER.add_argument('name', target_1[0], target_1[1])
        FIND_FOLDER.add_return(ret)
        return FIND_FOLDER
    }
    find_folder_project_Item(target_1, target_2, ret) {
        var FIND_FOLDER = new action('FIND_FOLDER', 'find_folder', 3)
        FIND_FOLDER.add_argument('name', target_1[0], target_1[1])
        FIND_FOLDER.add_argument('create', target_2[0], target_2[1])
        FIND_FOLDER.add_return(ret)
        return FIND_FOLDER
        //find or create folder
    }
    render_video_media_encoder(target_1,target_2,target_3,ret){
        var FIND_FOLDER = new action('RENDER_VIDEO_IN_MEDIA_ENCODER', 'render_video_media_encoder', 3)
        FIND_FOLDER.add_argument('name', target_1[0], target_1[1])
        FIND_FOLDER.add_argument('path', target_2[0], target_2[1])
        FIND_FOLDER.add_argument('comp', target_3[0], target_3[1])
        return FIND_FOLDER
    }
}

// 
const Engine = new engine();
// var a = Engine.find_project_item(["Folder project item name here", 1], [true, 0], "ASSET_FOLDER", 3);
// var a = Engine.find_project_item(["project item name here", 1], ["APP_PROJECT_ROOT_FOLDER", 0], "PROJECT_ITEM", 3);
// var b = Engine.open_in_view(["PROJECT_ITEM", 0], null, 3);
// var c = Engine.close_from_view(0);
// var d = Engine.find_layer(["name of the layer", 1], 'LAYER_TARGET', 3);
// var e = Engine.change_contents(["LAYER_TARGET", 0], ["this is a text", 1], 'LAYER_TARGET', 3);
// var e = Engine.check_path(["path file", 1] 'path_active', 3);
// const CHANGE_TEXT_SAT = new sat("CHANGE_TEXT_SAT");
// CHANGE_TEXT_SAT.add(a);
// CHANGE_TEXT_SAT.add(b);
// CHANGE_TEXT_SAT.add(c);
// CHANGE_TEXT_SAT.add(d);
// CHANGE_TEXT_SAT.add(e);
// CHANGE_TEXT_SAT.do()
// var cb_change_text = new funcs('cb change text')
// cb_change_text.add_function(function (args) {
//     console.log('---> ' + args.text + ': text changed correctly')
// }, 'text_change_correctly')
// cb_change_text.add_requirement(['text'], _.isString, 'isString')
// cb_change_text.test_requirments({text:"sdsqd"})
// CHANGE_TEXT_SAT.error_cb(cb_change_text)
// CHANGE_TEXT_SAT.succes_cb(cb_change_text)
// CHANGE_TEXT_SAT.do({text:"sdsqd"})
// console.log("🚀 ~ file: engine.js ~ line 51 ~ cb_change_text", cb_change_text)
export default Engine
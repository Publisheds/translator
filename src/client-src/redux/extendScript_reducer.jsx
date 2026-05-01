import { createSlice } from "@reduxjs/toolkit";
// import list from "../utils/list";
// // console.log("🚀 ~ file: reducer.jsx ~ line 3 ~ list", list);
import UTILS from "./utils";
const { get_Object_Path, set_Object_Path } = UTILS;
const defaultState = {
  arguments: {
    folder: "Path",
  },
  callback: () => {},
  error: [],
  return: [],
};
export const ExtendScript = createSlice({
  name: "jsx",
  initialState: defaultState,
  reducers: {
    Select_Folder: (state, action) => {
      var stateClone = JSON.parse(JSON.stringify(state));
      stateClone.arguments.folder = action.payload;
      return stateClone;
    },
    set_by_path: (state, action) => {
      var stateClone = JSON.parse(JSON.stringify(state));
      set_Object_Path(action.payload.path, action.payload.value, stateClone,action.payload.type);

      return stateClone;
    },
  },
});
export const ExtendScriptState = (state) => state.jsx;
export const { Select_Folder, set_by_path } = ExtendScript.actions;
export default ExtendScript.reducer;

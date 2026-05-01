import { createSlice, configureStore } from "@reduxjs/toolkit";

// import list from "../utils/list";
// console.log("🚀 ~ file: reducer.jsx ~ line 3 ~ list", list);
export const listReducer = createSlice({
  name: "list",
  initialState: {
    marginMin:10,
    minHeight:60,
    children: [],
  },
  reducers: {
    setState_A: (state, action) => {
      return action.payload
    },
    saveItem: (state, action) => {
      var IND = null;
      state.children.forEach((f, ind) => {
        if (f.id == action.payload.id) {
          IND = ind;
        }
        return f;
      });
      console.log("🚀 ~ file: listReducer.jsx ~ line 13 ~ state", IND);
      if (IND != null) {
        Object.assign(state.children[IND], action.payload);

        return state;
      }
    },
    changeMinHT:function(state, action){
      return Object.assign(state,{minHeight:action.payload})

    },
    changeMarginMin:function(state, action){
      return Object.assign(state,{marginMin:action.payload})

    },
    addItem: (state, action) => {
      console.log("🚀 ~ file: reducer.jsx ~ line 9 ~ state", state.children);
      console.log(
        "🚀 ~ file: listReducer.jsx ~ line 13 ~ action.payload",
        action.payload
      );
      state.children.push(action.payload);
      // state = list.addItem(state);
    },
    removeItem: (state) => {
      console.log("🚀 ~ file: reducer.jsx ~ line 14 ~ state", state);
      // state = list.removeItem(state);
    },
  },
});
export const listItems = (state) => state.list;

export const { addItem, removeItem, saveItem,changeMinHT,changeMarginMin,setState_A } = listReducer.actions;

export default listReducer.reducer;

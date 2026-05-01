import { createSlice, configureStore } from "@reduxjs/toolkit";
const { v4 } = require("uuid");
import { useSelector } from "react-redux";

window.v4=v4
export const items_reducer = createSlice({
  name: "item",
  initialState: {
    name: "",
    open:false,
    edit:false,
    id: "",
    reference: "",
    type: "TEXT",
    setting: {
      maxWidth: 0,
      maxHeight: 0,
      overflow: "Complete On Next Page",
    },
    layer: {
      name: "",
      label: "",
    },
    value: "",
    nextFrame: {
      id: "",
      name: "",
      label: "",
    },
  },
  reducers: {
    changeName: (state, action) => {
      return Object.assign(state,{name:action.payload})
    },
    generateID: (state) => {
      state.id = v4();
      state.reference = "##" + state.id + "##";
      state.nextFrame.id = v4();
      return state
    },
    changeType: (state, action) => {
      state.type = action.payload;
      return state
    },
    changeOverflowType: (state, action) => {
      state.setting.overflow = action.payload;
      return state
    },
    changeMaxWidth: (state, action) => {
      state.setting.maxWidth = action.payload;
      return state
    },
    changeMaxHeight: (state, action) => {
      state.setting.maxHeight = action.payload;
      return state
    },
    edit: (state, action) => {
      console.log("🚀 ~ file: items_reducer.jsx ~ line 48 ~ state", action.payload);
      
      return Object.assign(state,action.payload,{open:true,edit:true});
 
      
    },
    open:(state)=>{
      state.open=true;
    },
    close:(state)=>{
      state.open=false;
    },
    reset:(state, action)=>{
      return state={
        name: "",
        open:false,
        edit:false,
        id: "",
        reference: "",
        type: "TEXT",
        setting: {
          maxWidth: 0,
          maxHeight: 0,
          overflow: "None",
        },
        layer: {
          name: "",
          label: "",
        },
        value: "",
        nextFrame: {
          id: "",
          name: "",
          label: "",
        }
      }
      console.log(state);
    },
    changeTextValue:function(state,action){
      return Object.assign(state,{value:action.payload})

    }
  },
});

export const selectItem = (state) => state.item;
export const {
  changeName,
  changeType,
  generateID,
  changeOverflowType,
  changeMaxWidth,
  changeMaxHeight,
  edit,
  open,
  close,
  reset,
  changeTextValue
} = items_reducer.actions;

export default items_reducer.reducer;

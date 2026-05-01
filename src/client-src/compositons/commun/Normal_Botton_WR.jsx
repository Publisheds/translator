import React from "react";
import Single_Button from "./buttons/Single_Button";
import "./css/Text_Input_C.css";
import { useSelector, useDispatch } from "react-redux";
import {
  ExtendScriptState,
  set_by_path,
} from "../../redux/extendScript_reducer";
import GET_SET_OBJECT from "../../redux/utils";
import _ from "underscore";

const { get_Object_Path } = GET_SET_OBJECT;

export default function Normal_Botton_WR(props) {
  const { label,hidden, default_Value, path_reducer_state, onClick_F,disable } = props;
  console.log("🚀 ~ file: Normal_Botton_WR.jsx ~ line 16 ~ Normal_Botton_WR ~ hidden", hidden)
  if(hidden)return []
  const ExtendScriptState_Active = useSelector(ExtendScriptState);
  const dispatch = useDispatch();

  const onClick = () => {
    if (!_.isEmpty(path_reducer_state)) {
      const vl =
        get_Object_Path(path_reducer_state, ExtendScriptState_Active) || 0;
      dispatch(set_by_path({ path: path_reducer_state, value: vl + 1 }));
    }
    if (_.isFunction(onClick_F)) onClick_F();
  };
  return (
    <div className="flex_Parent_Row flex_1 ">
      <Single_Button disable={disable} onClick={onClick} label={label} extraStylesLabel={{height:"25px"}} />
    </div>
  );
}

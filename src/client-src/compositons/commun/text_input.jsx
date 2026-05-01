import React from "react";
import Input_C from "./input/input";
import Title_Text from "./text/text_1";
import "./css/Text_Input_C.css";
import { useSelector, useDispatch } from "react-redux";
import {
  ExtendScriptState,
  set_by_path,
} from "../../redux/extendScript_reducer";
import GET_SET_OBJECT from "../../redux/utils";

const { get_Object_Path } = GET_SET_OBJECT;

export default function Text_Input_C(props) {
  const { label, default_Value, path_reducer_state, style, Hide_label } = props;
  console.log("🚀 ~ file: text_input.jsx ~ line 16 ~ Text_Input_C ~ style", style)
  const ExtendScriptState_Active = useSelector(ExtendScriptState);
  const dispatch = useDispatch();
  const onChange = (ev) => {
    console.log("🚀 ~ file: text_input.jsx ~ line 23 ~ onChange ~ ev.target.value", ev.target.value)
    dispatch(set_by_path({ path: path_reducer_state, value: ev.target.value }));
    return ev.target.value
  };
  return (
    <div className="flex_Parent_Row flex flex-col text-black">
      {Hide_label ? [] : <Title_Text text={label} />}
      <Input_C
        value={get_Object_Path(path_reducer_state, ExtendScriptState_Active)}
        onChange={onChange}
        {...props}
      />
    </div>
  );
}

import React from "react";
import { Input } from "antd";
const { TextArea } = Input;

import "../css/Text_Input_C.css";

export default function TextArea_UI(props) {
  const { flex, onChange, value, disabled, type, onPressEnter, style } = props;
  return (
    <TextArea
      onChange={onChange}
      value={value}
      disabled={disabled}
      onPressEnter={onPressEnter}
      type={type ? type : "text"}
      className={"flex_" + (_.isNumber(flex) ? flex : 1)}
      style={{ style }}
    />
  );
}

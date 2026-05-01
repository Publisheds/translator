import React from "react";
import { Input } from "antd";
import "../css/Text_Input_C.css";

export default function Input_C(props) {
  const { flex, onChange, value, disabled, type, onPressEnter, style,_placeholder } = props;
  return (
    <Input
      onChange={onChange}
      value={value}
      disabled={disabled}
      onPressEnter={onPressEnter}
      type={type ? type : "text"}
      className={"flex_" + (_.isNumber(flex) ? flex : 1)}
      style={{ style }}
      placeholder={_placeholder}
    />
  );
}

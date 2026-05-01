import React from "react";
import { Input } from "antd";

export default function Input_N(props) {
  const { disabled, value, placeholder, onChange, onPressEnter } = props;
  return (
      <Input
        style={{ flex: 1,margin:5 }}
        disabled={disabled}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onPressEnter={onPressEnter}
      />
  );
}

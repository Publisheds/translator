import React from "react";
import { Typography } from "antd";
const { Text } = Typography;
const texts = ["secondary", "success", "warning", "danger"];
import "../css/Text_Input_C.css";
import _ from "underscore";
export default function Title_Text(props) {
  const { text, type_N, disabled, code, flex, strong, ondblclick_F } = props;
  return (
    <Text
      onDoubleClick={ondblclick_F}
      disabled={disabled}
      strong={strong}
      style={{ marginLeft: "5px", display: "list-item" }}
      // type={type_N}//@todo: change color of the text when success
      className={"text-black text-left pl-2 flex_" + (_.isNumber(flex) ? flex : 1)}
    >
      {"  "}{_.isObject(text) ? JSON.stringify(text) : text}
    </Text>
  );
}

import React from "react";
import { Typography } from "antd";
const { Title } = Typography;
const texts = ["secondary", "success", "warning", "danger"];
export default function Title_Text(props) {
  const { text, level, type_N, disabled, code } = props;
  return (
    <Title >
      {text}
    </Title>
  );
}

import React from "react";
import { Button } from "antd";
import { PoweroffOutlined } from "@ant-design/icons";

export default function Single_Button(props) {
  const { onClick, label, disable,extraStylesLabel } = props;
  return (
    <Button
    disabled={disable}
      style={{ flex: 1, margin: 2,...extraStylesLabel }}
      type="primary"
      // icon={<PoweroffOutlined />}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

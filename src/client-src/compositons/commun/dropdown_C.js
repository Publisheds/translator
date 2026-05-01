import { Menu, Dropdown, Button, Space } from 'antd';
import React, { useEffect } from 'react'
import Title_Text from "./text/text_1";

import { useSelector, useDispatch } from "react-redux";
import {
    ExtendScriptState,
    set_by_path,
} from "../../redux/extendScript_reducer";
import GET_SET_OBJECT from "../../redux/utils";
import _ from 'underscore';

const { get_Object_Path } = GET_SET_OBJECT;
const menu = (props, onClick) => {

    const { path } = props;
    return <Menu style={{
        overflow: "scroll",
        height: "200px"
    }}>
        {_.isArray(props.list) ? props.list.map((item, key) => {
            console.log("🚀 ~ file: dropdown_C.js ~ line 40 ~ {_.isArray ~ item", item)

            return <Menu.Item
                key={item.name + "_" + key}
                style={{ width: "100%" }}
                onClick={() => {
                    onClick(key)
                }}>
                <a style={{ width: "100%" }} target="_blank" rel="noopener noreferrer" >
                    {item.name}
                </a>
            </Menu.Item>
        }) : []}

    </Menu>
};


export default function Dropdown_C(props) {
    const { path, label, list, selected } = props;
    const ExtendScriptState_Active = useSelector(ExtendScriptState);
    const dispatch = useDispatch();
    const onClick = (selected) => {
        dispatch(set_by_path({ path: path + ">selected", value: selected }));
    };
    var selected_T = selected || 0;
    const action_state = get_Object_Path(path, ExtendScriptState_Active)
    console.log("🚀 ~ file: dropdown_C.js:46 ~ Dropdown_C ~ action_state", action_state)

    useEffect(() => {
        if (_.isUndefined(action_state)) {
            onClick(selected)
            return
        }
        if (_.isUndefined(action_state.selected)) {
            onClick(selected || 0)
        }
    })
    console.log("🚀 ~ file: dropdown_C.js ~ line 46 ~ Dropdown_C ~ action_state", action_state)
    if (!_.isUndefined(action_state)) {

        selected_T = action_state.selected
    }
    if (_.isEmpty(list)) return [];
    return (
        <div style={{ display: "flex", margin: 5 }}>
            {label ? <Title_Text text={label} flex={1} /> : []}

            <Dropdown style={{ flex: 1 }} trigger={['click']} overlay={() => menu(props, onClick)} arrow={true} placement="bottomLeft">
                <Button style={{ flex: 1 }}>{selected_T != -1 && !_.isUndefined(selected_T) ? list[selected_T].name : ""}</Button>
            </Dropdown>

        </div>
    )
}

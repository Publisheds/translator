import React from 'react'

import {  Button } from 'antd';

export default function Radio_Button(props) {
    const {Clicked_F,label}=props
    return (
        <Button  type="primary" onClick={Clicked_F} value="small">{label}</Button>

    )
}

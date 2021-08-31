/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-07-24 21:52:15
 * @Description: 
 */
import React from 'react'
import ReactDOM from 'react-dom'
import Chatin from './chatin'
import style from "./body.less";
import "@/migration";
// db.
const rootContainerElement = document.createElement('div')
document.body.append(rootContainerElement)
rootContainerElement.className=style['app']
ReactDOM.render(<Chatin />, rootContainerElement)

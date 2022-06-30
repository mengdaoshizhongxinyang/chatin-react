import React from 'react'
import ReactDOM from 'react-dom'
import Chatin from './chatin'
import style from "./body.less";
import "@/migration";
import ThemeProvider from "seifal-ui/dist/system/ThemeProvider";
const rootContainerElement = document.createElement('div')
document.body.append(rootContainerElement)
rootContainerElement.className=style['app']
ReactDOM.render(
    <Chatin/>, 
    rootContainerElement
)

import React from 'react'
import ReactDOM from 'react-dom'
import Chatin from './chatin'
import style from "./body.less";
const rootContainerElement = document.createElement('div')
document.body.append(rootContainerElement)
rootContainerElement.className=style['app']
ReactDOM.render(<Chatin />, rootContainerElement)

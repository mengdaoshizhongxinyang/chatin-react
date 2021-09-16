/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-03-18 09:14:35
 * @Description: 
 */
import React, { createElement, useEffect } from "react";
import User from "./user.svg";
import Password from "./password.svg";
import QQ from "./QQ.svg";
import home from "./home.svg";
import terminal from "./terminal.svg";
import folder from "./folder.svg";
const iconList={
  home,
  User,
  Password,
  QQ,
  terminal,
  folder,
  testControl:terminal
}
type SVG=JSX.IntrinsicElements['svg']
interface Props extends SVG{
  iconName:keyof typeof iconList
}
const Icon:React.FC<Props>=(props)=>{
  const {iconName,children,...attr}=props
  return createElement(
    iconList[props.iconName],
    {
      ...attr
    }
  )
}
export default Icon
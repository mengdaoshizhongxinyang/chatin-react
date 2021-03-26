/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-03-26 17:13:00
 * @Description: 
 */
import React from "react";
import style from "./bubble.module.less";
type Props={
  content?:React.ReactNode
}
const bubble:React.FC<Props>=(props)=>{
  return <div className={style['bubble-main']}>{props.children || ""}</div>
}
export default bubble
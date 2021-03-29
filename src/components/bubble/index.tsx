/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-03-26 17:13:00
 * @Description: 
 */
import React from "react";
import style from "./bubble.module.less";
type Props={
  time?:number | string
  position?:'left'|'right'
  type?:keyof typeof colorType
}
const colorType={
  primary:style['bubble-primary'],
  default:""
}
const bubble:React.FC<Props>=(props)=>{
  return <div 
    data-backcolor="#fff" 
    className={`${style['bubble-main']}  
    ${props.position=='right'?style['bubble-right']:style['bubble-left']} ${props.type?colorType[props.type]:''}`
  }>{props.children || ""}<sub className={style['bubble-main-sub']}>{props.time}</sub>
  </div>
}
export default bubble
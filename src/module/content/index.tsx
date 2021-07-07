/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-07-07 14:25:06
 * @Description: 
 */
import QQ from "./qq";
import Home from "./home";
import React from "react";
type Props={
  state:States
}
function RenderContent(state:States){
  switch(state){
    case "QQ":
      return <QQ />
    case "home":
      return <Home />
  }
}
const content:React.FC<Props>=(props)=>{
  return <>
    {
      RenderContent(props.state)
    }
  </>
}
export default content
export type States="QQ" | "home"

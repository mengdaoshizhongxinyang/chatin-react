/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-07-07 14:25:06
 * @Description: 
 */
import QQ from "./qq";
import Home from "./home";
import Terminal from "./terminal";
import Folder from "./folder";
import TestControl from "./testControl";
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
    case "terminal":
      return <Terminal />
    case "folder":
      return <Folder />
    case "testControl":
      return <TestControl />
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
export type States="QQ" | "home" | "terminal" | "folder" |"testControl"

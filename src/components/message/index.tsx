/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-07-09 09:31:32
 * @Description: 
 */
import React from "react";

import Image from "./image";
type Props = {
  message: string
}


const handleCQcode = (cqcode: CQcode) => {
  let cqcodeObject: CQcodeObject = Object.fromEntries(
    cqcode
      .slice(1, - 1)
      .replace("CQ:", "CQ=")
      .split(',')
      .map(keyValue => {
        return keyValue.split('=')
      })
  )
  switch (cqcodeObject.CQ) {
    case "image":
      return <Image cqcodeObject={cqcodeObject}></Image>
    default:
      return null
  }
}

const message: React.FC<Props> = (props) => {
  return <>
    {/* {
      handleCQcode()
    } */}
  </>
}
export default message
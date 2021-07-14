/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-03-17 11:55:48
 * @Description: 
 */
import React, { useState } from "react";
import style from "./chatin.module.less";
import Content, { States } from "@/module/content";
import Icon from "@/components/icon";
const IconList: States[] = ['home', 'QQ','terminal']
const chatin: React.FC<{}> = () => {
  const [state, setState] = useState<States>("home")

  return <div className={style['main']}>
    <div className={style['app-list']}>
      {
        IconList.map((key) => {
          return <div key={key} onClick={() => setState(key)} className={style['icon']}>
            <Icon iconName={key} width={30} height={30} fill={'#444'}></Icon>
          </div>
        })
      }
    </div>
    <div className={style['content']}>
      <Content state={state}></Content>
    </div>
  </div>
}
export default chatin
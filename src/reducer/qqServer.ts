import { qqHelper } from "@/helper/qq";


import { Friend } from "@/model"

/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-09-25 22:04:54
 * @Description: 
 */

export interface IQQServerMap {
    [QQServer.INIT]: { friends: typeof qqHelper }
}
export type QQActions = IAction<QQServer, IQQServerMap>

const qqServerState = (state:typeof qqHelper|null=null, action: QQActions) => {
    switch (action.type) {
        case QQServer.INIT:
            return state as typeof qqHelper
        default:
            return state
    }
}

export default qqServerState
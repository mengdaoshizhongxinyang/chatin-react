/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-09-25 22:06:59
 * @Description: 
 */
interface IActionsPayloadMapping {
    [key: string]: any
}

declare type IAction<K extends string, M extends IActionsPayloadMapping> = {
    [key in K]: key extends keyof M ?
    {
        type: key
        payload: M[key]
    } : {
        type: key
    }
}[K]
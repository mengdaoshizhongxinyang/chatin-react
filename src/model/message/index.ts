/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-09-26 21:55:55
 * @Description: 
 */
import { GroupMessage } from "./groupMessage";
import { FriendMessage } from "./friendMessage";
type HertType = {
    interval: number
    meta_event_type: string
    post_type: "meta_event"
    status: { [key in string]: any }
    time: number
    self_id: number
}
export type Message=HertType | GroupMessage.WSMessage | FriendMessage.WSMessage
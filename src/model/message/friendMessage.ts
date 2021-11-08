/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-09-27 21:00:21
 * @Description: 
 */
/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-09-26 21:53:16
 * @Description: 
 */

import { Model } from "../model";
import { getDB } from "@/utils/db";
import { SR } from "@/utils/sr";
import { Friend } from "../friend";

export class FriendMessage extends Model<FriendMessage.Field>{
    protected fillable: Model.Fillable<FriendMessage.Field> = [
        'font', 'message', 'message_id',
        'raw_message', 'time', 'user_id'
    ]
}
export namespace FriendMessage {
    export type Field = {
        time: number
        font: number
        message: string
        message_id: number
        raw_message: string
        user_id: number
        target_id: number
        sub_type: "friend"
    }
    
    type More = {
        message_type: "private"
        self_id: number
        sender: Friend.Field
        post_type: "message"
    }
    export type WSMessage = Field & More
}

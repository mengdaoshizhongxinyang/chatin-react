/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-09-26 21:53:16
 * @Description: 
 */

import { Model } from "../model";
import { getDB } from "@/utils/db";
import { SR } from "@/utils/sr";
import { Friend } from "../friend";

export class GroupMessage extends Model<GroupMessage.Field>{
    protected fillable: Model.Fillable<GroupMessage.Field> = [
        'anonymous', 'font', 'group_id', 'message', 'message_id',
        'message_seq', 'raw_message', 'sub_type',
        'time', 'user_id'
    ]
}
export namespace GroupMessage {
    export type Field = {
        anonymous: string
        font: number
        group_id: number
        message: string
        message_id: number
        message_seq: number

        raw_message: string
        sub_type: string
        user_id: number
        time: number
    }
    type More = {
        message_type: "group"
        self_id: number
        sender: Friend.Field
        post_type: "message"
    }
    export type WSMessage = Field & More
}

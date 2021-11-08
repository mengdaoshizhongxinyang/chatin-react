/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-09-13 10:52:03
 * @Description: 
 */
import { Schema } from "@/utils/schema"
export default function updateQQFriendsList210913() {
    return Schema.Create('messages', (table) => {
        table.string('id')
        table.text('message')
        table.string('user_id')
        table.string('user_name')
        table.integer('time')
    })
}

/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-09-13 10:52:03
 * @Description: 
 */
import { Schema } from "@/utils/schema"
export default function updateQQFriendsList210913() {
    return Schema.Create('group_messages', (table) => {
        table.string('anonymous')
        table.integer('font')
        table.string('group_id')

        table.text('message')
        table.integer('message_id')
        table.integer('message_seq')
        // table.
        table.text('raw_message')
        table.string('sub_type')
        table.integer('user_id')
        table.integer('time')

        table.primary('group_id')
        
    })
}

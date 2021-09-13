/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-08-25 11:31:11
 * @Description: 
 */
import { Schema } from "@/utils/schema"
export default function createQQFriendsList210825() {
    return Schema.Create('friends', (table) => {
        table.string('nickname').notNull()
        table.string('remark').setLength(100)
        table.integer('user_id')
    })
}

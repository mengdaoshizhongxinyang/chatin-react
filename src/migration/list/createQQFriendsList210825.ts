/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-08-25 11:31:11
 * @Description: 
 */
import { Schema } from "@/utils/schema"
export default function createQQFriendsList210825() {
    return Schema.Create('friends', (blueprint) => {
        blueprint.string('nickname').notNull()
        blueprint.string('remark').setLength(100)
        blueprint.integer('user_id')
        blueprint.integer('is_use').default(0)
    })
}

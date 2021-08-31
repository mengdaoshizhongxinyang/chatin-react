/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-08-25 11:31:11
 * @Description: 
 */

// import { Database } from "sqlite3"
// export default (db:Database)=>{
//     db.run(`CREATE TABLE friends(nickname varchar(255) NOT NULL,remark varchar(255),user_id bigint)`)
// }
import { Schema } from "@/utils/schema"
export default new Schema('friends', 'create', (table) => {
    table.string('nickname').notNull()
    table.string('remark').setLength(100)
    table.integer('user_id')
}).get()

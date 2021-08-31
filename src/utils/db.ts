/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-07-26 16:24:15
 * @Description: 
 */
import { verbose } from "sqlite3";
let sqlite3 = verbose()
export function getDB() {
    return new sqlite3.Database(
        './db.db',
        sqlite3.OPEN_READWRITE,
        function (err) {
            if (err) {
                return console.log(err.message)
            }
        }
    )
}
export default getDB
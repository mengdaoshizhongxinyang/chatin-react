/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-09-07 13:30:37
 * @Description: send request
 */
import http from "http";
export namespace SR {
    export function get<T = unknown>(url: string){
        return new Promise<T>((resolve, reject) => {
            http.get(url, (res) => {
                let data: T
                let temp = ''
                res.setEncoding('utf8')
                res.on('data', chunk => {
                    temp += chunk
                }).on('end', async () => {
                    data = JSON.parse(temp)
                    resolve(data)
                })
            })
        })
    }
}
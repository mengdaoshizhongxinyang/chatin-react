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
    export function getImage(url: string){
        //http://q1.qlogo.cn/g?b=qq&nk=729403918&s=640
        //http://p.qlogo.cn/gh/720974149/720974149/640/
        return new Promise<string>((resolve, reject) => {
            http.get(url, (res) => {
                let temp = ''
                res.setEncoding('binary')
                res.on('data', chunk => {
                    temp += chunk
                }).on('end', async () => {
                    resolve(temp)
                })
            })
        })
    }
}
/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-09-07 13:30:37
 * @Description: send request
 */
import http from "http";
export namespace SR {
    export function get<T = unknown>(url: string) {
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
    export function getImage(url: string) {
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
    export function send(url: string, data: any) {
        return new Promise(() => {
            let sendData = JSON.stringify(data)
            const req = http.request({
                hostname:"127.0.0.1",
                port:5700,
                path: "/send_private_msg",
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(sendData)
                }
            }, (res) => {
                res.setEncoding("utf-8")
                res.on('data', d => {
                    process.stdout.write(d)
                })
            })
            req.on('error', error => {
                console.error(error)
            })
            req.on('connect',res=>{
                console.log(res)
            })
            req.write(sendData)
            req.end()
        })

    }
}
/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-09-24 11:32:43
 * @Description: 
 */
interface CQBaseResult<T>{
    data: T
    retcode: number
    status: string
}
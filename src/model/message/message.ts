import { Model } from "../model";

/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-11-01 16:33:31
 * @Description: 
 */
export class Message extends Model<Message.Field>{
    protected fillable:Model.Fillable<Message.Field>=[
        'accept_id','id','message','time',
        'type','user_id','user_name'
    ]
}

export namespace Message{
    export type Field={
        id:string
        accept_id:string
        message:string
        user_id:string
        user_name:string
        type:string
        time:number
    }
}

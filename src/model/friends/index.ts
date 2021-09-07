/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-09-06 13:48:19
 * @Description: 
 */
import {Model} from "../model";

export class Friend extends Model<Friend.Field>{
    protected fillable:Model.Fillable<Friend.Field>=['nickname','remark','user_id']
}

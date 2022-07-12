export interface BaseEvent {
  time: number
  self_id: number
  post_type: 'message' | 'request' | 'notice' | 'meta_event'
}

export interface MessageEvent extends BaseEvent{
  sub_type:string
  message_id:number
  user_id:number
  message:any
  raw_message:string
  font:number
  
}
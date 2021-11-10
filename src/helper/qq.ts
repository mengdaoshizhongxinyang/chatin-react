/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-09-25 22:10:30
 * @Description: 
 */
import { Friend } from "@/model";
import { Group } from "@/model";
import { SR } from "@/utils/sr";

type Heart = {
    interval: number
    meta_event_type: "heartbeat"
    post_type: "meta_event"
    self_id: number
    status: any
    time: number
}
type PrivateMessage = {
    time: number
    self_id: number
    post_type: "message"
    message_type: "private"
    sub_type: "friend" | "group" | "group_self" | "other"
    // 0	群聊
    // 1	QQ咨询
    // 2	查找
    // 3	QQ电影
    // 4	热聊
    // 6	验证消息
    // 7	多人聊天
    // 8	约会
    // 9	通讯录
    temp_source: number
    message_id: number
    user_id: number
    message: string
    raw_message: string
    font: number
    sender: {
        user_id: number
        nickname: string
        sex: "male" | "female" | "unknown"
        age: number
    }
}

type GroupMessage = {
    time: number
    self_id: number
    post_type: "message"
    message_type: "group"
    sub_type: "normal" | "anonymous" | "notice"
    message_id: number
    group_id: number
    user_id: number
    anonymous: {
        id: number
        name: string
        flag: string
    } | null
    message: string
    raw_message: string
    font: number
    sender: {
        user_id: number
        nickname: string
        //群备注
        card: string
        sex: "male" | "female" | "unknown"
        age: number
        area: string
        level: string
        role: "owner" | "admin" | "member"
        title: string
    }
}

type Message = Heart | PrivateMessage | GroupMessage
class QQServerHelper {
    public friends: Friend.Field[] = []
    public groups: Group.Field[] = []
    public messageObj: QQServerHelper.MessageObj = {}

    public setFriends: (friends: Friend.Field[]) => any = () => { }
    public setGroups: (groups: Group.Field[]) => any = () => { }
    public setMessages: (messageObj: QQServerHelper.MessageObj) => any = () => { }
    private wsc: WebSocket | null = null
    constructor() {
        this.init()
    }
    async init() {
        await this.getFriends()
        await this.getGroups()
        this.startWS()
    }
    async getFriends(isFresh: boolean = false) {
        if (this.friends.length == 0 || isFresh) {
            try {
                let friends = await Friend.getList(isFresh)
                this.friends = friends
                friends = friends.filter(friend => {
                    return friend.is_use == 1
                })
                this.setFriends(this.friends)
                this.messageObj = Object.assign(this.messageObj, Object.fromEntries(friends.map(friend => {
                    return [`${friend.user_id}_private`, {
                        senderId: friend.user_id,
                        remark: friend.remark,
                        senderName: friend.nickname,
                        type: 'private',
                        message: []
                    }]
                })))
            } catch (e) {

            }
        }
    }
    async getGroups(isFresh: boolean = false) {
        if (this.getGroups.length == 0 || isFresh) {
            try {
                let groups = await Group.getList(isFresh)
                this.groups = groups
                this.setGroups(this.groups)
                groups = groups.filter(group => {
                    return group.is_use == 1
                })
                this.messageObj = Object.assign(this.messageObj, Object.fromEntries(groups.map(groups => {
                    return [`${groups.group_id}_group`, {
                        senderId: groups.group_id,
                        senderName: groups.group_name,
                        type: 'group',
                        message: []
                    }]
                })))
            } catch (e) {

            }
        }
    }
    async sendPrivate(info: { user_id: number, group_id?: number, message: string }) {
        SR.send("http://127.0.0.1:5700/send_private_msg", { ...info, auto_escape: false })
    }
    async sendGroup(info: { group_id: number, message: string }) {
        SR.send("http://127.0.0.1:5700/send_group_msg", { ...info, auto_escape: false })
    }
    async startWS() {
        if (this.wsc != null) {
            this.wsc.close()
        }
        try {
            this.wsc = new WebSocket("ws://127.0.0.1:6700")
            this.wsc.onmessage = async (message: MessageEvent<string>) => {
                const msg: Message = JSON.parse(message.data)
                // TODO: cq码的处理
                if (msg.post_type == "message") {
                    let key: number

                    if (msg.message_type === 'group') {
                        key = msg.group_id
                        if (!this.messageObj[`${key}_group`]) {
                            const group = await Group.getOne(key)
                            this.messageObj[`${key}_group`] = {
                                senderName: group!.group_name,
                                senderId: key,
                                type: 'group',
                                message: []
                            }
                        }
                        this.messageObj[`${key}_group`]['message'] = [msg, ...(this.messageObj[`${key}_group`]['message'])]
                        await Group.active(key)
                    }
                    else if (msg.message_type === 'private') {
                        key = msg.user_id
                        if (!this.messageObj[`${key}_private`]) {
                            const friend = await Friend.getOne(key)
                            this.messageObj[`${key}_private`] = {
                                senderName: friend!.nickname,
                                remark: friend!.remark,
                                senderId: key,
                                type: 'group',
                                message: []
                            }
                        }
                        this.messageObj[`${key}_private`]['message'] = [msg, ...(this.messageObj[`${key}_private`]['message'])]
                        await Friend.active(key)
                    } else {
                        return
                    }
                    this.setMessages(Object.assign({}, this.messageObj))
                }
            }
        } catch (e) {
            console.log(e)
        }

    }
}

namespace QQServerHelper {
    export type MessageObj = {
        [key in string]: {
            senderId: number
            remark?: string
            senderName: string
            type: 'group' | 'private'
            message: (Extract<Message, { post_type: 'message', message_type: 'private' }> | Extract<Message, { post_type: 'message', message_type: 'group' }>)[]
        }
    }
}
export type QQHelper = QQServerHelper
const qqHelper = new QQServerHelper()

export {
    qqHelper
}
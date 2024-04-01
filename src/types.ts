export interface MessageMeta {
    id: number
    content: string
    createdAt: string
    score: number
    user: {
        image: {
            png: string
            webp: string
        }
        username: string
    }
    replyingTo?: string
    replies?: MessageMeta[]
}

export interface CurrentUserMeta {
    image: {
        png: string
        webp: string
    }
    username: string
    action?: string
    followUpAction?: () => void
    commentList?: MessageMeta[]
    comment?: MessageMeta
    onNewTopLevelComment?: (list: MessageMeta[]) => void
    onReply?: (parentComment: MessageMeta, reply: MessageMeta) => void
}

export interface CommentInterface {
    comment: MessageMeta
    currentUser: CurrentUserMeta
    commentList: MessageMeta[]
    onReply: (parentComment: MessageMeta, reply: MessageMeta) => void
}
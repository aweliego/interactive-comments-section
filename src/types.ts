export interface MessageMeta {
    id: number
    content: string
    createdAt: string
    originalTimestamp?: Date
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
    onEdit: (commentId: number, newValue: string) => void
    onDelete: (commentId: number, deletedPost?: MessageMeta) => void
    onScoreChange: (commentId: number, change: number) => void
}
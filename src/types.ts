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
    commentsList?: MessageMeta[]
    updateCommentsList?: (list: MessageMeta[]) => void
}

export interface CommentInterface {
    comment: MessageMeta & { replies?: Array<MessageMeta> }
    currentUser: CurrentUserMeta
    commentsList: MessageMeta[]
    updateCommentsList: (list: MessageMeta[]) => void
}
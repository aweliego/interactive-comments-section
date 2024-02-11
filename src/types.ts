interface MessageMeta {
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
}

export type CommentInterface = MessageMeta & { replies?: Array<MessageMeta> }

export interface CurrentUserMeta {
    image: {
        png: string
        webp: string
    }
    username: string
}

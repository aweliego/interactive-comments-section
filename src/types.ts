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
}

export type ResponseInterface = MessageMeta & { replyingTo: string }

export type CommentInterface = MessageMeta & { replies?: Array<ResponseInterface> }

export interface CurrentUserMeta {
    image: {
        png: string
        webp: string
    }
    username: string
}

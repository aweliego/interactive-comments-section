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

type ResponseInterface = MessageMeta & { replyingTo: string }

type CommentInterface = MessageMeta & { replies: Array<ResponseInterface> | [] }


const Comment: React.FC<CommentInterface> = ({ id, content, createdAt, score, user, replies }) => {

    return (
        <>
            <article>
                <div>
                    <p>{score}</p>
                </div>
                <div>
                    <p>{user.username}</p>
                    <p>{createdAt}</p>
                    <p>Reply</p>
                </div>
                <div>
                    <p>{content}</p>
                </div>
                <div>
                    {replies.length > 0 && replies.map(reply => (<div>{reply.content}</div>))}
                </div>
            </article>
        </>
    )
}

export default Comment

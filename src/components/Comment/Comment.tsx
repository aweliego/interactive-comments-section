import IconPlus from '../../../public/images/icon-plus.svg'
import IconMinus from '../../../public/images/icon-minus.svg'
import IconReply from '../../../public/images/icon-reply.svg'

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
            <article className="bg-neutral-white flex flex-col p-8 m-2 rounded w-full">
                <div className='flex'>
                    {/* Score */}
                    <div className="bg-neutral-gray-extra-light flex flex-col items-center py-4 px-3 mr-6 rounded h-max">
                        <img src={IconPlus} className='text-neutral-gray-light w-3 hover:cursor-pointer' />
                        <p className="text-primary-blue-moderate font-medium py-4">{score}</p>
                        <img src={IconMinus} className='text-neutral-gray-light w-3 hover:cursor-pointer' />
                    </div>
                    {/* Meta and CTA */}
                    <div className='flex flex-col'>
                        <div className='flex mb-4'>
                            {/* Meta */}
                            <div className='flex flex-grow-1 w-full gap-4 items-center'>
                                <img src={user.image.png} alt="user-icon" className='w-8' />
                                <p className='text-neutral-blue-dark font-semibold'>{user.username}</p>
                                <p className='text-neutral-blue-grayish'>{createdAt}</p>
                            </div>
                            {/* CTA */}
                            <div className='text-primary-blue-moderate  flex flex-grow-0 items-center gap-2 mr-4 hover:cursor-pointer'>
                                <img src={IconReply} alt="" className='w-4' />
                                <p className="hover:text-primary-blue-light font-medium">  Reply</p>
                            </div>
                        </div>
                        {/* Content */}
                        <div className='text-neutral-blue-grayish'>
                            <p>{content}</p>
                        </div>
                    </div>
                </div>
                {/* Replies */}
                {/* <div>
                    {replies.length > 0 && replies.map(reply => (<div>{reply.content}</div>))}
                </div> */}
            </article>
        </>
    )
}

export default Comment

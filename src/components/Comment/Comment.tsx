import { useState } from 'react'

import IconPlus from '../../../public/images/icon-plus.svg'
import IconMinus from '../../../public/images/icon-minus.svg'
import IconReply from '../../../public/images/icon-reply.svg'
import IconEdit from '../../../public/images/icon-edit.svg'
import IconDelete from '../../../public/images/icon-delete.svg'

import { CommentInterface } from '../../types'
import NewCommentForm from '../NewCommentForm'


const Comment: React.FC<CommentInterface> = ({ comment, currentUser, commentList, onReply }) => {
    const { content, createdAt, score, user, replyingTo } = comment
    const { image, username } = currentUser
    const isCurrentUser = comment?.user?.username === currentUser?.username

    const [isAReply, setIsAReply] = useState<boolean>(false)
    const [action, setAction] = useState<string>('create')

    const handleClickReply = (): void => {
        setIsAReply(true)
        setAction('reply')
    }

    const handleHideNewCommentForm = (): void => {
        setIsAReply(false)
    }

    return (
        <>
            <article className="bg-neutral-white rounded grid grid-rows-mobile grid-cols-mobile md:grid-rows-desktop md:grid-cols-desktop w-full p-4 md:p-8 my-2">
                {/* Meta */}
                <div className='flex flex-grow-1 w-full gap-4 items-center row-start-1 row-span-1 col-start-1 col-span-3 md:col-start-2 md:col-span-1'>
                    <img src={user?.image?.png} alt="user-icon" className='w-8' />
                    <p className='text-neutral-blue-dark font-semibold'>{user?.username}</p>
                    <p className='text-neutral-blue-grayish'>{createdAt}</p>
                </div>
                {/* Content */}
                <div className='text-neutral-blue-grayish px-2 md:px-0 py-4 row-start-2 row-span-1 col-start-1 col-span-3 md:col-start-2 md:col-span-2 w-full'>
                    {replyingTo && (<span className="text-primary-blue-moderate font-medium">@{replyingTo} </span>
                    )}
                    <span>{content}</span>
                </div>
                {/* Score */}
                <div className="bg-neutral-gray-extra-light rounded flex flex-row items-center md:py-4 px-3 md:px-0 md:mr-6 md:flex-col h-max row-start-3 row-span-1 md:row-start-1 md:row-span-2 col-start-1 col-span-1 min-w-max max-w-max">
                    <img src={IconPlus} className='text-neutral-gray-light hover:cursor-pointer w-3' />
                    <p className="text-primary-blue-moderate font-medium px-4 py-2 md:py-4">{score}</p>
                    <img src={IconMinus} className='text-neutral-gray-light hover:cursor-pointer w-3' />
                </div>
                {/* CTA */}
                <div className='flex items-center gap-2 mr-4 md:mr-0 hover:cursor-pointer row-start-3 row-span-1 md:row-start-1 md:row-span-1 col-start-3 col-span-1 justify-end'>
                    {isCurrentUser ?
                        (<>
                            <img src={IconDelete} alt="delete-icon" className='w-4' />
                            <p className="text-primary-red-soft hover:text-primary-red-pale font-medium mr-4"
                                onClick={() => null}
                            >  Delete</p>
                            <img src={IconEdit} alt="edit-icon" className='w-4 hover:fill-primary-blue-light' />
                            <p className=" text-primary-blue-moderate hover:text-primary-blue-light font-medium"
                                onClick={() => null}
                            >  Edit</p>
                        </>
                        ) :
                        (<>
                            <img src={IconReply} alt="reply-icon" className='w-4' />
                            <p className=" text-primary-blue-moderate hover:text-primary-blue-light font-medium"
                                onClick={handleClickReply}
                            >  Reply</p>
                        </>)}
                </div>
            </article>
            <div className={`${isAReply ? 'flex' : 'hidden'} w-full`}>
                <NewCommentForm
                    image={image}
                    username={username}
                    action={action}
                    followUpAction={handleHideNewCommentForm}
                    commentList={commentList}
                    comment={comment}
                    onReply={onReply} />
            </div>
            {comment.replies?.length !== 0 ? (
                <div className='flex w-full'>
                    <div className='w-0.5 bg-neutral-gray-light md:ml-12'></div>
                    <div className='pl-6 md:pl-12 max-w-full flex-grow'>
                        {comment.replies?.map((reply) =>
                        (<Comment
                            key={reply.id}
                            comment={reply}
                            currentUser={currentUser}
                            commentList={commentList}
                            onReply={onReply}
                        />))}
                    </div>
                </div>) : null}
        </>
    )
}

export default Comment

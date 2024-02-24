import { useState } from 'react'

import IconPlus from '../../../public/images/icon-plus.svg'
import IconMinus from '../../../public/images/icon-minus.svg'
import IconReply from '../../../public/images/icon-reply.svg'

import { CommentInterface } from '../../types'
import NewCommentForm from '../NewCommentForm'


const CommentBuilder: React.FC<CommentInterface> = ({ comment, currentUser }) => {
    const { content, createdAt, score, user, replyingTo } = comment
    const { image, username } = currentUser

    const [isNewComment, setIsNewComment] = useState<boolean>(false)
    const [action, setAction] = useState<string>('create')

    const handleReply = (): void => {
        setIsNewComment(true)
        setAction('reply')
    }

    const handleHideNewCommentForm = (): void => {
        setIsNewComment(false)
    }

    return (
        <>
            <article className="bg-neutral-white rounded grid grid-rows-mobile md:grid-rows-desktop md:grid-cols-desktop w-full p-4 md:p-8 my-2">
                {/* Meta */}
                <div className='flex flex-grow-1 w-full gap-4 items-center row-start-1 row-span-1 col-start-1 col-span-3 md:col-start-2 md:col-span-1'>
                    <img src={user?.image?.png} alt="user-icon" className='w-8' />
                    <p className='text-neutral-blue-dark font-semibold'>{user?.username}</p>
                    <p className='text-neutral-blue-grayish'>{createdAt}</p>
                </div>
                {/* Content */}
                <div className='text-neutral-blue-grayish py-4 row-start-2 row-span-1 col-start-1 col-span-3 md:col-start-2 md:col-span-2 w-full'>
                    {replyingTo && (<span className="text-primary-blue-moderate font-medium">@{replyingTo} </span>
                    )}
                    <span>{content}</span>
                </div>
                {/* Score */}
                <div className="bg-neutral-gray-extra-light rounded flex flex-row items-center md:py-4 px-3 md:px-0 md:mr-6 md:flex-col h-max row-start-3 row-span-1 md:row-start-1 md:row-span-2 col-start-1 col-span-1">
                    <img src={IconPlus} className='text-neutral-gray-light hover:cursor-pointer w-3' />
                    <p className="text-primary-blue-moderate font-medium px-4 py-2 md:py-4">{score}</p>
                    <img src={IconMinus} className='text-neutral-gray-light hover:cursor-pointer w-3' />
                </div>
                {/* CTA */}
                <div className='text-primary-blue-moderate flex items-center gap-2 mr-4 hover:cursor-pointer row-start-3 row-span-1 md:row-start-1 md:row-span-1 col-start-3 col-span-1'>
                    <img src={IconReply} alt="" className='w-4' />
                    <p className="hover:text-primary-blue-light font-medium"
                        onClick={handleReply}
                    >  Reply</p>
                </div>
            </article>
            {isNewComment && <NewCommentForm image={image} username={username} action={action} handleHideNewCommentForm={handleHideNewCommentForm} />}
        </>
    )
}

export default CommentBuilder

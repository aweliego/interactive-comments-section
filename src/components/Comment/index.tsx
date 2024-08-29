import { useState } from 'react'

import Meta from './Meta'
import Content from './Content'
import Score from './Score'
import UserActionButtons from './UserActionButtons'
import NewCommentForm from '../NewCommentForm'

import { CommentInterface } from '../../types'
import { MessageMeta } from '../../types'

const Comment: React.FC<CommentInterface> = ({ comment, currentUser, commentList, onReply, onEdit, onDelete, onScoreChange }) => {
    const { replyingTo } = comment
    const { image, username } = currentUser
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [isCommentFormOpen, setIsCommentFormOpen] = useState<boolean>(false)
    const [action, setAction] = useState<string>('create')
    const isReply = !!replyingTo
    const isCurrentUser: boolean = comment?.user?.username === currentUser?.username
    const isMobile: boolean = window.innerWidth < 600

    const handleClickReply = (): void => {
        setIsCommentFormOpen(true)
        setAction('reply')
    }

    const handleHideNewCommentForm = (): void => {
        setIsCommentFormOpen(false)
    }

    const editComment = (): void => {
        setIsEditing(true)
        setAction('edit')
    }

    const handleUpdate = (id: number, commentValue: string, editedComment?: MessageMeta): void => {
        onEdit(id, commentValue, editedComment)
        setIsEditing(false)
    }

    return (
        <>
            <article className={`bg-neutral-white rounded grid ${isEditing ? 'grid-rows-mobile_add' : 'grid-rows-mobile grid-cols-mobile'}  md:grid-rows-desktop md:grid-cols-desktop w-full p-4 md:p-8 my-2`}>
                <Meta comment={comment} />
                <Content
                    comment={comment}
                    isEditing={isEditing}
                    handleUpdate={handleUpdate}
                    isReply={isReply}
                    isMobile={isMobile}
                    action={action}
                />
                <Score
                    comment={comment}
                    onScoreChange={onScoreChange}
                    isEditing={isEditing}
                    isReply={isReply}
                    isMobile={isMobile}
                    isCurrentUser={isCurrentUser}
                />
                <UserActionButtons
                    comment={comment}
                    isEditing={isEditing}
                    isReply={isReply}
                    isMobile={isMobile}
                    isCurrentUser={isCurrentUser}
                    onDelete={onDelete}
                    editComment={editComment}
                    handleClickReply={handleClickReply}
                />
            </article>
            {isCommentFormOpen &&
                (<div className={'flex w-full'}>
                    <NewCommentForm
                        image={image}
                        username={username}
                        action={action}
                        followUpAction={handleHideNewCommentForm}
                        commentList={commentList}
                        comment={comment}
                        onReply={onReply} />
                </div>)}
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
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onScoreChange={onScoreChange}
                        />))}
                    </div>
                </div>) : null}
        </>
    )
}

export default Comment

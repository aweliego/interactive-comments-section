import { useState } from 'react'

import IconPlus from '../../../public/images/icon-plus.svg'
import IconMinus from '../../../public/images/icon-minus.svg'
import { EditIcon, ReplyIcon, DeleteIcon } from '../icons/icons'

import NewCommentForm from '../NewCommentForm'
import SubmitButton from '../SubmitButton'
import DeleteConfirmationModal from './DeleteConfirmationModal'

import { CommentInterface } from '../../types'
import { MessageMeta } from '../../types'
import { autoResize } from '../../utils'


const Comment: React.FC<CommentInterface> = ({ comment, currentUser, commentList, onReply, onEdit, onDelete, onScoreChange }) => {
    const { id, content, createdAt, score, user, replyingTo } = comment
    const { image, username } = currentUser
    const [commentValue, setCommentValue] = useState<string>(content)
    const [commentScore, setCommentScore] = useState<number>(score ? score : 0)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [isCommentFormOpen, setIsCommentFormOpen] = useState<boolean>(false)
    const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
    const [action, setAction] = useState<string>('create')
    const [isDisabled, setIsDisabled] = useState<boolean>(false)
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

    const handleUpdate = (id: number, editedComment?: MessageMeta): void => {
        onEdit(id, commentValue, editedComment)
        setIsEditing(false)
    }

    const handleOpenConfirmationModal = (): void => {
        setDeleteModalOpen(true)
    }

    const handleCloseConfirmationModal = (): void => {
        setDeleteModalOpen(false)
    }

    const upvoteComment = (id: number, upvotedReply?: MessageMeta): void => {
        setCommentScore(prevScore => prevScore + 1)
        onScoreChange(id, +1, upvotedReply)
        setIsDisabled(true)
    }

    const downvoteComment = (id: number, downvotedReply?: MessageMeta): void => {
        setCommentScore(prevScore => prevScore - 1)
        onScoreChange(id, -1, downvotedReply)
        setIsDisabled(true)
    }

    return (
        <>
            <article className={`bg-neutral-white rounded grid ${isEditing ? 'grid-rows-mobile_add' : 'grid-rows-mobile grid-cols-mobile'}  md:grid-rows-desktop md:grid-cols-desktop w-full p-4 md:p-8 my-2`}>
                {/* Meta */}
                <div className='flex flex-grow-1 w-full gap-4 items-center row-start-1 row-span-1 col-start-1 col-span-3 md:col-start-2 md:col-span-1'>
                    <img src={user?.image?.png} alt="user-icon" className='w-8' />
                    <p className='text-neutral-blue-dark font-semibold'>{user?.username}</p>
                    <p className='text-neutral-blue-grayish'>{createdAt}</p>
                </div>
                {/* Content */}
                {isEditing ? (
                    <>
                        <textarea
                            className='col-start-1 col-span-3 row-start-2 md:row-span-2 md:col-start-2 md:col-span-2 p-2 my-4 border-2 border-neutral-gray-light outline-primary-blue-moderate resize-none overflow-hidden h-32'
                            rows={isMobile ? 4 : 3}
                            onChange={(e) => { setCommentValue(e.target.value); autoResize(e) }}
                            value={commentValue}
                        >
                        </textarea>
                        <SubmitButton
                            action={action}
                            onClick={() => handleUpdate(id, isReply ? comment : undefined)}
                        />
                    </>
                ) : (<div className='text-neutral-blue-grayish px-2 md:px-0 py-4 row-start-2 row-span-1 col-start-1 col-span-3 md:col-start-2 md:col-span-2 w-full'>
                    {replyingTo && (<span className="text-primary-blue-moderate font-medium">@{replyingTo} </span>
                    )}
                    <span>{commentValue}</span>
                </div>)}

                {/* Score */}
                <div className={`${isEditing && isMobile ? 'hidden' : ' bg-neutral-gray-extra-light rounded flex flex-row items-center md:py-4 px-3 md:px-0 md:mr-6 md:flex-col h-max row-start-3 row-span-1 md:row-start-1 md:row-span-2 col-start-1 col-span-1 min-w-max max-w-max'}`}>
                    <img
                        src={IconPlus}
                        alt='upvote'
                        className={`text-neutral-gray-light ${isCurrentUser ? 'hover:cursor-default' : 'hover:cursor-pointer'} w-3`}
                        onClick={isCurrentUser || isDisabled ? undefined : () => upvoteComment(id, isReply ? comment : undefined)}
                    />
                    <p className="text-primary-blue-moderate font-medium py-2 md:py-4 w-10 text-center">{commentScore}</p>
                    <img
                        src={IconMinus}
                        alt='downvote'
                        className={`text-neutral-gray-light ${isCurrentUser || isDisabled ? 'hover:cursor-default' : 'hover:cursor-pointer'} w-3`}
                        onClick={isCurrentUser || isDisabled ? undefined : () => downvoteComment(id, isReply ? comment : undefined)}
                    />
                </div>

                {/* CTA */}
                {isCurrentUser ?
                    (<div className={`${isEditing && isMobile ? 'hidden' : 'cta-button'}`}>
                        <div className='flex items-center fill-primary-red-soft hover:fill-primary-red-pale   text-primary-red-soft hover:text-primary-red-pale  '>
                            <DeleteIcon />
                            <p className="font-medium mr-4"
                                onClick={() => handleOpenConfirmationModal()}
                            >  Delete</p>
                        </div>
                        <DeleteConfirmationModal
                            isOpen={isDeleteModalOpen}
                            onDelete={onDelete}
                            onCancel={handleCloseConfirmationModal}
                            id={id}
                            comment={comment}
                            isReply={isReply}
                        />
                        <div className='flex items-center cta-button-blue'>
                            <EditIcon />
                            <p className="font-medium"
                                onClick={editComment}
                            >  Edit</p>
                        </div>
                    </div>
                    ) : !isEditing &&
                    (<div className='cta-button cta-button-blue'>
                        <ReplyIcon />
                        <p className="font-medium"
                            onClick={handleClickReply}
                        >  Reply</p>
                    </div>)}
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

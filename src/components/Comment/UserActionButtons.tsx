import { useState } from 'react'

import DeleteConfirmationModal from './DeleteConfirmationModal'
import { EditIcon, ReplyIcon, DeleteIcon } from '../icons/icons'

import { MessageMeta } from '../../types'

type UserActionButtonsProps = {
    comment: MessageMeta
    isEditing: boolean
    isReply: boolean
    isMobile: boolean
    isCurrentUser: boolean
    onDelete: (commentId: number, deletedPost?: MessageMeta) => void
    editComment: () => void
    handleClickReply: () => void
    showAlert: (type: string, text: string) => void
}

const UserActionButtons = ({ comment, isEditing, isMobile, isReply, isCurrentUser, onDelete, editComment, handleClickReply, showAlert }: UserActionButtonsProps) => {
    const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)

    const handleOpenConfirmationModal = (): void => {
        setDeleteModalOpen(true)
    }

    const handleCloseConfirmationModal = (): void => {
        setDeleteModalOpen(false)
    }

    return (
        <>
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
                        comment={comment}
                        isReply={isReply}
                        showAlert={showAlert}
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
        </>
    )
}

export default UserActionButtons
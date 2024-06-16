import Modal from '../Modal'
import { MessageMeta } from '../../types'

interface DeleteConfirmationModalProps {
    isOpen: boolean
    id: number
    comment: MessageMeta
    isReply: boolean
    onCancel: () => void
    onDelete: (id: number, reply?: MessageMeta) => void
};

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    id,
    comment,
    isReply,
    onCancel,
    onDelete
}) => {

    const deleteComment = (id: number, deletedComment?: MessageMeta): void => {
        onDelete(id, deletedComment)
    }

    return (
        <Modal isOpen={isOpen}>
            <article className='flex flex-col gap-y-4'>
                <h4 className='font-medium text-xl text-neutral-blue-dark'>Delete comment</h4>
                <p className='text-neutral-blue-grayish'>Are you sure you want to delete this comment? This will remove the comment and can't be undone.</p>
                <div className='flex gap-x-2 justify-between'>
                    <button className='bg-neutral-blue-grayish text-white font-medium px-4 sm:px-8 py-3 uppercase rounded-lg border-none w-6/12'
                        onClick={onCancel}>No, cancel</button>
                    <button className='bg-primary-red-soft text-white font-medium px-4 sm:px-8 py-3 uppercase rounded-lg border-none w-6/12'
                        onClick={() => deleteComment(id, isReply ? comment : undefined)}
                    >Yes, delete</button>
                </div>
            </article>
        </Modal >
    )
}

export default DeleteConfirmationModal
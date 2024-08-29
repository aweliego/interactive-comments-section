import { useState } from 'react'
import moment from 'moment'

import SubmitButton from './SubmitButton'

import { MessageMeta, CurrentUserMeta } from '../types'

const NewCommentForm: React.FC<CurrentUserMeta> = ({ image, username, action, followUpAction, commentList, comment, onNewTopLevelComment, onReply }) => {
    const [disabled, setDisabled] = useState<boolean>(true)
    const [newCommentContent, setNewCommentContent] = useState<string>('')

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        e.preventDefault()
        const timestamp = new Date()

        const newComment = {
            id: Date.now(),
            content: newCommentContent,
            createdAt: moment(timestamp).fromNow(),
            originalTimestamp: timestamp,
            score: 0,
            user: { image, username },
            ...(onReply && { replyingTo: `${comment?.user?.username}` }),
            replies: []
        }
        onNewTopLevelComment && onNewTopLevelComment([...commentList as MessageMeta[], newComment])
        comment && onReply && onReply(comment, newComment)
        setNewCommentContent('')
        setDisabled(true)
        followUpAction && followUpAction()
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        setNewCommentContent(e.target.value)
        if (e.target.value.trim() !== "" && e.target.value.trim() !== "\n") {
            setDisabled(false)
        }
    }

    return (
        <form className='bg-neutral-white rounded grid items-center gap-y-4 md:gap-y-0 md:gap-x-4 grid-rows-mobile_add md:grid-rows-desktop md:grid-cols-desktop_add w-full p-4 md:py-8 my-2'>
            <textarea
                placeholder='Add a comment...'
                className='col-start-1 col-span-3 md:row-start-1 md:row-span-2 md:col-start-2 md:col-span-1 p-4 border-2 border-neutral-gray-light outline-primary-blue-moderate '
                onChange={handleChange}
                value={newCommentContent}
            >
            </textarea>
            <img
                src={image?.png}
                alt="user-icon"
                className='w-8 justify-self-start md:justify-self-end row-start-2 col-start-1 col-span-1 md:row-start-1 md:row-span-1' />
            <SubmitButton
                action={action}
                disabled={disabled}
                onClick={handleSubmit}
            />
        </form>
    )
}

export default NewCommentForm
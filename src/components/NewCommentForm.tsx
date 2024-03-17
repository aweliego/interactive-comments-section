import { MessageMeta, CurrentUserMeta } from '../types'

import { useState } from 'react'

const NewCommentForm: React.FC<CurrentUserMeta> = ({ image, username, action, followUpAction, commentsList, comment, onNewTopLevelComment, onReply }) => {
    const [disabled, setDisabled] = useState<boolean>(true)
    const [newCommentContent, setNewCommentContent] = useState<string>('')

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        e.preventDefault()
        const newComment = {
            id: Date.now(),
            content: newCommentContent,
            createdAt: 'now',
            score: 0,
            user: { image, username },
            replies: []
        }
        onNewTopLevelComment && onNewTopLevelComment([...commentsList as MessageMeta[], newComment])
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

    const updateButtonText = (action: string): string => {
        switch (action) {
            case 'create': return 'SEND'
            case 'reply': return 'REPLY'
            case 'edit': return 'UPDATE'
            default: return 'SEND'
        }
    }

    return (
        <form className='bg-neutral-white rounded grid items-center gap-y-4 md:gap-y-0 md:gap-x-4 grid-rows-mobile_add md:grid-rows-desktop md:grid-cols-desktop_add w-full p-4 md:py-8 m-2'>
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
            <button className={`px-8 py-3 rounded  bg-primary-blue-moderate text-white ${disabled ? 'cursor-not-allowed opacity-70' : ' opacity-100 hover:bg-primary-blue-light cursor-pointer'} justify-self-end row-start-2 col-start-3 md:row-start-1 md:row-span-1 md:col-start-3 md:col-span-1`}
                type='submit'
                disabled={disabled}
                onClick={handleSubmit}>
                {action && updateButtonText(action)}
            </button>
        </form>
    )
}

export default NewCommentForm
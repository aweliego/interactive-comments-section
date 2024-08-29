import { useState } from 'react'

import SubmitButton from '../SubmitButton'

import { MessageMeta } from '../../types'

import { autoResize } from '../../utils'

type ContentProps = {
    comment: MessageMeta
    isEditing: boolean
    handleUpdate: (id: number, commentValue: string, editedComment?: MessageMeta) => void
    isReply: boolean
    isMobile: boolean
    action: string
}

const Content = ({ comment, isEditing, handleUpdate, isReply, isMobile, action }: ContentProps) => {
    const { id, content, replyingTo } = comment
    const [commentValue, setCommentValue] = useState<string>(content)

    return (
        <>
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
                        onClick={() => handleUpdate(id, commentValue, isReply ? comment : undefined)}
                    />
                </>
            ) : (<div className='text-neutral-blue-grayish px-2 md:px-0 py-4 row-start-2 row-span-1 col-start-1 col-span-3 md:col-start-2 md:col-span-2 w-full'>
                {replyingTo && (<span className="text-primary-blue-moderate font-medium">@{replyingTo} </span>
                )}
                <span>{commentValue}</span>
            </div>)}
        </>
    )
}

export default Content
import { useState } from 'react'

import IconPlus from '../../../public/images/icon-plus.svg'
import IconMinus from '../../../public/images/icon-minus.svg'

import { MessageMeta } from '../../types'

type ScoreProps = {
    comment: MessageMeta
    onScoreChange: (id: number, change: number, upvotedReply?: MessageMeta) => void
    isEditing: boolean
    isReply: boolean
    isCurrentUser: boolean
    isMobile: boolean
    showAlert: (display?: boolean, type?: string, text?: string) => void
}

const Score = ({ comment, onScoreChange, isEditing, isReply, isMobile, isCurrentUser, showAlert }: ScoreProps) => {
    const { id, score } = comment
    const [commentScore, setCommentScore] = useState<number>(score ? score : 0)
    const [isDisabled, setIsDisabled] = useState<boolean>(false)

    const upvoteComment = (id: number, upvotedReply?: MessageMeta): void => {
        setCommentScore(prevScore => prevScore + 1)
        onScoreChange(id, +1, upvotedReply)
        showAlert(true, 'success', 'Comment successfully upvoted!')
        setIsDisabled(true)
    }

    const downvoteComment = (id: number, downvotedReply?: MessageMeta): void => {
        setCommentScore(prevScore => prevScore - 1)
        onScoreChange(id, -1, downvotedReply)
        showAlert(true, 'success', 'Comment successfully downvoted!')
        setIsDisabled(true)
    }

    return (
        <div className={`${isEditing && isMobile ? 'hidden' : ' bg-neutral-gray-extra-light rounded flex flex-row items-center md:py-4 px-3 md:px-0 md:mr-6 md:flex-col h-max row-start-3 row-span-1 md:row-start-1 md:row-span-2 col-start-1 col-span-1 min-w-max max-w-max'}`}>
            <img
                src={IconPlus}
                alt='upvote'
                className={`text-neutral-gray-light ${isCurrentUser ? 'hover:cursor-default' : 'hover:cursor-pointer'} w-3`}
                onClick={
                    isCurrentUser ? () => showAlert(true, 'danger', 'You cannot upvote your own comment!')
                        : isDisabled ? () => showAlert(true, 'danger', 'You can only upvote once!')
                            : () => upvoteComment(id, isReply ? comment : undefined)}
            />
            <p className="text-primary-blue-moderate font-medium py-2 md:py-4 w-10 text-center">{commentScore}</p>
            <img
                src={IconMinus}
                alt='downvote'
                className={`text-neutral-gray-light ${isCurrentUser || isDisabled ? 'hover:cursor-default' : 'hover:cursor-pointer'} w-3`}
                onClick={
                    isCurrentUser ? () => showAlert(true, 'danger', 'You cannot downvote your own comment!')
                        : isDisabled ? () => showAlert(true, 'danger', 'You can only downvote once!')
                            : () => downvoteComment(id, isReply ? comment : undefined)}
            />
        </div>
    )
}

export default Score
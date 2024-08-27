import { MessageMeta } from './types'
import moment from 'moment'

export const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target as HTMLTextAreaElement
    textarea.style.height = '8rem'
    const scrollHeight = textarea.scrollHeight
    textarea.style.height = scrollHeight + 'px'
}

/**
  * Updates the timestamp of the comments and their replies recursively
  * Hardcoded comments do not have a originalTimestamp attribute and show their hardcoded createdAt value instead
  * 
  * @param comments - The comment list
  * @returns comment list with updated timestamps
  */
export const updateTimestamps = (comments: MessageMeta[]): MessageMeta[] => {
    return comments.map(comment => ({
        ...comment,
        createdAt: comment.originalTimestamp ? moment(comment.originalTimestamp).fromNow() : comment.createdAt,
        replies: comment.replies ? updateTimestamps(comment.replies) : []
    }))
}
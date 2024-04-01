import data from './data'
import Comment from './components/Comment/Comment'
import NewCommentForm from './components/NewCommentForm'
import { useState } from 'react'
import { MessageMeta } from './types'

const App = () => {
  const { comments } = data
  const { currentUser } = data

  const [commentsList, setCommentsList] = useState<MessageMeta[]>(comments)

  const handleNewTopLevelComment = (list: MessageMeta[]): void => {
    setCommentsList(list)
  }

  /**
   * Returns the top level parent comment of the comment being replied to
   * 
   * @remarks
   * First if statement handles replies to top level comments 
   * Second if statement handles replies to replies
   * 
   * @param commentedPost - The comment being commented on/replied to
   * @param allComments - The full comment list
   * @returns The found top level parent comment of the commentedPost
   */
  const findTopLevelComment = (commentedPost: MessageMeta, allComments: MessageMeta[]): MessageMeta | undefined => {
    let topLevelComment
    // runs if comment is top level (aka not a reply)
    if (commentedPost.id) {
      topLevelComment = allComments.find((comment) => comment.id === commentedPost.id)
    }
    // searches for top level comment among replies if no match was found above (aka commentedPost is a reply)
    for (const comment of allComments) {
      if (comment?.replies && comment.replies.some(reply => reply.id === commentedPost.id)) {
        topLevelComment = comment
      }
    }
    return topLevelComment
  }

  /**
   * Updates the commentList with new comments and replies
   * 
   * @param commentedPost - The comment being commented on/replied to
   * @param newComment - The new comment posted as standalone comment or a reply
   * @returns undefined
   */
  const handleReply = (commentedPost: MessageMeta, newComment: MessageMeta) => {
    const topLevelComment = findTopLevelComment(commentedPost, commentsList)
    topLevelComment?.replies?.push(newComment)
    setCommentsList([...commentsList])
  }

  return (
    <main className='flex flex-col items-center justify-center max-w-default mx-auto p-10'>
      {commentsList.map((comment) =>
        <>
          <Comment
            key={comment.id}
            comment={comment}
            currentUser={currentUser}
            commentsList={commentsList}
            onReply={handleReply}
          />
        </>
      )}
      <NewCommentForm
        {...currentUser}
        action={'create'}
        commentsList={commentsList}
        onNewTopLevelComment={handleNewTopLevelComment}
      />
    </main>
  )
}

export default App

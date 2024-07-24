import data from './data'
import Comment from './components/Comment/Comment'
import NewCommentForm from './components/NewCommentForm'
import { useEffect, useState } from 'react'
import { MessageMeta } from './types'

const App = () => {
  const { currentUser } = data

  const getCommentsFromStorage = () => {
    const savedComments = localStorage.getItem('comments')
    return savedComments ? JSON.parse(savedComments) : []
  }

  const sortCommentsByScore = (comments: MessageMeta[]) => comments.sort((a, b) => b.score - a.score)

  const [commentList, setCommentList] = useState<MessageMeta[]>(sortCommentsByScore(getCommentsFromStorage()))

  useEffect(() => {
    localStorage.setItem('comments', JSON.stringify(commentList))
  }, [commentList])

  const updateCommentList = (list: MessageMeta[]): void => {
    const sortedComments = sortCommentsByScore(list)
    setCommentList(sortedComments)
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
    // runs if commentedPost is top level (aka commentedPost is not a reply)
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
    const topLevelComment = findTopLevelComment(commentedPost, commentList)
    topLevelComment?.replies?.push(newComment)
    setCommentList([...commentList])
  }

  /**
   * Removes a deleted comment or reply from the comment list
   * 
   * @param commentedId - the id of the comment to be deleted
   * @param deletedPost (optional) - if the comment being deleted is a reply, this argument is needed to find it among the replies of the top level comment
   * @returns undefined
   */
  const handleDelete = (commentId: number, deletedPost?: MessageMeta) => {
    if (deletedPost) {
      const topLevelComment = findTopLevelComment(deletedPost, commentList)
      if (topLevelComment && topLevelComment.replies) {
        const deletedPostIdx = topLevelComment?.replies?.indexOf(deletedPost)
        deletedPostIdx !== -1 && topLevelComment?.replies?.splice(deletedPostIdx, 1)
        setCommentList([...commentList])
      }
    } else {
      setCommentList(prevComments => prevComments.filter(prevComment => prevComment.id !== commentId))
    }
  }

  const handleScoreChange = (id: number, change: number) => {
    const updatedComments = commentList.map(comment => {
      if (comment.id === id) {
        return { ...comment, score: comment.score + change }
      }
      return comment
    })
    updateCommentList(updatedComments)
  }

  return (
    <main className='flex flex-col items-center justify-center max-w-default mx-auto p-10'>
      {commentList.map((comment) =>
        <>
          <Comment
            key={comment.id}
            comment={comment}
            currentUser={currentUser}
            commentList={commentList}
            onReply={handleReply}
            onEdit={updateCommentList}
            onDelete={handleDelete}
            onScoreChange={handleScoreChange}
          />
        </>
      )}
      <NewCommentForm
        {...currentUser}
        action={'create'}
        commentList={commentList}
        onNewTopLevelComment={updateCommentList}
      />
    </main>
  )
}

export default App

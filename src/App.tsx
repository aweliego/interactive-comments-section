import { useEffect, useState } from 'react'

import data from './data'
import Comment from './components/Comment'
import NewCommentForm from './components/NewCommentForm'
import Alert from './components/Alert'

import { updateTimestamps } from './utils'

import { AlertInterface, MessageMeta } from './types'

const App = () => {
  const { currentUser } = data

  const getCommentsFromStorage = () => {
    const savedComments = localStorage.getItem('comments')
    return savedComments ? JSON.parse(savedComments) : []
  }

  const sortCommentsByScore = (comments: MessageMeta[]) => comments.sort((a, b) => b.score - a.score)

  const [commentList, setCommentList] = useState<MessageMeta[]>(sortCommentsByScore(getCommentsFromStorage()))
  const [alert, setAlert] = useState<AlertInterface>({ show: false, type: '', text: '' })

  useEffect(() => {
    localStorage.setItem('comments', JSON.stringify(commentList))
  }, [commentList])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCommentList(prevComments => updateTimestamps(prevComments))
    }, 60000)

    return () => clearInterval(intervalId)
  }, [])

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

  /**
   * Updates the score of a comment or reply
   * 
   * @param id - the id of the comment whose score is to be updated
   * @param change - the change made in the score
   * @param reply (optional) - if the comment whose score is being updated is a reply, this argument is needed to find it among the replies of the top level comment
   * @returns undefined
   */

  const handleScoreChange = (id: number, change: number, reply?: MessageMeta) => {
    let updatedComments: MessageMeta[] = []
    if (reply) {
      const topLevelComment = findTopLevelComment(reply, commentList)
      if (topLevelComment && topLevelComment.replies) {
        const updatedReplies = topLevelComment.replies.map(reply => {
          if (reply.id === id) {
            return { ...reply, score: reply.score + change }
          }
          return reply
        })

        const updatedComment = {
          ...topLevelComment,
          replies: updatedReplies
        }

        updatedComments = commentList.map(comment =>
          comment.id === topLevelComment.id ? updatedComment : comment
        )
      }
    } else {
      updatedComments = commentList.map(comment => {
        if (comment.id === id) {
          return { ...comment, score: comment.score + change }
        }
        return comment
      })
    }
    updateCommentList(updatedComments)
  }

  /**
 * Updates the content of a comment or reply
 * 
 * @param id - the id of the comment to be edited
 * @param newValue - the new content
 * @param editedPost (optional) - if the comment being edited is a reply, this argument is needed to find it among the replies of the top level comment
 * @returns undefined
 */
  const handleEdit = (id: number, newValue: string, editedPost?: MessageMeta) => {
    let updatedComments: MessageMeta[] = []
    if (editedPost) {
      const topLevelComment = findTopLevelComment(editedPost, commentList)
      if (topLevelComment && topLevelComment.replies) {
        const updatedReplies = topLevelComment.replies.map(reply => {
          if (reply.id === id) {
            return { ...reply, content: newValue }
          }
          return reply
        })

        const updatedComment = {
          ...topLevelComment,
          replies: updatedReplies
        }

        updatedComments = commentList.map(comment =>
          comment.id === topLevelComment.id ? updatedComment : comment
        )
      }

    } else {
      updatedComments = commentList.map(comment => {
        if (comment.id === id) {
          return { ...comment, content: newValue }
        }
        return comment
      })
    }
    updateCommentList(updatedComments)
  }

  const showAlert = (show = false, type = '', text = ''): void => {
    setAlert({ show, type, text })
  }

  return (
    <main className='flex flex-col items-center justify-center max-w-default mx-auto p-10'>
      {alert.show && <Alert {...alert} showAlert={showAlert} />}
      {commentList.map((comment) =>
        <>
          <Comment
            key={comment.id}
            comment={comment}
            currentUser={currentUser}
            commentList={commentList}
            onReply={handleReply}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onScoreChange={handleScoreChange}
            showAlert={showAlert}
          />
        </>
      )}
      <NewCommentForm
        {...currentUser}
        action={'create'}
        commentList={commentList}
        onNewTopLevelComment={updateCommentList}
        showAlert={showAlert}
      />
    </main>
  )
}

export default App

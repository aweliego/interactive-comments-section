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

  const handleReply = (parentComment: MessageMeta, reply: MessageMeta) => {
    parentComment?.replies?.push(reply)
    setCommentsList([...commentsList])
  }

  return (
    <section className='flex flex-col items-center justify-center max-w-default mx-auto p-10'>
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
    </section>
  )
}

export default App

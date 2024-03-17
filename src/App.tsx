import data from './data'
import Comment from './components/Comment/Comment'
import NewCommentForm from './components/NewCommentForm'
import { useState } from 'react'
import { MessageMeta } from './types'

const App = () => {
  const { comments } = data
  const { currentUser } = data

  const [commentsList, setCommentsList] = useState<MessageMeta[]>(comments)

  const updateCommentsList = (list: MessageMeta[]): void => {
    setCommentsList(list)
  }

  return (
    <section className='flex flex-col items-center justify-center max-w-default mx-auto p-10'>
      {commentsList.map((comment) =>
        <>
          <Comment
            comment={comment}
            currentUser={currentUser}
            commentsList={commentsList}
            updateCommentsList={updateCommentsList}
          />
          {comment.replies?.length !== 0 ? (
            <div className='flex'>
              <div className='w-1 bg-neutral-gray-light md:ml-12'></div>
              <div className='pl-6 md:pl-12'>
                {comment.replies?.map((reply) =>
                (<Comment
                  key={reply.id}
                  comment={reply}
                  currentUser={currentUser}
                  commentsList={commentsList}
                  updateCommentsList={updateCommentsList}
                />))}
              </div>
            </div>) : null}
        </>
      )}
      <NewCommentForm
        {...currentUser}
        action={'create'}
        commentsList={commentsList}
        updateCommentsList={updateCommentsList}
      />
    </section>
  )
}

export default App

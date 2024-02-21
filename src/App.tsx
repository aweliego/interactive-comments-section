import data from '../data.json'
import Comment from './components/Comment/Comment'
import NewCommentForm from './components/NewCommentForm'

const App = () => {
  const { comments } = data
  const { currentUser } = data

  return (
    <section className='flex flex-col items-center justify-center max-w-default mx-auto p-10'>
      {comments.map((comment) => <Comment key={comment.id} comment={comment} currentUser={currentUser} />)}
      <NewCommentForm {...currentUser} action={'create'} />
    </section>
  )
}

export default App

import data from '../data.json'
import Comment from './components/Comment/Comment'
import AddComment from './components/AddComment'

const App = () => {
  const { comments } = data
  const { currentUser } = data

  return (
    <section className='flex flex-col items-center justify-center max-w-default mx-auto p-10'>
      {comments.map((comment) => <Comment key={comment.id} comment={comment} currentUser={currentUser} />)}
      <AddComment {...currentUser} />
    </section>
  )
}

export default App

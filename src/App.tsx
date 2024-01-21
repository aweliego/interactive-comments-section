import data from '../data.json'
import Comment from './components/Comment/Comment'
import AddComment from './components/AddComment'

const App = () => {
  const { comments } = data
  const { currentUser } = data

  return (
    <section className='flex flex-col items-center justify-center sm:w-8/12 md:w-7/12 lg:w-6/12 mx-auto p-10'>
      {comments.map((comment) => <Comment key={comment.id} {...comment} />)}
      <AddComment {...currentUser} />
    </section>
  )
}

export default App

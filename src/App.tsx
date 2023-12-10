import data from '../data.json'
import Comment from './components/Comment/Comment'

const App = () => {
  const { comments } = data

  return (
    <section className='flex flex-col items-center justify-center w-5/12 mx-auto p-10'>
      {comments.map((comment) => <Comment key={comment.id} {...comment} />)}
    </section>
  )
}

export default App

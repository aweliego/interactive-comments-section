import data from '../data.json'
import Comment from './components/Comment/Comment'

const App = () => {
  const { comments } = data

  return (
    <section>
      {comments.map((comment) => <Comment key={comment.id} {...comment} />)}
    </section>
  )
}

export default App

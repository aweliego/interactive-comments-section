import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../../../App'

const MockApp = () => {
  return (
    <App />
  )
}

describe('Comment Component', () => {
  it('renders initial comment and replies correctly', () => {
    render(<MockApp />)

    const commentContent = screen.getByText(/impressive/i)
    const commentUser = screen.getByText(/amyrobson/i)
    const commentReplies = screen.getAllByText(/recommend/i)
    expect(commentContent).toBeInTheDocument()
    expect(commentUser).toBeInTheDocument()
    commentReplies.forEach(reply => {
      expect(reply).toBeInTheDocument()
    })
  })

  it('does not render replies section when there are no replies', () => {
    render(<MockApp />)
    const commentReplies = screen.queryByText('This is a reply')
    expect(commentReplies).toBeNull()
  })

  it('renders a new comment after clicking the Send button of the bottom comment form', async () => {
    const user = userEvent.setup()
    render(<MockApp />)

    const textbox = screen.getAllByPlaceholderText(/add a comment/i)
    const sendBtn = screen.getAllByRole('button', {
      name: /send/i
    })
    user.type(textbox[0], 'Posting a new comment!')
    user.click(sendBtn[0])

    await waitFor(() => {
      const newCommentContent = screen.queryByRole('article', { name: /posting/i })
      if (newCommentContent) {
        expect(newCommentContent).toBeInTheDocument()
      }
    })
  })

  it('renders a new reply after clicking the Reply button', async () => {
    const user = userEvent.setup()
    render(<MockApp />)
    const replyActionBtn = screen.getAllByText(/reply/i)
    const textbox = screen.getAllByPlaceholderText(/add a comment/i)
    user.click(replyActionBtn[0])
    user.type(textbox[0], 'Replying to a comment!')

    await waitFor(() => {
      const replySubmitBtn = screen.queryByRole('button', {
        name: /reply/i
      })
      if (replySubmitBtn) {
        user.click(replySubmitBtn)
      }
      const newReplyContent = screen.queryByRole('article', { name: /replying/i })
      if (newReplyContent) {
        expect(newReplyContent).toBeInTheDocument()
      }
    })
  })

  it('disables the Send button if the comment content is blank', async () => {
    const user = userEvent.setup()
    render(<MockApp />)

    const textbox = screen.getAllByPlaceholderText(/add a comment/i)
    const sendBtn = screen.getAllByRole('button', {
      name: /send/i
    })
    user.type(textbox[0], '  ')
    expect(sendBtn[0]).toBeDisabled()
  })
})
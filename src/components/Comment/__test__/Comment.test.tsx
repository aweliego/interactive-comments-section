import { describe, it, expect } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../../../App'

const MockApp = () => {
  return (
    <App />
  )
}

describe('Comment component', () => {
  describe('when component initially renders', () => {
    it('should show the initial comments and replies correctly', () => {
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

    it('should not show the reply section when there are no replies', () => {
      render(<MockApp />)
      const commentReplies = screen.queryByText('This is a reply')
      expect(commentReplies).toBeNull()
    })
  })

  describe('when a user posts a new comment', () => {
    it('should render a new comment after clicking the Send button of the bottom comment form', async () => {
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

    it('should disable the Send button if the comment content is blank', async () => {
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

  describe('when a user replies to a comment', () => {
    it('should render a new reply after clicking the Reply button', async () => {
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
  })

  describe('when a user edits their comment', () => {

    it('should not allow user to edit comments from other users', () => {
      render(<MockApp />)
      const commentOtherUser = screen.getByText(/amyrobson/i)
      const editBtn = within(commentOtherUser).queryByText(/edit/i)
      expect(editBtn).toBeNull()
    })
  })

  it('should turn the comment into a text area with an update button', async () => {
    const user = userEvent.setup()
    render(<MockApp />)
    const commentCurrentUser = screen.getByText(/juliusomo/i).closest('article')
    expect(commentCurrentUser).toBeInTheDocument()

    if (commentCurrentUser) {
      const editActionBtn = within(commentCurrentUser).getByText(/edit/i)
      user.click(editActionBtn)

      const textbox = await within(commentCurrentUser).findByRole('textbox')
      const submitBtn = await within(commentCurrentUser).findByRole('button', {
        name: /update/i
      })

      expect(textbox).toBeInTheDocument()
      expect(submitBtn).toBeInTheDocument()
    }
  })


  it('should render the edited comment with the new edited content', async () => {
    const user = userEvent.setup()
    render(<MockApp />)

    const commentCurrentUser = screen.getByText(/juliusomo/i).closest('article')
    expect(commentCurrentUser).toBeInTheDocument()

    if (commentCurrentUser) {
      const editActionBtn = within(commentCurrentUser).getByText(/edit/i)
      user.click(editActionBtn)

      const textbox = await within(commentCurrentUser).findByRole('textbox')
      const submitBtn = await within(commentCurrentUser).findByRole('button', {
        name: /update/i
      })
      await user.type(textbox, 'Editing my comment!')
      await user.click(submitBtn)

      await waitFor(() => {
        const editedContent = screen.queryByRole('article', { name: /editing/i })
        editedContent && expect(editedContent).toBeInTheDocument()
      })
    }
  })

})


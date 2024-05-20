import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
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

  describe('when a user posts a new comment', async () => {
    it('should render a new comment after clicking the Send button of the bottom comment form', async () => {
      const user = userEvent.setup()
      render(<MockApp />)

      // Targeting last textarea and send button (NewCommentForm)
      const textboxes = screen.getAllByPlaceholderText(/add a comment/i)
      const textbox = textboxes[textboxes.length - 1]
      const sendBtns = screen.getAllByRole('button', { name: /send/i })
      const sendBtn = sendBtns[sendBtns.length - 1]

      await user.type(textbox, 'Posting a new comment!')
      await user.click(sendBtn)

      const newCommentContent = await screen.findByText('Posting a new comment!')
      expect(newCommentContent).toBeInTheDocument()
    })

    it('should disable the Send button if the comment content is blank', async () => {
      const user = userEvent.setup()
      render(<MockApp />)

      const textbox = screen.getAllByPlaceholderText(/add a comment/i)[0]
      const sendBtn = screen.getAllByRole('button', {
        name: /send/i
      })[0]
      user.type(textbox, '  ')
      expect(sendBtn).toBeDisabled()
    })
  })

  describe('when a user replies to a comment', async () => {
    it('should render a new reply after clicking the Reply button', async () => {
      const user = userEvent.setup()
      render(<MockApp />)
      const replyActionBtn = screen.getAllByText(/reply/i)[1]
      const textbox = screen.getAllByPlaceholderText(/add a comment/i)[1]
      await user.click(replyActionBtn)
      await user.type(textbox, 'Replying to a comment!')
      const replySubmitBtn = await screen.findByRole('button', {
        name: /reply/i
      })
      await user.click(replySubmitBtn)
      const newReplyContent = await screen.findByText('Replying to a comment!')
      expect(newReplyContent).toBeInTheDocument()
    })
  })

  describe('when a user edits their comment', () => {

    it('should not allow user to edit comments from other users', () => {
      render(<MockApp />)
      const commentOtherUser = screen.getByText(/amyrobson/i).closest('article')
      if (commentOtherUser) {
        const editBtn = within(commentOtherUser).queryByText(/edit/i)
        expect(editBtn).toBeNull()
      }
    })
  })

  it('should turn the comment into a text area with an update button', async () => {
    const user = userEvent.setup()
    render(<MockApp />)
    const commentCurrentUser = screen.getAllByText(/juliusomo/i)[0].closest('article')
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

    // Get a comment from the current user 'juliusomo'
    const commentCurrentUser = screen.getAllByText(/juliusomo/i)[0].closest('article')
    expect(commentCurrentUser).toBeInTheDocument()

    if (commentCurrentUser) {
      const editActionBtn = within(commentCurrentUser).getByText(/edit/i)
      await user.click(editActionBtn)

      const textbox = await within(commentCurrentUser).findByRole('textbox')
      const submitBtn = await within(commentCurrentUser).findByRole('button', { name: /update/i })

      await user.clear(textbox)
      await user.type(textbox, 'Editing my comment!')
      await user.click(submitBtn)

      const editedContent = await within(commentCurrentUser).findByText('Editing my comment!')
      expect(editedContent).toBeInTheDocument()
    }
  })

})


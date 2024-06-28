import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent, { UserEvent } from '@testing-library/user-event'
import App from '../../../App'

// Check if the methods are not defined and define them if necessary
beforeAll(() => {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = vi.fn()
  } else {
    vi.spyOn(HTMLDialogElement.prototype, 'showModal').mockImplementation(() => { })
  }

  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = vi.fn()
  } else {
    vi.spyOn(HTMLDialogElement.prototype, 'close').mockImplementation(() => { })
  }
})

// Ensure the mocks are correctly reset before each test
beforeEach(() => {
  vi.clearAllMocks()
})

const MockApp = () => {
  return (
    <App />
  )
}

describe('Comment component', () => {

  let user: UserEvent, commentCurrentUser: HTMLElement | null, commentOtherUser: HTMLElement | null

  beforeEach(() => {
    user = userEvent.setup()
    render(<MockApp />)
    commentCurrentUser = screen.getByText(/juliusomo/i).closest('article')
    expect(commentCurrentUser).toBeInTheDocument()
    commentOtherUser = screen.getByText(/amyrobson/i).closest('article')
    expect(commentOtherUser).toBeInTheDocument()
  })


  describe('when component initially renders', () => {
    it('should show the initial comments and replies correctly', () => {
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
      const commentReplies = screen.queryByText('This is a reply')
      expect(commentReplies).toBeNull()
    })
  })

  describe('when a user posts a new comment', () => {
    it('should render a new comment after clicking the Send button of the bottom comment form', async () => {
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
      const textbox = screen.getByPlaceholderText(/add a comment/i)
      const sendBtn = screen.getByRole('button', {
        name: /send/i
      })
      user.type(textbox, '  ')
      expect(sendBtn).toBeDisabled()
    })
  })

  describe('when a user replies to a comment', () => {
    it('should render a new reply after clicking the Reply button', async () => {
      const replyActionBtn = screen.getAllByText(/reply/i)[1]
      const textbox = screen.getByPlaceholderText(/add a comment/i)
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
    let editActionBtn: HTMLElement | null
    beforeEach(() => {
      if (commentCurrentUser) {
        editActionBtn = within(commentCurrentUser).getByText(/edit/i)
        expect(editActionBtn).toBeInTheDocument()
      }
    })

    const setupEdit = async () => {
      if (commentCurrentUser && editActionBtn) {
        await user.click(editActionBtn)
        const textbox = await within(commentCurrentUser).findByRole('textbox')
        const submitBtn = await within(commentCurrentUser).findByRole('button', { name: /update/i })
        return { textbox, submitBtn }
      }
      return {}
    }

    it('should not allow user to edit comments from other users', () => {
      if (commentOtherUser) {
        editActionBtn = within(commentOtherUser).queryByText(/edit/i)
        expect(editActionBtn).toBeNull()
      }
    })

    describe('Edit comment functionality', () => {
      it('should turn the comment into a text area with an update button', async () => {
        const { textbox, submitBtn } = await setupEdit()
        expect(textbox).toBeInTheDocument()
        expect(submitBtn).toBeInTheDocument()
      })

      it('should render the edited comment with the new edited content', async () => {
        const { textbox, submitBtn } = await setupEdit()
        if (textbox && submitBtn) {
          await user.clear(textbox)
          await user.type(textbox, 'Editing my comment!')
          await user.click(submitBtn)
        }

        if (commentCurrentUser) {
          const editedContent = await within(commentCurrentUser).findByText('Editing my comment!')
          expect(editedContent).toBeInTheDocument()
        }
      })
    })
  })


  describe('when a user deletes a comment', () => {
    let deleteActionBtn: HTMLElement | null
    it('should not allow user to delete comments from other users', () => {
      if (commentOtherUser) deleteActionBtn = within(commentOtherUser).queryByText(/delete/i)
      expect(deleteActionBtn).toBeNull()
    })

    describe('Confirmation modal', () => {
      let modal: HTMLElement | null
      beforeEach(() => {
        modal = screen.queryAllByRole('dialog', { hidden: true })[0]
        expect(modal).toBeInTheDocument()
      })

      it('should open a confirmation modal when the Delete button is clicked', async () => {
        if (commentCurrentUser) deleteActionBtn = within(commentCurrentUser).getByText(/^\bdelete\b$/i)
        if (deleteActionBtn) {
          await user.click(deleteActionBtn)
          expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled()
        }
      })

      it('should close the modal without deleting when the "No, cancel" button is clicked', async () => {
        if (modal) {
          const cancelBtn = within(modal).getByText(/^No, cancel$/i)
          expect(cancelBtn).toBeInTheDocument()
          await user.click(cancelBtn)
          expect(HTMLDialogElement.prototype.close).toHaveBeenCalled()
          expect(commentCurrentUser).toBeInTheDocument()
        }
      })

      it('should delete the comment when the "Yes, delete" button is clicked', async () => {
        if (modal) {
          const confirmDeleteBtn = within(modal).getByText(/^Yes, delete$/i)
          expect(confirmDeleteBtn).toBeInTheDocument()
          await user.click(confirmDeleteBtn)
          expect(commentCurrentUser).not.toBeInTheDocument()
        }
      })
    })
  })
})


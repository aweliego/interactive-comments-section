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

describe('<Comment />', () => {

  let user: UserEvent, commentCurrentUser: HTMLElement | null, commentOtherUser: HTMLElement | null

  beforeEach(() => {
    user = userEvent.setup()
    render(<MockApp />)
    commentCurrentUser = screen.getAllByText(/juliusomo/i)[0].closest('article')
    expect(commentCurrentUser).toBeInTheDocument()
    commentOtherUser = screen.getByText(/amyrobson/i).closest('article')
    expect(commentOtherUser).toBeInTheDocument()
  })


  describe('when component initially renders', () => {
    it('should show the initial comments and replies correctly', () => {
      const commentContent = screen.getByText(/impressive/i)
      const commentReplies = screen.getAllByText(/recommend/i)
      expect(commentContent).toBeInTheDocument()
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
      // Targeting last textarea and send button (<NewCommentForm />)
      const textboxes = screen.getAllByPlaceholderText(/add a comment/i)
      const textbox = textboxes[textboxes.length - 1]
      const sendBtns = screen.getAllByRole('button', { name: /send/i })
      const sendBtn = sendBtns[sendBtns.length - 1]

      await user.type(textbox, 'Posting a new comment!')
      await user.click(sendBtn)

      const newCommentContent = await screen.findByText('Posting a new comment!')
      expect(newCommentContent).toBeInTheDocument()
      const alert = await screen.findByRole('complementary')
      expect(alert).toBeInTheDocument()
      expect(alert?.textContent).toBe('Comment successfully sent!')
    })

    it('should disable the Send button if the comment content is blank', () => {
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
      await user.click(replyActionBtn)
      const textbox = await screen.findAllByPlaceholderText(/add a comment/i)
      await user.type(textbox[0], 'Replying to a comment!')
      const replySubmitBtn = await screen.findByRole('button', {
        name: /reply/i
      })
      await user.click(replySubmitBtn)
      const newReplyContent = await screen.findByText('Replying to a comment!')
      expect(newReplyContent).toBeInTheDocument()
      const alert = await screen.findByRole('complementary')
      expect(alert).toBeInTheDocument()
      expect(alert?.textContent).toBe('Reply successfully sent!')
    })
  })

  describe('when a user updates the score of a comment', () => {
    let score: HTMLElement | null
    let upvoteIconCurrentUser: HTMLElement | null
    let upvoteIconOtherUser: HTMLElement | null
    let downvoteIconCurrentUser: HTMLElement | null
    let downvoteIconOtherUser: HTMLElement | null
    let alert: HTMLElement | null

    beforeEach(() => {
      if (commentCurrentUser && commentOtherUser) {
        upvoteIconCurrentUser = within(commentCurrentUser).getByAltText(/upvote/i)
        expect(upvoteIconCurrentUser).toBeInTheDocument()
        downvoteIconCurrentUser = within(commentCurrentUser).getByAltText(/downvote/i)
        expect(downvoteIconCurrentUser).toBeInTheDocument()

        upvoteIconOtherUser = within(commentOtherUser).getByAltText(/upvote/i)
        expect(upvoteIconCurrentUser).toBeInTheDocument()
        downvoteIconOtherUser = within(commentOtherUser).getByAltText(/downvote/i)
        expect(downvoteIconCurrentUser).toBeInTheDocument()
      }
    })

    it('should not allow user to update the score of their own comment', async () => {
      if (commentCurrentUser && upvoteIconCurrentUser && downvoteIconCurrentUser) {
        score = within(commentCurrentUser).getByText('2')
        expect(score).toBeInTheDocument()

        user.click(upvoteIconCurrentUser)
        expect(score?.textContent).toBe('2')
        alert = await screen.findByRole('complementary')
        expect(alert).toBeInTheDocument()
        expect(alert).toHaveTextContent(/^You cannot upvote your own comment!$/)

        user.click(downvoteIconCurrentUser)
        expect(score?.textContent).toBe('2')
        alert = await screen.findByRole('complementary')
        expect(alert).toBeInTheDocument()
        expect(alert).toHaveTextContent(/^You cannot upvote your own comment!$/)
      }
    })

    it('should increase the score by 1 if the user clicks the + button on another comment and disable the + button after', async () => {
      if (commentOtherUser && upvoteIconOtherUser) {
        score = within(commentOtherUser).getByText('12')
        expect(score).toBeInTheDocument()

        await user.click(upvoteIconOtherUser)
        expect(score?.textContent).toBe('13')
        alert = await screen.findByRole('complementary')
        expect(alert).toBeInTheDocument()
        expect(alert).toHaveTextContent(/^Comment successfully upvoted!$/)
      }
    })

    it('should decrease the score by 1 if the user clicks the - button on another comment and disable the - button after', async () => {
      if (commentOtherUser && downvoteIconOtherUser) {
        score = within(commentOtherUser).getByText('13')
        expect(score).toBeInTheDocument()

        await user.click(downvoteIconOtherUser)
        expect(score?.textContent).toBe('12')
        alert = await screen.findByRole('complementary')
        expect(alert).toBeInTheDocument()
        expect(alert).toHaveTextContent(/^Comment successfully downvoted!$/)
      }
    })
  })

  describe('when a user edits their comment', () => {
    let editActionBtn: HTMLElement | null
    let alert: HTMLElement | null

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
          alert = await screen.findByRole('complementary')
          expect(alert).toBeInTheDocument()
          expect(alert).toHaveTextContent(/^Comment successfully updated!$/)
        }
      })
    })
  })


  describe('when a user deletes a comment', () => {
    let deleteActionBtn: HTMLElement | null
    let alert: HTMLElement | null

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
          alert = await screen.findByRole('complementary')
          expect(alert).toBeInTheDocument()
          expect(alert).toHaveTextContent(/^Comment successfully deleted!$/)
        }
      })
    })
  })

})


import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CommentBuilder from '../Comment'

describe('Comment Component', () => {
  const data =
  {
    currentUser: {
      image: {
        png: "./images/avatars/image-juliusomo.png",
        webp: "./images/avatars/image-juliusomo.webp"
      },
      username: "juliusomo"
    },

    comment: {
      id: 1,
      content: 'This is a comment',
      createdAt: new Date().toString(),
      score: 5,
      user: {
        image: {
          png: 'user.png',
          webp: 'user.webp'
        },
        username: 'John Doe'
      },
      replies: [
        {
          id: 2,
          content: 'This is a reply',
          createdAt: new Date().toString(),
          score: 3,
          replyingTo: 'John Doe',
          user: {
            image: {
              png: 'avatar.png',
              webp: 'avatar.webp'
            },
            username: 'Jane Doe'
          },
        },
      ],
    }
  }

  it('renders comment and replies correctly', () => {
    render(<CommentBuilder comment={data.comment} currentUser={data.currentUser} />)

    const commentContent = screen.getByText('This is a comment')
    const commentUser = screen.getByText('John Doe')
    const commentReplies = screen.getAllByText(/This is a reply/i)
    expect(commentContent).toBeInTheDocument()
    expect(commentUser).toBeInTheDocument()
    commentReplies.forEach(reply => {
      expect(reply).toBeInTheDocument()
    })
  })

  it('does not render replies section when there are no replies', () => {
    const commentWithoutReplies = { ...data.comment, replies: [] }
    render(<CommentBuilder comment={commentWithoutReplies} currentUser={data.currentUser} />)
    const commentReplies = screen.queryByText('This is a reply')
    expect(commentReplies).toBeNull()
  })
})
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Comment from '../Comment'

describe('Comment Component', () => {
  const comment = {
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

  it('renders comment and replies correctly', () => {
    render(<Comment {...comment} />)
    const commentContent = screen.getByText('This is a comment')
    const commentUser = screen.getByText('John Doe')
    const commentReplies = screen.getByText('This is a reply')
    expect(commentContent).toBeInTheDocument()
    expect(commentUser).toBeInTheDocument()
    expect(commentReplies).toBeInTheDocument()
  })

  it('does not render replies section when there are no replies', () => {
    const commentWithoutReplies = { ...comment, replies: [] }
    render(<Comment {...commentWithoutReplies} />)
    const commentReplies = screen.queryByText('This is a reply')
    expect(commentReplies).toBeNull()
  })
})
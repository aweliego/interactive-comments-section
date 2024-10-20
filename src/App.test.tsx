import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

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

describe('<App />', () => {
    let parentContainer: HTMLElement | null,
        articles: Array<HTMLElement>,
        highestScoredPost: HTMLElement | null,
        secondHighestScoredPost: HTMLElement | null

    beforeEach(() => {
        render(<MockApp />)
        parentContainer = screen.getByRole('main')
        articles = parentContainer ? Array.from(parentContainer.querySelectorAll('article')) : []
        highestScoredPost = screen.getByText(/amyrobson/i).closest('article')
        secondHighestScoredPost = screen.getAllByText(/maxblagun/i)[0].closest('article')
        expect(parentContainer).toBeInTheDocument()
        expect(articles.length).toBeGreaterThan(0)
        expect(highestScoredPost).toBeInTheDocument()
        expect(secondHighestScoredPost).toBeInTheDocument()
    })

    it('shows the top level comments ordered from highest to lowest score', () => {
        if (parentContainer && articles && highestScoredPost && secondHighestScoredPost) {
            // Verify the order
            articles.forEach((article, index) => {
                console.log(`Article ${index + 1}:`, article.textContent)
            })

            // Expect amyrobson's post (score 12) to be listed before maxblagun's post (score 5)
            expect(articles.indexOf(secondHighestScoredPost)).toBeGreaterThan(articles.indexOf(highestScoredPost))
        }
    })
})
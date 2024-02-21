import CommentBuilder from './CommentBuilder'

import { CommentInterface } from '../../types'


const Comment: React.FC<CommentInterface> = ({ comment, currentUser }) => {

    return (
        <>
            <CommentBuilder
                comment={comment}
                currentUser={currentUser}
            />
            {comment.replies?.length !== 0 ? (
                <div className='flex'>
                    <div className='w-1 bg-neutral-gray-light md:ml-12'></div>
                    <div className='pl-6 md:pl-12'>
                        {comment.replies?.map((reply) =>
                            (<CommentBuilder key={reply.id} comment={reply} currentUser={currentUser} />))}
                    </div>
                </div>) : null}

        </>
    )
}

export default Comment

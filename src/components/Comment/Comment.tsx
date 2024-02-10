import IconPlus from '../../../public/images/icon-plus.svg'
import IconMinus from '../../../public/images/icon-minus.svg'
import IconReply from '../../../public/images/icon-reply.svg'
import Reply from './Reply'

import { CommentInterface } from '../../types'


const Comment: React.FC<CommentInterface> = ({ content, createdAt, score, user, replies }) => {

    return (
        <>
            <article className="bg-neutral-white rounded grid grid-rows-mobile md:grid-rows-desktop md:grid-cols-desktop w-full p-4 md:p-8 m-2">
                {/* Meta */}
                <div className='flex flex-grow-1 w-full gap-4 items-center row-start-1 row-span-1 col-start-1 col-span-3 md:col-start-2 md:col-span-1'>
                    <img src={user?.image?.png} alt="user-icon" className='w-8' />
                    <p className='text-neutral-blue-dark font-semibold'>{user?.username}</p>
                    <p className='text-neutral-blue-grayish'>{createdAt}</p>
                </div>
                {/* Content */}
                <div className='text-neutral-blue-grayish py-4 row-start-2 row-span-1 col-start-1 col-span-3 md:col-start-2 md:col-span-2 w-full'>
                    <p>{content}</p>
                </div>
                {/* Score */}
                <div className="bg-neutral-gray-extra-light rounded flex flex-row items-center md:py-4 px-3 md:px-0 md:mr-6 md:flex-col h-max row-start-3 row-span-1 md:row-start-1 md:row-span-2 col-start-1 col-span-1">
                    <img src={IconPlus} className='text-neutral-gray-light hover:cursor-pointer w-3' />
                    <p className="text-primary-blue-moderate font-medium px-4 py-2 md:py-4">{score}</p>
                    <img src={IconMinus} className='text-neutral-gray-light hover:cursor-pointer w-3' />
                </div>
                {/* CTA */}
                <div className='text-primary-blue-moderate flex items-center gap-2 mr-4 hover:cursor-pointer row-start-3 row-span-1 md:row-start-1 md:row-span-1 col-start-3 col-span-1'>
                    <img src={IconReply} alt="" className='w-4' />
                    <p className="hover:text-primary-blue-light font-medium">  Reply</p>
                </div>
                {/* <Replies /> */}
            </article>
            {replies?.length !== 0 ? (
                <div className='flex'>
                    <div className='w-1 bg-neutral-gray-light md:ml-12'></div>
                    <div className='pl-6 md:pl-12'>
                        {replies?.map((reply) => (<Reply key={reply.id} {...reply} />))}
                    </div>
                </div>) : null}

        </>
    )
}

export default Comment

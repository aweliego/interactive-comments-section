import { MessageMeta } from '../../types'

type MetaProps = {
    comment: MessageMeta
}

const Meta = ({ comment }: MetaProps) => {
    const { createdAt, user } = comment
    return (
        <div className='flex flex-grow-1 w-full gap-4 items-center row-start-1 row-span-1 col-start-1 col-span-3 md:col-start-2 md:col-span-1'>
            <img src={user?.image?.png} alt="user-icon" className='w-8' />
            <p className='text-neutral-blue-dark font-semibold'>{user?.username}</p>
            <p className='text-neutral-blue-grayish'>{createdAt}</p>
        </div>
    )
}

export default Meta
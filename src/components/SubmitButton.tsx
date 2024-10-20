type ButtonProps = {
    action: string | undefined
    disabled?: boolean
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const SubmitButton = ({ action, disabled, onClick }: ButtonProps) => {

    const updateButtonText = (action: string | undefined): string | undefined => {
        if (action) {
            switch (action) {
                case 'create': return 'SEND'
                case 'reply': return 'REPLY'
                case 'edit': return 'UPDATE'
                case 'undefined': return 'SEND'
            }
        }
        return undefined
    }

    return (
        <button className={`justify-self-end col-start-3 md:col-span-1 md:row-span-1 md:col-start-3 px-8 py-3 rounded   text-white ${disabled ? 'cursor-not-allowed bg-primary-blue-disabled' : 'bg-primary-blue-moderate  hover:bg-primary-blue-light cursor-pointer'} ${action === 'edit' ? 'mt-2 row-start-3 md:row-start-4' : 'row-start-2 md:row-start-1'} `}
            type='submit'
            disabled={disabled}
            onClick={onClick}>
            {updateButtonText(action)}
        </button>
    )
}

export default SubmitButton
import { useEffect } from 'react'

type AlertProps = {
    type: string
    text: string
    showAlert: () => void
}

const Alert = ({
    type,
    text,
    showAlert
}: AlertProps) => {

    useEffect(() => {
        const timeout = setTimeout(() => {
            showAlert()
        }, 3000)
        return () => clearTimeout(timeout)
    }, [])

    return (
        <aside className={`${type === 'success' ? 'bg-primary-green-success' : 'bg-primary-red-soft'} text-white fixed bottom-5 right-5 p-4`}>{text}</aside>
    )
}

export default Alert
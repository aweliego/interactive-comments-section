import { useState, useEffect, useRef } from 'react'

type ModalProps = {
    isOpen: boolean
    children: React.ReactNode
}

const Modal = ({
    isOpen,
    children
}: ModalProps) => {
    const [isModalOpen, setModalOpen] = useState(isOpen)
    const modalRef = useRef<HTMLDialogElement | null>(null)

    useEffect(() => {
        setModalOpen(isOpen)
    }, [isOpen])

    useEffect(() => {
        const modalElement = modalRef.current

        if (modalElement) {
            if (isModalOpen) {
                modalElement.showModal()
            } else {
                modalElement.close()
            }
        }
    }, [isModalOpen])

    return (
        <dialog ref={modalRef}
            className={'p-4 sm:p-6 rounded-lg min-w-20 max-w-xs sm:max-w-sm cursor-default'}>
            {children}
        </dialog>
    )
}

export default Modal
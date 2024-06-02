import { useState, useEffect, useRef } from 'react'

interface ModalProps {
    isOpen: boolean
    children: React.ReactNode
};

const Modal: React.FC<ModalProps> = ({
    isOpen,
    children
}) => {
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
            className={'p-4 sm:p-6 rounded min-w-24 max-w-sm cursor-default'}>
            {children}
        </dialog>
    )
}

export default Modal
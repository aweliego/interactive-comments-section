export const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target as HTMLTextAreaElement
    textarea.style.height = '56px'
    const scrollHeight = textarea.scrollHeight
    textarea.style.height = scrollHeight + 'px'
}
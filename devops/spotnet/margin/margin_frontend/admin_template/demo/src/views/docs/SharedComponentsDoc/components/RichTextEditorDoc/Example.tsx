import RichTextEditor from '@/components/shared/RichTextEditor'

const Example = () => {
    const handleChange = (val: string) => {
        console.log('value', val)
    }

    return <RichTextEditor onChange={handleChange} />
}

export default Example

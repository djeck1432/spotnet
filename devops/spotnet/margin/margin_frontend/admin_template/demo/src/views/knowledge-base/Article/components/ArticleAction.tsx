import { useState, useRef, useCallback } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { HiOutlineCheck, HiOutlineX } from 'react-icons/hi'

const ArticleAction = () => {
    const commentInput = useRef<HTMLInputElement>(null)

    const [helpful, setHelpful] = useState('')

    const onHelpfulClick = useCallback((val: string) => {
        setHelpful(val)
    }, [])

    const onCommentSubmit = () => {
        if (commentInput.current) {
            commentInput.current.value = ''
        }
    }

    return (
        <>
            <Card
                bordered
                className="mt-8"
                bodyClass="flex items-center justify-between"
            >
                <div>
                    <h5>Was this article helpful?</h5>
                    <p>
                        {helpful === 'Y' ? '1' : '0'} out of{' '}
                        {helpful === 'Y' ? '1' : '0'} found this helpful
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        icon={helpful === 'Y' && <HiOutlineCheck />}
                        variant={helpful === 'Y' ? 'solid' : 'default'}
                        onClick={() => onHelpfulClick('Y')}
                    >
                        <span>Yes</span>
                    </Button>
                    <Button
                        icon={helpful === 'N' && <HiOutlineX />}
                        variant={helpful === 'N' ? 'solid' : 'default'}
                        onClick={() => onHelpfulClick('N')}
                    >
                        <span>No</span>
                    </Button>
                </div>
            </Card>
            <div className="mt-12">
                <h3 className="mb-4">Comments</h3>
                <Input
                    ref={commentInput}
                    textArea
                    placeholder="Enter your comment here..."
                />
                <div className="mt-3 flex justify-end">
                    <Button variant="solid" onClick={onCommentSubmit}>
                        Submit
                    </Button>
                </div>
            </div>
        </>
    )
}

export default ArticleAction

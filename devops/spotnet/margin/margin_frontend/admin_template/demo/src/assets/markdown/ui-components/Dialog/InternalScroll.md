```jsx
import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { MouseEvent } from 'react'

const InternalScroll = () => {
    const [dialogIsOpen, setIsOpen] = useState(false)

    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = (e: MouseEvent) => {
        console.log('onDialogClose', e)
        setIsOpen(false)
    }

    const onDialogOk = (e: MouseEvent) => {
        console.log('onDialogOk', e)
        setIsOpen(false)
    }

    return (
        <div>
            <Button variant="solid" onClick={() => openDialog()}>
                Open
            </Button>
            <Dialog
                isOpen={dialogIsOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
                <div className="flex flex-col h-full justify-between">
                    <h5 className="mb-4">Dialog Title</h5>
                    <div className="max-h-96 overflow-y-auto">
                        <p>
                            There are only two kinds of programming languages:
                            those people always bitch about and those nobody
                            uses. (Bjarne Stroustrup) Walking on water and
                            developing software from a specification are easy if
                            both are frozen. (Edward V Berard) Any fool can use
                            a computer. Many do. (Ted Nelson) If debugging is
                            the process of removing bugs, then programming must
                            be the process of putting them in. (Edsger W.
                            Dijkstra)
                        </p>
                        <p>
                            Any fool can use a computer. Many do. (Ted Nelson)
                            If the automobile had followed the same development
                            cycle as the computer, a Rolls-Royce would today
                            cost $100, get a million miles per gallon, and
                            explode once a year, killing everyone inside.
                            (Robert X. Cringely) Every operating system out
                            there is about equal… We all suck. (Microsoft senior
                            vice president Brian Valentine describing the state
                            of the art in OS security, 2003) It is practically
                            impossible to teach good programming style to
                            students that have had prior exposure to BASIC. As
                            potential programmers, they are mentally mutilated
                            beyond hope of regeneration. (E. W. Dijkstra) It has
                            been said that the great scientific disciplines are
                            examples of giants standing on the shoulders of
                            other giants. It has also been said that the
                            software industry is an example of midgets standing
                            on the toes of other midgets. (Alan Cooper)
                        </p>
                        <p>
                            Always code as if the guy who ends up maintaining
                            your code will be a violent psychopath who knows
                            where you live. (Martin Golding) There is no
                            programming language–no matter how structured-that
                            will prevent programmers from making bad programs.
                            (Larry Flon) If builders built buildings the way
                            programmers wrote programs, then the first
                            woodpecker that came along would destroy
                            civilization. (Gerald Weinberg)
                        </p>
                    </div>
                    <div className="text-right mt-6">
                        <Button
                            className="ltr:mr-2 rtl:ml-2"
                            variant="plain"
                            onClick={onDialogClose}
                        >
                            Cancel
                        </Button>
                        <Button variant="solid" onClick={onDialogOk}>
                            Okay
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default InternalScroll
```

import { useEffect, useRef } from 'react'
import classNames from 'classnames'
import Loading from '@/components/shared/Loading'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import Card from '@/components/ui/Card'
import useQuery from '@/utils/hooks/useQuery'
import {
    updateMail,
    updateMailId,
    getMail,
    useAppDispatch,
    useAppSelector,
} from '../store'
import MailDetailActionBar from './MailDetailActionBar'
import MailDetailContent from './MailDetailContent'
import MailEditor, { MailEditorRef } from './MailEditor'
import isEmpty from 'lodash/isEmpty'
import cloneDeep from 'lodash/cloneDeep'

const MailDetail = () => {
    const query = useQuery()

    const dispatch = useAppDispatch()

    const id = query.get('mail')

    const scrollRef = useRef(null)

    const mailEditorRef = useRef<MailEditorRef>(null)

    const mail = useAppSelector((state) => state.crmMail.data.mail)
    const mailLoading = useAppSelector(
        (state) => state.crmMail.data.mailLoading,
    )
    const mailId = useAppSelector((state) => state.crmMail.data.selectedMailId)
    const isReply = useAppSelector((state) => state.crmMail.data.reply)

    const fetchData = () => {
        if (id) {
            dispatch(getMail({ id }))
        }
    }

    const onStarToggle = () => {
        const newMailData = cloneDeep(mail)
        newMailData.starred = !newMailData.starred
        dispatch(updateMail(newMailData))
    }

    const onFlagToggle = () => {
        const newMailData = cloneDeep(mail)
        newMailData.flagged = !newMailData.flagged
        dispatch(updateMail(newMailData))
    }

    const formSubmit = () => {
        mailEditorRef.current?.formikRef?.submitForm()
    }

    const onMailReply = () => {
        const timeout = setTimeout(
            () => mailEditorRef.current?.editorRef?.focus(),
            100,
        )
        return () => {
            clearTimeout(timeout)
        }
    }

    useEffect(() => {
        if (mailId) {
            fetchData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mailId])

    useEffect(() => {
        if (!mailId && id) {
            dispatch(updateMailId(id))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div
            className={classNames(
                id && !isEmpty(mail) && !mailLoading
                    ? 'block xl:flex'
                    : 'hidden xl:flex',
                'flex-col w-full bg-gray-100 dark:bg-gray-900',
            )}
        >
            {id && !isEmpty(mail) ? (
                mailLoading ? (
                    <Loading loading={true} />
                ) : (
                    <>
                        <MailDetailActionBar
                            isReply={isReply}
                            starred={mail.starred}
                            flagged={mail.flagged}
                            mailId={mail.id}
                            onStarToggle={onStarToggle}
                            onFlagToggle={onFlagToggle}
                            onMailSend={formSubmit}
                            onMailReply={onMailReply}
                        />
                        <MailDetailContent ref={scrollRef} mail={mail}>
                            {isReply && (
                                <div className="pb-6">
                                    <Card>
                                        <MailEditor
                                            ref={mailEditorRef}
                                            mode="reply"
                                            mail={mail}
                                        />
                                    </Card>
                                </div>
                            )}
                        </MailDetailContent>
                    </>
                )
            ) : (
                <div className="flex flex-col justify-center items-center h-full">
                    <DoubleSidedImage
                        className="max-w-[200px]"
                        src="/img/others/no-mail-selected.png"
                        darkModeSrc="/img/others/no-mail-selected-dark.png"
                    />
                    <div className="mt-4 text-2xl font-semibold">
                        Select a mail to read
                    </div>
                </div>
            )}
        </div>
    )
}

export default MailDetail

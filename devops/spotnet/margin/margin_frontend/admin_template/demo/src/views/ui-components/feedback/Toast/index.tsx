/* eslint-disable react/no-unescaped-entities */
import Table from '@/components/ui/Table'

import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Notification from './Notification'
import NotificationType from './NotificationType'
import CustomIcon from './CustomIcon'
import Placement from './Placement'
import Closable from './Closable'
import AlertToast from './AlertToast'
import Duration from './Duration'
import CustomClose from './CustomClose'

const mdPath = 'Toast'

const demoHeader = {
    title: 'Toast',
    desc: 'Toast is used to show message on top of an overlay to update that users the status of system.',
}

const demos = [
    {
        mdName: 'Notification',
        mdPath: mdPath,
        title: 'Notification',
        desc: `Notification pop up with toast`,
        component: <Notification />,
    },
    {
        mdName: 'NotificationType',
        mdPath: mdPath,
        title: 'Notification Type',
        desc: `Indicate <code>type</code> of Notification will show corresponded icon & colors, type can be <code>'info'</code>, <code>'warning'</code>, <code>'error'</code>, or <code>'success'</code>.`,
        component: <NotificationType />,
    },
    {
        mdName: 'CustomIcon',
        mdPath: mdPath,
        title: 'Custom icon',
        desc: `Then icon in Notification can be replaced by any element.`,
        component: <CustomIcon />,
    },
    {
        mdName: 'Placement',
        mdPath: mdPath,
        title: 'Placement',
        desc: `Toast placement can be assign around the trigger element in different positions, there are 6 placement options available.`,
        component: <Placement />,
    },
    {
        mdName: 'Closable',
        mdPath: mdPath,
        title: 'Closable',
        desc: `Enable <code>closable</code> prop to show close icon in Notification`,
        component: <Closable />,
    },
    {
        mdName: 'AlertToast',
        mdPath: mdPath,
        title: 'Alert',
        desc: `Toast can also use with <a href="/ui-components/alert" class="text-blue-500">Alert</a>.`,
        component: <AlertToast />,
    },
    {
        mdName: 'Duration',
        mdPath: mdPath,
        title: 'Duration',
        desc: `Setting <code>duration</code> prop on Notification to specify the duration of open, toast will never dismiss if duration value is <code>0</code>.`,
        component: <Duration />,
    },
    {
        mdName: 'CustomClose',
        mdPath: mdPath,
        title: 'CustomClose',
        desc: `<code>toast.push()</code> will return a uid of notification instance, we can pass this uid to <code>toast.remove(uid)</code> method to remove the corresponded notification.`,
        component: <CustomClose />,
    },
]

const demoApi = [
    {
        component: 'Notification',
        api: [
            {
                propName: 'closable',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether to show close icon',
            },
            {
                propName: 'customIcon',
                type: `<code>ReactNode</code> | <code>string</code>`,
                default: `-`,
                desc: 'Custom element beside Notification content',
            },
            {
                propName: 'duration',
                type: `<code>number</code>`,
                default: `<code>3000</code>`,
                desc: 'Time in seconds before Notification dismiss, it will never dismiss if duration value is 0',
            },
            {
                propName: 'onClose',
                type: `<code>(e: MouseEvent) => void</code>`,
                default: `<code>-</code>`,
                desc: 'Callback when Notification is closed',
            },
            {
                propName: 'title',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Title of Notification',
            },
            {
                propName: 'type',
                type: `<code>'info'</code> | <code>'warning'</code> | <code>'success'</code> | <code>'danger'</code>`,
                default: `-`,
                desc: 'Type of Notification',
            },
            {
                propName: 'width',
                type: `<code>number</code> | <code>string</code>`,
                default: `<code>350</code>`,
                desc: 'Width of Notification',
            },
        ],
    },
]

const { Tr, Th, Td, THead, TBody } = Table

const toastApi = (
    <>
        <h4>API</h4>
        <div className="mt-4">
            <h6 className="mb-3">toast</h6>
            <Table className="demo-api-table mb-8">
                <THead>
                    <Tr>
                        <Th>Method</Th>
                        <Th>Description</Th>
                    </Tr>
                </THead>
                <TBody>
                    <Tr>
                        <Td className="font-semibold">
                            <code>
                                toast.push(message: ReactNode, options?:
                                ToastProps): string
                            </code>
                        </Td>
                        <Td>
                            Method to pop a toast message, it will return a UID
                            for the current toast
                        </Td>
                    </Tr>
                    <Tr>
                        <Td className="font-semibold">
                            <code>toast.remove(key: string): void</code>
                        </Td>
                        <Td>
                            Method to remove a specify toast message by using
                            the key from push method
                        </Td>
                    </Tr>
                    <Tr>
                        <Td className="font-semibold">
                            <code>toast.removeAll(): void</code>
                        </Td>
                        <Td>Method to remove all toast message</Td>
                    </Tr>
                </TBody>
            </Table>
        </div>
        <div className="mt-4">
            <h6 className="mb-3">ToastProps</h6>
            <Table className="demo-api-table mb-8">
                <THead>
                    <Tr>
                        <Th>Prop</Th>
                        <Th>Description</Th>
                        <Th>Type</Th>
                        <Th>Default</Th>
                    </Tr>
                </THead>
                <TBody>
                    <Tr>
                        <Td className="font-semibold">block</Td>
                        <Td>Whether to display toast in full width</Td>
                        <Td>
                            <code>boolean</code>
                        </Td>
                        <Td>
                            <code>false</code>
                        </Td>
                    </Tr>
                    <Tr>
                        <Td className="font-semibold">offsetX</Td>
                        <Td>Offset X of toast</Td>
                        <Td>
                            <code>number</code>
                        </Td>
                        <Td>
                            <code>30</code>
                        </Td>
                    </Tr>
                    <Tr>
                        <Td className="font-semibold">offsetY</Td>
                        <Td>Offset Y of toast</Td>
                        <Td>
                            <code>number</code>
                        </Td>
                        <Td>
                            <code>30</code>
                        </Td>
                    </Tr>
                    <Tr>
                        <Td className="font-semibold">placement</Td>
                        <Td>Placement of toast</Td>
                        <Td>
                            <code>'top-start'</code> | <code>'top-center'</code>{' '}
                            | <code>'top-end'</code> |{' '}
                            <code>'bottom-start'</code> |{' '}
                            <code>'bottom-center'</code> |{' '}
                            <code>'bottom-end'</code>
                        </Td>
                        <Td>
                            <code>'top-end'</code>
                        </Td>
                    </Tr>
                    <Tr>
                        <Td className="font-semibold">transitionType</Td>
                        <Td>Transition type of animation</Td>
                        <Td>
                            <code>'scale'</code> | <code>'fade'</code>
                        </Td>
                        <Td>
                            <code>'scale'</code>
                        </Td>
                    </Tr>
                </TBody>
            </Table>
        </div>
    </>
)

const Noification = () => {
    return (
        <DemoLayout
            header={demoHeader}
            demos={demos}
            api={demoApi}
            note={toastApi}
            hideApiTitle={true}
        />
    )
}

export default Noification

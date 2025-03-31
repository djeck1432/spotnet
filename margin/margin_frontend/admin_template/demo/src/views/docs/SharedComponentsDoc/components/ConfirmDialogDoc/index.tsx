import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'ConfirmDialogDoc'

const demoHeader = {
    title: 'ConfirmDialog',
    desc: 'ConfirmDialog is premade dialog that use for confirmation.',
}

const demos = [
    {
        mdName: 'Example',
        mdPath: mdPath,
        title: 'Example',
        desc: `Example usage.`,
        component: <Example />,
    },
]

const demoApi = [
    {
        component: 'ConfirmDialog',
        api: [
            {
                propName: 'cancelText',
                type: `<code>string</code>`,
                default: `<code>'Cancel'</code>`,
                desc: 'Cancel button text',
            },
            {
                propName: 'confirmButtonColor',
                type: `(available colors option based on tailwind <code>theme.colors</code>)`,
                default: 'current theme color',
                desc: 'Custom color for confirm button',
            },
            {
                propName: 'confirmText',
                type: `<code>string</code>`,
                default: `<code>'Confirm'</code>`,
                desc: 'Confirm button text',
            },
            {
                propName: 'onCancel',
                type: `<code>() => void</code>`,
                default: `-`,
                desc: 'Callback function after click on cancel button',
            },
            {
                propName: 'onConfirm',
                type: `<code>() => void</code>`,
                default: `-`,
                desc: 'Callback function after click on confirm button',
            },
            {
                propName: 'title',
                type: `<code>string</code>`,
                default: `<code>'info'</code>`,
                desc: 'Title of confirmation',
            },
            {
                propName: 'type',
                type: `<code>'info'</code> | <code>'success'</code> | <code>'warning'</code> | <code>'danger'</code>`,
                default: `<code>'info'</code>`,
                desc: 'Type of confirmation',
            },
        ],
    },
]

const ConfirmDialogDoc = () => {
    return (
        <DemoLayout
            innerFrame={false}
            header={demoHeader}
            demos={demos}
            api={demoApi}
            mdPrefixPath="shared"
        />
    )
}

export default ConfirmDialogDoc

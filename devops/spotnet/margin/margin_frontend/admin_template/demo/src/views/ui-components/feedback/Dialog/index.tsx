import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import Size from './Size'
import CloseWithEscBackdrop from './CloseWithEscBackdrop'
import InternalScroll from './InternalScroll'
import StaticBackdrop from './StaticBackdrop'
import CustomStyle from './CustomStyle'
import Closable from './Closable'

const mdPath = 'Dialog'

const demoHeader = {
    title: 'Dialog',
    desc: 'Dialog is a box that overlay on the current page which force user interact with.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic usage of Dialog.`,
        component: <Basic />,
    },
    {
        mdName: 'Size',
        mdPath: mdPath,
        title: 'Size',
        desc: `Dialog allow us to input <code>width</code> & <code>height</code> to adjust the size of Dialog.`,
        component: <Size />,
    },
    {
        mdName: 'CloseWithEscBackdrop',
        mdPath: mdPath,
        title: 'Disable Escape & backdrop click',
        desc: `We can disable escape key & backdrop click close by setting <code>shouldCloseOnOverlayClick</code> & <code>shouldCloseOnEsc</code> props. `,
        component: <CloseWithEscBackdrop />,
    },
    {
        mdName: 'InternalScroll',
        mdPath: mdPath,
        title: 'Internal Scroll',
        desc: `Example of Dialog internal scroll.`,
        component: <InternalScroll />,
    },
    {
        mdName: 'StaticBackdrop',
        mdPath: mdPath,
        title: 'Lock Scroll',
        desc: `We can lock window scroll by passing <code>'overflow-hidden</code> to <code>bodyOpenClassName</code>`,
        component: <StaticBackdrop />,
    },
    {
        mdName: 'CustomStyle',
        mdPath: mdPath,
        title: 'Custom dialog style',
        desc: `Example of Dialog custom style`,
        component: <CustomStyle />,
    },
    {
        mdName: 'Closable',
        mdPath: mdPath,
        title: 'Closable',
        desc: `Set <code>closeable</code> to false will hide Dialog close icon.`,
        component: <Closable />,
    },
]

const demoApi = [
    {
        component: 'Dialog',
        api: [
            {
                propName: 'width',
                type: `<code>string</code> | <code>number</code>`,
                default: `<code>520</code>`,
                desc: 'Dialog width',
            },
            {
                propName: 'height',
                type: `<code>string</code> | <code>number</code>`,
                default: `-`,
                desc: 'Dialog height',
            },
            {
                propName: 'isOpen',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether to display dialog',
            },
            {
                propName: 'style',
                type: `<code>object: { content: object, overlay: object }</code>`,
                default: `<-`,
                desc: 'Style for dialog & backdrop',
            },
            {
                propName: 'contentClassName',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Class name that append to Dialog content',
            },
            {
                propName: 'portalClassName',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Class name that append to Dialog portal',
            },
            {
                propName: 'bodyOpenClassName',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Class name that append to body while Dialog is open',
            },
            {
                propName: 'htmlOpenClassName',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Class name that append to html while Dialog is open',
            },
            {
                propName: 'overlayClassName',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Class name for Dialog backdrop',
            },
            {
                propName: 'appElement',
                type: `<code>SafeHTMLElement</code> | <code>SafeHTMLCollection</code> | <code>SafeNodeList</code> | <code>SafeHTMLElement[]</code>`,
                default: `-`,
                desc: 'Setting external node to Dialog content',
            },
            {
                propName: 'onAfterOpen',
                type: `<code>(overlayElement: HTMLElement, contentElement: HTMLElement) => void</code>`,
                default: `-`,
                desc: 'Callback function after Dialog open',
            },
            {
                propName: 'closable',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether show Dialog close icon',
            },
            {
                propName: 'onClose',
                type: `<code>(event: Event) => void</code>`,
                default: `-`,
                desc: 'Callback function after click on Dialog close icon',
            },
            {
                propName: 'onRequestClose',
                type: `<code>(event: Event) => void</code>`,
                default: `-`,
                desc: 'Callback function after Dialog close',
            },
            {
                propName: 'closeTimeoutMS',
                type: `<code>(event: Event) => void</code>`,
                default: `<code>150</code>`,
                desc: 'Timeout speed during Dialog close',
            },
            {
                propName: 'shouldFocusAfterRender',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Boolean indicating if the dialog should be focused after render',
            },
            {
                propName: 'shouldReturnFocusAfterClose',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Boolean indicating if the dialog should restore focus to the element that had focus prior to its display',
            },
            {
                propName: 'preventScroll',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Boolean indicating if the dialog should use the preventScroll flag when restoring focus to the element that had focus prior to its display',
            },
            {
                propName: 'shouldCloseOnOverlayClick',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether to close Dialog when the backdrop is clicked',
            },
            {
                propName: 'shouldCloseOnEsc',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether to close Dialog when esc key pressed',
            },
            {
                propName: 'parentSelector',
                type: `<code>() => document.body</code>`,
                default: `<code>() => document.body</code>`,
                desc: 'Function that will be called to get the parent element that the dialog will be attached to',
            },
            {
                propName: 'overlayRef',
                type: `<code>(node: Node) => void</code>`,
                default: `-`,
                desc: 'Dialog backdrop ref',
            },
            {
                propName: 'contentRef',
                type: `<code>(node: Node) => void</code>`,
                default: `-`,
                desc: 'Dialog content ref',
            },
        ],
    },
]

const Dialog = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default Dialog

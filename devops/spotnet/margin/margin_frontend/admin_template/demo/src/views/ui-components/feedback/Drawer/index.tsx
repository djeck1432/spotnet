import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import Placement from './Placement'
import WidthHeight from './WidthHeight'
import Footer from './Footer'
import CustomStyle from './CustomStyle'
import Closable from './Closable'

const mdPath = 'Drawer'

const demoHeader = {
    title: 'Drawer',
    desc: 'Drawer is a panel that slides out from the edge of the screen which containing supplementary content.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic usage of Drawer`,
        component: <Basic />,
    },
    {
        mdName: 'Placement',
        mdPath: mdPath,
        title: 'Placement',
        desc: `Set the <code>placement</code> prop to <code>'top'</code>, <code>'right'</code>, <code>'bottom'</code>, or <code>'left'</code> to arrange where the Drawer slide out from.`,
        component: <Placement />,
    },
    {
        mdName: 'WidthHeight',
        mdPath: mdPath,
        title: 'Width & Height',
        desc: `We can adjust Drawer via with <code>height</code> & <code>width</code> prop.`,
        component: <WidthHeight />,
    },
    {
        mdName: 'Footer',
        mdPath: mdPath,
        title: 'Footer',
        desc: `We can also have a footer under the Drawer.`,
        component: <Footer />,
    },
    {
        mdName: 'CustomStyle',
        mdPath: mdPath,
        title: 'Custom Style',
        desc: `Drawer allow us to set extra class via <code>headerClass</code>, <code>bodyClass</code> & <code>footerClass</code>`,
        component: <CustomStyle />,
    },
    {
        mdName: 'Closable',
        mdPath: mdPath,
        title: 'Closable',
        desc: `Set <code>closeable</code> to false will hide Drawer close icon.`,
        component: <Closable />,
    },
]

const demoApi = [
    {
        component: 'Drawer',
        api: [
            {
                propName: 'placement',
                type: `<code>'top'</code> | <code>'right'</code> | <code>'bottom'</code> | <code>'left'</code> `,
                default: `<code>'right'</code>`,
                desc: `Drawer placement`,
            },
            {
                propName: 'width',
                type: `<code>string</code> | <code>number</code>`,
                default: `<code>400</code>`,
                desc: `Drawer width, (only available when placement is <code>'left'</code> or <code>'right'</code>`,
            },
            {
                propName: 'height',
                type: `<code>string</code> | <code>number</code>`,
                default: `<code>400</code>`,
                desc: `Drawer height, (only available when placement is <code>'top'</code> or <code>'bottom'</code>`,
            },
            {
                propName: 'title',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `-`,
                desc: `Title of Drawer`,
            },
            {
                propName: 'footer',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `-`,
                desc: `Footer of Drawer`,
            },
            {
                propName: 'headerClass',
                type: `<code>string</code>`,
                default: `-`,
                desc: `Extra class for Drawer header (<code>!</code> modifier recommended for tailwind css overiding)`,
            },
            {
                propName: 'bodyClass',
                type: `<code>string</code>`,
                default: `-`,
                desc: `Extra class for Drawer body (<code>!</code> modifier recommended for tailwind css overiding)`,
            },
            {
                propName: 'footerClass',
                type: `<code>string</code>`,
                default: `-`,
                desc: `Extra class for Drawer footer (<code>!</code> modifier recommended for tailwind css overiding)`,
            },
            {
                propName: 'showBackdrop',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether the display Drawer backdrop',
            },
            {
                propName: 'lockScroll',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether to disable window scrolling when Drawer is open',
            },
            {
                propName: 'isOpen',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether to display Drawer',
            },
            {
                propName: 'style',
                type: `<code>object: { content: object, overlay: object }</code>`,
                default: `-`,
                desc: 'Style for Drawer & backdrop',
            },
            {
                propName: 'portalClassName',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Class name that append to Drawer portal',
            },
            {
                propName: 'bodyOpenClassName',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Class name that append to body while Drawer is open',
            },
            {
                propName: 'htmlOpenClassName',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Class name that append to html while Drawer is open',
            },
            {
                propName: 'overlayClassName',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Class name for Drawer backdrop',
            },
            {
                propName: 'appElement',
                type: `<code>SafeHTMLElement</code> | <code>SafeHTMLCollection</code> | <code>SafeNodeList</code> | <code>SafeHTMLElement[]</code>`,
                default: `-`,
                desc: 'Setting external node to Drawer content',
            },
            {
                propName: 'onAfterOpen',
                type: `<code>(overlayElement: HTMLElement, contentElement: HTMLElement) => void</code>`,
                default: `-`,
                desc: 'Callback function after Drawer open',
            },
            {
                propName: 'closable',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether show Drawer close icon',
            },
            {
                propName: 'onClose',
                type: `<code>(event: Event) => void</code>`,
                default: `-`,
                desc: 'Callback function after click on Drawer close icon',
            },
            {
                propName: 'onRequestClose',
                type: `<code>(event: Event) => void</code>`,
                default: `-`,
                desc: 'Callback function after Drawer close',
            },
            {
                propName: 'closeTimeoutMS',
                type: `<code>(event: Event) => void</code>`,
                default: `<code>300</code>`,
                desc: 'Timeout speed during Drawer close',
            },
            {
                propName: 'shouldFocusAfterRender',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Boolean indicating if the Drawer should be focused after render',
            },
            {
                propName: 'shouldReturnFocusAfterClose',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Boolean indicating if the Drawer should restore focus to the element that had focus prior to its display',
            },
            {
                propName: 'preventScroll',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Boolean indicating if the Drawer should use the preventScroll flag when restoring focus to the element that had focus prior to its display',
            },
            {
                propName: 'shouldCloseOnOverlayClick',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether to close Drawer when the backdrop is clicked',
            },
            {
                propName: 'shouldCloseOnEsc',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether to close Drawer when esc key pressed',
            },
            {
                propName: 'parentSelector',
                type: `<code>() => document.body</code>`,
                default: `<code>() => document.body</code>`,
                desc: 'Function that will be called to get the parent element that the Drawer will be attached to',
            },
            {
                propName: 'overlayRef',
                type: `<code>(node: Node) => void</code>`,
                default: `-`,
                desc: 'Drawer backdrop ref',
            },
            {
                propName: 'contentRef',
                type: `<code>(node: Node) => void</code>`,
                default: `-`,
                desc: 'Drawer content ref',
            },
        ],
    },
]

const Drawer = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default Drawer

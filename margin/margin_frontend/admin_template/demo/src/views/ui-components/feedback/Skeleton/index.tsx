import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Variant from './Variant'
import Size from './Size'
import Animation from './Animation'

const mdPath = 'Skeleton'

const demoHeader = {
    title: 'Skeleton',
    desc: 'Display a placeholder preview of component before the data gets loaded, it can help to the user aware and that the data is processing.',
}

const demos = [
    {
        mdName: 'Variant',
        mdPath: mdPath,
        title: 'Variant',
        desc: `The skeleton has two variations in appearance, combining multiple skeletons to make a component holder.`,
        component: <Variant />,
    },
    {
        mdName: 'Size',
        mdPath: mdPath,
        title: 'Size',
        desc: `Sizes of Skeleton can be customize with <code>width</code> & <code>height</code> props.`,
        component: <Size />,
    },
    {
        mdName: 'Animation',
        mdPath: mdPath,
        title: 'Animation',
        desc: `Animation can be disabled by setting <code>animation</code> to <code>false</code>.`,
        component: <Animation />,
    },
]

const demoApi = [
    {
        component: 'Skeleton',
        api: [
            {
                propName: 'animation',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether to active animation',
            },
            {
                propName: 'asElement',
                type: `<code>string</code>`,
                default: `<code>'span'</code>`,
                desc: 'Render element',
            },
            {
                propName: 'height',
                type: `<code>string</code> | <code>number</code>`,
                default: `-`,
                desc: 'Height of Skeleton',
            },
            {
                propName: 'variant',
                type: `<code>'block'</code>  | <code>'circle'</code>`,
                default: `<code>'block'</code>`,
                desc: 'Appearance of Skeleton',
            },
            {
                propName: 'width',
                type: `<code>string</code> | <code>number</code>`,
                default: `-`,
                desc: 'Width of Skeleton',
            },
        ],
    },
]

const Skeleton = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default Skeleton

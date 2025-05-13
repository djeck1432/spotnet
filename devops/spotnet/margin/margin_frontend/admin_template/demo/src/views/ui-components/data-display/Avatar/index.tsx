import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Shape from './Shape'
import Size from './Size'
import Type from './Type'
import Color from './Color'
import Status from './Status'
import Group from './Group'

const mdPath = 'Avatar'

const demoHeader = {
    title: 'Avatar',
    desc: 'Avatar component is used to represent a user or product brand, it can display text, icons, or images.',
}

const demos = [
    {
        mdName: 'Shape',
        mdPath: mdPath,
        title: 'Shape',
        desc: `Avatar <code>shape</code> can be a <code>circle</code>, <code>rounded</code> or <code>square</code>.`,
        component: <Shape />,
    },
    {
        mdName: 'Size',
        mdPath: mdPath,
        title: 'Size',
        desc: `Avatar component comes in 3 sizes <code>sm</code>, <code>md</code> and <code>lg</code>, it also allow to to set custom size.`,
        component: <Size />,
    },
    {
        mdName: 'Type',
        mdPath: mdPath,
        title: 'Type',
        desc: `Avatar can display in text, icons, or images`,
        component: <Type />,
    },
    {
        mdName: 'Color',
        mdPath: mdPath,
        title: 'Color',
        desc: `Colors can be apply to text & icons avatar via props <code>backgroundColor</code> & <code>textColor</code>`,
        component: <Color />,
    },
    {
        mdName: 'Status',
        mdPath: mdPath,
        title: 'Status',
        desc: `Avatar can also have status badge along with <code>Badge</code> component.`,
        component: <Status />,
    },
    {
        mdName: 'Group',
        mdPath: mdPath,
        title: 'Avatar Group',
        desc: `Chain multiple Avatar in a row`,
        component: <Group />,
    },
]

const demoApi = [
    {
        component: 'Avatar',
        api: [
            {
                propName: 'shape',
                type: `<code>'rounded'</code> | <code>'square'</code> | <code>'circle'</code>`,
                default: `<code>'rounded'</code>`,
                desc: 'Shape of Avatar',
            },
            {
                propName: 'size',
                type: `<code>'lg'</code>  | <code>'md'</code> | <code>'sm'</code> | <code>number</code>`,
                default: `<code>'md'</code>`,
                desc: 'Size of Avatar',
            },
            {
                propName: 'icon',
                type: `<code>ReactNode</code>`,
                default: `-`,
                desc: 'Avatar Icon',
            },
            {
                propName: 'src',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Image url of Avatar image',
            },
            {
                propName: 'srcSet',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'srcset attribute for Avatar image',
            },
            {
                propName: 'alt',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'alt attribute for Avatar image',
            },
        ],
    },
    {
        component: 'Avatar.Group',
        api: [
            {
                propName: 'chained',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether to stack avatars within group',
            },
            {
                propName: 'maxCount',
                type: `<code>number</code>`,
                default: `<code>4</code>`,
                desc: 'Limited avatars to display & append an ommited avatar',
            },
            {
                propName: 'omittedAvatarContent',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: ``,
                desc: 'Custom omitted avatar content',
            },
            {
                propName: 'omittedAvatarProps',
                type: `<code>Object</code> (Refer to Avatar props above)`,
                default: `-`,
                desc: 'Omitted avatar props',
            },
            {
                propName: 'omittedAvatarTooltip',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether to enable tooltip for omitted avatar',
            },
            {
                propName: 'onOmittedAvatarClick',
                type: `<code>() => void</code>`,
                default: `-`,
                desc: 'Callback when omitted avatar clicked',
            },
        ],
    },
]

const Avatar = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default Avatar

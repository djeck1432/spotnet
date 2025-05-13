import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import Icon from './Icon'
import CustomIcon from './CustomIcon'
import Type from './Type'
import Title from './Title'
import Closable from './Closable'

const mdPath = 'Alert'

const demoHeader = {
    title: 'Alert',
    desc: 'Alerts are used to feedback to the user action or system activity.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic usage of alert.`,
        component: <Basic />,
    },
    {
        mdName: 'Icon',
        mdPath: mdPath,
        title: 'Icon',
        desc: `Display icon within alert.`,
        component: <Icon />,
    },
    {
        mdName: 'CustomIcon',
        mdPath: mdPath,
        title: 'CustomIcon',
        desc: `Icon can be replaced by setting own icon to <code>customIcon</code> prop.`,
        component: <CustomIcon />,
    },
    {
        mdName: 'Type',
        mdPath: mdPath,
        title: 'Type',
        desc: `Change the status of the alerts by passing the <code>type</code> prop. Alert supports <code>info</code>, <code>success</code>, <code>warning</code>, and <code>danger</code> types.`,
        component: <Type />,
    },
    {
        mdName: 'Title',
        mdPath: mdPath,
        title: 'Title',
        desc: `Alert also can have a title by input a string to <code>title</code> prop.`,
        component: <Title />,
    },
    {
        mdName: 'Closable',
        mdPath: mdPath,
        title: 'Closable',
        desc: `Turn <code>closable</code> prop to true to display close button which allow user dismiss alert.`,
        component: <Closable />,
    },
]

const demoApi = [
    {
        component: 'Alert',
        api: [
            {
                propName: 'title',
                type: `<code>ReactNode</code> | <code>string</code>`,
                default: `-`,
                desc: 'Alert title',
            },
            {
                propName: 'showIcon',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Display icon based on type',
            },
            {
                propName: 'customIcon',
                type: `<code>ReactNode</code>`,
                default: `-`,
                desc: 'Replace default icon to custom icon',
            },
            {
                propName: 'type',
                type: `<code>'info'</code> | <code>'warning'</code> | <code>'success'</code> | <code>'danger'</code>`,
                default: `<code>'warning'</code>`,
                desc: 'The status of the alert',
            },
            {
                propName: 'closable',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Display close button',
            },
            {
                propName: 'customClose',
                type: `<code>ReactNode | <code>string</code>`,
                default: `-`,
                desc: 'Replace default close',
            },
            {
                propName: 'rounded',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether the Alert have round border radius',
            },
            {
                propName: 'onClose',
                type: `<code>(e: MouseEvent) => void</code>`,
                default: `<code>-</code>`,
                desc: 'Callback when Alert is closed',
            },
            {
                propName: 'triggerByToast',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'identifier for toast trigger (for toast purpose)',
            },
            {
                propName: 'duration',
                type: `<code>2000</code>`,
                default: `<code>number</code>`,
                desc: 'Interval of dismiss (for toast purpose)',
            },
        ],
    },
]

const Alert = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default Alert

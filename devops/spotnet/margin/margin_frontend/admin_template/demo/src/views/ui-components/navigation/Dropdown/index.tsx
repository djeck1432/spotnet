import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Default from './Default'
import CustomToggle from './CustomToggle'
import Trigger from './Trigger'
import Submenu from './Submenu'
import Placement from './Placement'
import DefaultActive from './DefaultActive'
import Disabled from './Disabled'
import DropdownItemVariant from './DropdownItemVariant'
import WithRouterLink from './WithRouterLink'

const mdPath = 'Dropdown'

const demoHeader = {
    title: 'Dropdown',
    desc: 'Dropdown allow users select a single item from a list of options.',
}

const demos = [
    {
        mdName: 'Default',
        mdPath: mdPath,
        title: 'Default',
        desc: `Default usage of Dropdown`,
        component: <Default />,
    },
    {
        mdName: 'CustomToggle',
        mdPath: mdPath,
        title: 'Custom Toggle',
        desc: `We can set custom toggler for Dropdown via <code>renderTitle</code> prop.`,
        component: <CustomToggle />,
    },
    {
        mdName: 'Trigger',
        mdPath: mdPath,
        title: 'Trigger',
        desc: `Dropdown allow us to set<code>trigger</code> mode to <code>click</code>, <code>hover</code> or <code>context</code>.`,
        component: <Trigger />,
    },
    {
        mdName: 'Submenu',
        mdPath: mdPath,
        title: 'Submenu',
        desc: `Dropdown can also have multiple levels.`,
        component: <Submenu />,
    },
    {
        mdName: 'Placement',
        mdPath: mdPath,
        title: 'Placement',
        desc: `Dropdown menu placement can be assign around the trigger element in different positions via <code>placement</code> prop.`,
        component: <Placement />,
    },
    {
        mdName: 'DefaultActive',
        mdPath: mdPath,
        title: 'Default Active',
        desc: `Set Dropdown.Item eventKey value to <code>activeKey</code> prop to highlight the Dropdown.Item active status.`,
        component: <DefaultActive />,
    },
    {
        mdName: 'Disabled',
        mdPath: mdPath,
        title: 'Disabled',
        desc: `<code>disabled</code> prop can be use in both Dropdown or Dropdown.Item to disable user action.`,
        component: <Disabled />,
    },
    {
        mdName: 'DropdownItemVariant',
        mdPath: mdPath,
        title: 'Dropdown Item Type',
        desc: `Dropdown.Item has several variant type can br apply, Pass the variant prop and use either <code>'default'</code>, <code>'header'</code>, <code>'divider'</code>, <code>'default'</code> `,
        component: <DropdownItemVariant />,
    },
    {
        mdName: 'WithRouterLink',
        mdPath: mdPath,
        title: 'With RouterLink',
        desc: `Usage with RouterLink.`,
        component: <WithRouterLink />,
    },
]

const demoApi = [
    {
        component: 'Dropdown',
        api: [
            {
                propName: 'title',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Dropdown title',
            },
            {
                propName: 'renderTitle',
                type: `<code>ReactNode</code>`,
                default: `-`,
                desc: 'Custom Dropdown title',
            },
            {
                propName: 'trigger',
                type: `<code>'click'</code> | <code>'hover'</code> | <code>'context'</code> `,
                default: `<code>'click'</code>`,
                desc: 'Trigger mode of Dropdown',
            },
            {
                propName: 'placement',
                type: `<code>'top-start'</code> | <code>'top-center'</code> | <code>'top-end'</code> | <code>'bottom-start'</code> | <code>'bottom-center'</code> | <code>'bottom-end'</code> | <code>'middle-start-top'</code>| <code>'middle-start-bottom'</code> | <code>'middle-end-top'</code>| <code>'middle-end-bottom'</code>`,
                default: `<code>'bottom-start'</code>`,
                desc: 'Placement where the Dropdown menu expand',
            },
            {
                propName: 'menuClass',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Additional class for dropdown menu (<code>!</code> modifier recommended for tailwind css overiding)',
            },
            {
                propName: 'menuStyle',
                type: `<code>object</code>`,
                default: `-`,
                desc: 'Additional styles for dropdown menu',
            },
            {
                propName: 'toggleClassName',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Additional class dropdown toggle (<code>!</code> modifier recommended for tailwind css overiding)',
            },
            {
                propName: 'disabled',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether to disable Dropdown expand',
            },
            {
                propName: 'activeKey',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Mark corresponded <code>Dropdown.Item</code>to active by matching it <code>eventkey</code> prop',
            },
            {
                propName: 'onClick',
                type: `<code>(e: MouseEvent) => void</code>`,
                default: `<code>-</code>`,
                desc: 'Callback when Dropdown toggle is clicked',
            },
            {
                propName: 'onMouseEnter',
                type: `<code>(e: MouseEvent) => void</code>`,
                default: `<code>-</code>`,
                desc: 'Callback when Dropdown toggle is on mouse enter',
            },
            {
                propName: 'onMouseLeave',
                type: `<code>(e: MouseEvent) => void</code>`,
                default: `<code>-</code>`,
                desc: 'Callback when Dropdown toggle is on mouse leave',
            },
            {
                propName: 'onContextMenu',
                type: `<code>(e: MouseEvent) => void</code>`,
                default: `<code>-</code>`,
                desc: 'Callback when Dropdown toggle is right clicked',
            },
            {
                propName: 'onSelect',
                type: `<code>(e: MouseEvent) => void</code>`,
                default: `<code>-</code>`,
                desc: 'Callback when Dropdown item is clicked',
            },
            {
                propName: 'onOpen',
                type: `<code>() => void</code>`,
                default: `<code>-</code>`,
                desc: 'Callback when Dropdown is open',
            },
            {
                propName: 'onClose',
                type: `<code>() => void</code>`,
                default: `<code>-</code>`,
                desc: 'Callback when Dropdown is close',
            },
            {
                propName: 'onToggle',
                type: `<code>(open: boolean) => void</code>`,
                default: `<code>-</code>`,
                desc: 'Callback when Dropdown is open or close',
            },
        ],
    },
    {
        component: 'Dropdown.Item',
        api: [
            {
                propName: 'active',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether active current Dropdown Item',
            },
            {
                propName: 'disabled',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether disabled current Dropdown Item',
            },
            {
                propName: 'variant',
                type: `<code>'default'</code> | <code>'header'</code> | <code>'divider'</code> | <code>'custom'</code>`,
                default: `-`,
                desc: 'Define the type of Dropdown Item ',
            },
            {
                propName: 'eventKey',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'The value of Dropdown Item',
            },
            {
                propName: 'onClick',
                type: `<code>() => void</code>`,
                default: `<code>-</code>`,
                desc: 'Callback when Dropdown Item is clicked',
            },
            {
                propName: 'onSelect',
                type: `<code>(eventKey: string, e: MouseEvent) => void</code>`,
                default: `<code>-</code>`,
                desc: 'Callback when Dropdown Item is clicked',
            },
        ],
    },
    {
        component: 'Dropdown.Menu',
        api: [
            {
                propName: 'title',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `-`,
                desc: 'Title for submenu',
            },
            {
                propName: 'eventKey',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'The value of Dropdown submenu',
            },
        ],
    },
]

const Dropdown = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default Dropdown

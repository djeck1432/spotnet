import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Simple from './Simple'
import CollapsableMenuItem from './CollapsableMenuItem'
import MenuGroup from './MenuGroup'
import MenuWithIcon from './MenuWithIcon'
import DisabledMenuItem from './DisabledMenuItem'
import Variants from './Variants'
import DefaultActive from './DefaultActive'
import DefaultExpand from './DefaultExpand'

const mdPath = 'Menu'

const demoHeader = {
    title: 'Menu',
    desc: 'Menus allow users to select a single item from a group of available options.',
}

const demos = [
    {
        mdName: 'Simple',
        mdPath: mdPath,
        title: 'Simple',
        desc: `A simple example of menu.`,
        component: <Simple />,
    },
    {
        mdName: 'CollapsableMenuItem',
        mdPath: mdPath,
        title: 'Collapsable menu item',
        desc: `Menus can contain nested levels as collapsable menu items.`,
        component: <CollapsableMenuItem />,
    },
    {
        mdName: 'MenuGroup',
        mdPath: mdPath,
        title: 'Menu group',
        desc: `Menus can also categorization menu items into different groups.`,
        component: <MenuGroup />,
    },
    {
        mdName: 'MenuWithIcon',
        mdPath: mdPath,
        title: 'With icon',
        desc: `Example with icons in menu items.`,
        component: <MenuWithIcon />,
    },
    {
        mdName: 'DisabledMenuItem',
        mdPath: mdPath,
        title: 'Disabled menu item',
        desc: `Menu items can be disabled to prevent a user from interacting with them.`,
        component: <DisabledMenuItem />,
    },
    {
        mdName: 'Variants',
        mdPath: mdPath,
        title: 'Variants',
        desc: `There's several scheme option for menu.`,
        component: <Variants />,
    },
    {
        mdName: 'DefaultActive',
        mdPath: mdPath,
        title: 'Default active',
        desc: `We can set the menu items within to active by entering corresponded <code>eventKey</code> to <code>defaultActiveKeys</code>`,
        component: <DefaultActive />,
    },
    {
        mdName: 'DefaultExpand',
        mdPath: mdPath,
        title: 'Default expand',
        desc: `We can expand the collapsable menu items within by entering corresponded <code>eventKey</code> to <code>defaultExpandedKeys</code>`,
        component: <DefaultExpand />,
    },
]

const demoApi = [
    {
        component: 'Menu',
        api: [
            {
                propName: 'defaultActiveKeys',
                type: `<code>string[]</code>`,
                default: `<code>[]</code>`,
                desc: 'Initial set menu item as active based on inserted keys which corresponding to <code>eventkey</code>',
            },
            {
                propName: 'defaultExpandedKeys',
                type: `<code>string[]</code>`,
                default: `<code>[]</code>`,
                desc: 'Initial expand collapsable menu item based on inserted keys which corresponding to <code>eventkey</code>',
            },
            {
                propName: 'menuItemHeight',
                type: `<code>string</code> | <code>number</code>`,
                default: `<code>40</code>`,
                desc: 'Height of all menu item',
            },
            {
                propName: 'onSelect',
                type: `<code>(e: MouseEvent, eventKey: string) => void</code>`,
                default: `-`,
                desc: 'Callback when menu item clicked',
            },
            {
                propName: 'sideCollapsed',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether to side collapse the menu',
            },
            {
                propName: 'variant',
                type: `<code>'light'</code> | <code>'dark'</code> | <code>'themed'</code> | <code>'transparent'</code>`,
                default: `<code>'light'</code>`,
                desc: 'The variants of the menu.',
            },
        ],
    },
    {
        component: 'Menu.MenuCollapse',
        api: [
            {
                propName: 'eventKey',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'An unique value for the collapsable menu item',
            },
            {
                propName: 'expanded',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether to expand current collpased menu item',
            },
            {
                propName: 'label',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `-`,
                desc: 'Content of the collpased menu item',
            },
            {
                propName: 'onToggle',
                type: `<code>(expanded: boolean, e: MouseEvent) => void</code>`,
                default: `-`,
                desc: 'Callback when collpased menu item toggled',
            },
        ],
    },
    {
        component: 'Menu.MenuGroup',
        api: [
            {
                propName: 'label',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `-`,
                desc: 'Content of the collpased menu group title',
            },
        ],
    },
    {
        component: 'Menu.MenuItem',
        api: [
            {
                propName: 'asElement',
                type: `<code>string</code>`,
                default: `<code>'div'</code>`,
                desc: 'Render element',
            },
            {
                propName: 'disabled',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether to disable menu item',
            },
            {
                propName: 'eventKey',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'An unique value for the menu item',
            },
            {
                propName: 'isActive',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether to active menu item',
            },
            {
                propName: 'menuItemHeight',
                type: `<code>string</code> | <code>number</code>`,
                default: `<code>40</code>`,
                desc: 'Height of menu item',
            },
            {
                propName: 'onSelect',
                type: `<code>(eventKey: string, e: MouseEvent) => void</code>`,
                default: `<code>40</code>`,
                desc: 'Callback menu item clicked',
            },
        ],
    },
]

const Menu = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default Menu

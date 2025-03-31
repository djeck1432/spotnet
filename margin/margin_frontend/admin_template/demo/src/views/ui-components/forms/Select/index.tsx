import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import Size from './Size'
import Disabled from './Disabled'
import DisabledSearch from './DisabledSearch'
import MultiSelection from './MultiSelection'
import Group from './Group'
import Custom from './Custom'
import AsyncOnSearch from './AsyncOnSearch'
import LoadOptionOnExpand from './LoadOptionOnExpand'
import Creatable from './Creatable'

const mdPath = 'Select'

const demoHeader = {
    title: 'Select',
    desc: 'Select allows a user to pick single or multiple options from a list. This component is a wrapper of <a class="underline text-blue-500" href="https://react-select.com/home" target="_blank">react-select</a>.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic Usage.`,
        component: <Basic />,
    },
    {
        mdName: 'Size',
        mdPath: mdPath,
        title: 'Size',
        desc: `There's three sizes of option for Select.`,
        component: <Size />,
    },
    {
        mdName: 'MultiSelection',
        mdPath: mdPath,
        title: 'Multi Selection',
        desc: `By setting <code>isMulti</code> to true, we can select multiple options from the list.`,
        component: <MultiSelection />,
    },
    {
        mdName: 'Disabled',
        mdPath: mdPath,
        title: 'Disabled',
        desc: `Example of disabled.`,
        component: <Disabled />,
    },
    {
        mdName: 'DisabledSearch',
        mdPath: mdPath,
        title: 'Disabled Search',
        desc: `Select is searchable by default, but we can also turn it off by setting <code>isSearchable</code> to false.`,
        component: <DisabledSearch />,
    },
    {
        mdName: 'Group',
        mdPath: mdPath,
        title: 'Group',
        desc: `Options can be grouped with nested data.`,
        component: <Group />,
    },
    {
        mdName: 'Custom',
        mdPath: mdPath,
        title: 'Custom',
        desc: `React-select allow us to make customization the building block of the component, refer <a class="underline text-blue-500" href="https://react-select.com/components" target="_blank">here</a> for more detail infomation`,
        component: <Custom />,
    },
    {
        mdName: 'AsyncOnSearch',
        mdPath: mdPath,
        title: 'Async on Search',
        desc: `Use the Async component to load options from a remote source as the user types.`,
        component: <AsyncOnSearch />,
    },
    {
        mdName: 'LoadOptionOnExpand',
        mdPath: mdPath,
        title: 'Load Options on Expand',
        desc: `We can also load options upon clicking the Select.`,
        component: <LoadOptionOnExpand />,
    },
    {
        mdName: 'Creatable',
        mdPath: mdPath,
        title: 'Creatable',
        desc: `Example of creating new option via Select input.`,
        component: <Creatable />,
    },
]

const demoApi = [
    {
        component: 'Select',
        api: [
            {
                propName: 'componentAs',
                type: `<code>ReactNode</code>`,
                default: `<code>ReactSelect</code>`,
                desc: 'Receive extensive component from react-select, such as <code>Async</code> & <code>Creatable</code>',
            },
            {
                propName: 'size',
                type: `<code>'lg'</code>  | <code>'md'</code> | <code>'sm'</code>`,
                default: `<code>'md'</code>`,
                desc: 'Select size',
            },
        ],
    },
]

const reactSelectApi = (
    <div className="demo-api-table mb-12">
        <h4 className="mb-5">Dependencies</h4>
        <h6 id="react-select-api" className="mb-3">
            React Select
        </h6>
        <p className="mb-1">
            <code>Select</code> is a wrapper component of{' '}
            <a
                className="underline text-blue-500"
                href="https://react-select.com/home"
                target="_blank"
                rel="noreferrer"
            >
                react-select
            </a>
            .
        </p>
        <p>
            All react-select props can be applied on this component, refer{' '}
            <a
                className="underline text-blue-500"
                href="https://react-select.com/props"
                target="_blank"
                rel="noreferrer"
            >
                official docs
            </a>{' '}
            for the complete api list.{' '}
        </p>
    </div>
)

const Select = () => {
    return (
        <DemoLayout
            header={demoHeader}
            demos={demos}
            api={demoApi}
            extra={reactSelectApi}
        />
    )
}

export default Select

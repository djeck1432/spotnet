import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Addons from './Addons'
import WithButtons from './WithButtons'
import Sizes from './Sizes'
import OtherCombination from './OtherCombination'

const mdPath = 'InputGroup'

const demoHeader = {
    title: 'InputGroup',
    desc: 'Input groups allowed us to chain serveral input related components into a single row.',
}

const demos = [
    {
        mdName: 'Addons',
        mdPath: mdPath,
        title: 'Addons',
        desc: ` Addon can be placed on either side of an input. It also can place in between of both Input.`,
        component: <Addons />,
    },
    {
        mdName: 'WithButtons',
        mdPath: mdPath,
        title: 'With Buttons',
        desc: `Button can also chain with Input.`,
        component: <WithButtons />,
    },
    {
        mdName: 'Sizes',
        mdPath: mdPath,
        title: 'Sizes',
        desc: `Add available sizes value to <code>InputGroup</code> <code>size</code> prop will automatically resize the content.`,
        component: <Sizes />,
    },
    {
        mdName: 'OtherCombination',
        mdPath: mdPath,
        title: 'Other Combination',
        desc: `Example of different <code>InputGroup</code> combination.`,
        component: <OtherCombination />,
    },
]

const demoApi = [
    {
        component: 'InputGroup',
        api: [
            {
                propName: 'size',
                type: `<code>'lg'</code>  | <code>'md'</code> | <code>'sm'</code>`,
                default: `-`,
                desc: 'InputGroup size',
            },
        ],
    },
    {
        component: 'InputGroup.Addon',
        api: [
            {
                propName: 'size',
                type: `<code>'lg'</code>  | <code>'md'</code> | <code>'sm'</code>`,
                default: `-`,
                desc: 'Addon size',
            },
        ],
    },
]

const InputGroup = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default InputGroup

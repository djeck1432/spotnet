import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Example from './Example'

const mdPath = 'DoubleSidedImageDoc'

const demoHeader = {
    title: 'DoubleSidedImage',
    desc: 'DoubleSidedImage is image embed component which able to switch the image source based on current theme mode.',
}

const demos = [
    {
        mdName: 'Example',
        mdPath: mdPath,
        title: 'Example',
        desc: `DoubleSidedImage accpet all <code>img</code> tag attribute as props`,
        component: <Example />,
    },
]

const demoApi = [
    {
        component: 'DoubleSidedImage',
        api: [
            {
                propName: 'darkModeSrc',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Image source to display in dark mode ',
            },
        ],
    },
]

const DoubleSidedImageDoc = () => {
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

export default DoubleSidedImageDoc

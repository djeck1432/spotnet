import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Simple from './Simple'
import WithForm from './WithForm'

const mdPath = 'FormCustomFormatInputDoc'

const demoHeader = {
    title: 'FormCustomFormatInput',
    desc: 'FormCustomFormatInput wrapped Input component with <a class="text-indigo-600 underline" href="https://github.com/s-yadav/react-number-format" target="_blank">react-number-format</a>.',
}

const demos = [
    {
        mdName: 'Simple',
        mdPath: mdPath,
        title: 'Simple',
        desc: `Basic usage of FormCustomFormatInput, all <a class="text-indigo-600 underline" href="https://s-yadav.github.io/react-number-format/docs/customization" target="_blank">react-number-format props</a> can be apply to this component as well.`,
        component: <Simple />,
    },
    {
        mdName: 'WithForm',
        mdPath: mdPath,
        title: 'WithForm',
        desc: `Example usage with <a class="text-indigo-600 underline" href="https://formik.org/" target="_blank">Formik</a>`,
        component: <WithForm />,
    },
]

const demoApi = [
    {
        component: 'FormCustomFormatInput',
        api: [
            {
                propName: 'field',
                type: `<code>{string: any, value: any, onBlur:() => void, onChange:() => void}</code>`,
                default: `-`,
                desc: 'Formik field props',
            },
            {
                propName: 'form',
                type: `<a class="text-indigo-600 underline" href="https://formik.org/docs/api/formik#props-1" target="_blank"><code>FormikProp</code></a>`,
                default: `-`,
                desc: 'Formik field props',
            },
            {
                propName: 'inputPrefix',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `-`,
                desc: 'Render a prefix content inside Input',
            },
            {
                propName: 'inputSuffix',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `-`,
                desc: 'Render a suffix content inside Input',
            },
            {
                propName: 'format',
                type: `<code>(value: string) => string</code>`,
                default: `-`,
                desc: 'A format function which can turn any numeric string to a formatted string.',
            },
            {
                propName: 'removeFormatting',
                type: `<code>(value: string) => string</code>`,
                default: `-`,
                desc: 'A function to removing formatting from a formatted string and return numeric string.',
            },
            {
                propName: 'getCaretBoundary',
                type: `<code>(formattedValue: string) => boolean[]</code>`,
                default: `-`,
                desc: 'A function given a formatted string, returns boundaries of valid cursor position. basically an array of boolean, where index of specify caret position. true at a index signifies user can put their caret at the position, false means the caret position is not allowed and the caret will move to closet allowed position.',
            },
            {
                propName: 'isValidInputCharacter',
                type: `<code>(character: string) => boolean</code>`,
                default: `-`,
                desc: `A function to tell if a character in the formatted value is a valid typeable character. You don't need to pass it most of the time, as it defaults numeric characters (0-9). But case like additional character is allowed to type, for example decimal separator in currency format.`,
            },
        ],
    },
]

const reactNumberFormatApi = (
    <div className="demo-api-table mb-12">
        <h4 className="mb-5">Dependencies</h4>
        <h6 id="react-number-format-api" className="mb-3">
            React number format
        </h6>
        <p>
            All common React number format props can be applied on this
            component, refer{' '}
            <a
                className="underline text-indigo-600"
                href="https://s-yadav.github.io/react-number-format/docs/props"
                target="_blank"
                rel="noreferrer"
            >
                official docs
            </a>{' '}
            for the complete this.props.first list.{' '}
        </p>
    </div>
)

const FormCustomFormatInputDoc = () => {
    return (
        <DemoLayout
            innerFrame={false}
            header={demoHeader}
            demos={demos}
            api={demoApi}
            mdPrefixPath="shared"
            extra={reactNumberFormatApi}
        />
    )
}

export default FormCustomFormatInputDoc

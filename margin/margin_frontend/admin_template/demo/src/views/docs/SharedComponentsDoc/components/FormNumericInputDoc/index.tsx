import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import WithForm from './WithForm'

const mdPath = 'FormCustomFormatInputDoc'

const demoHeader = {
    title: 'FormNumericInput',
    desc: 'FormCustomFormatInput wrapped Input component with <a class="text-indigo-600 underline" href="https://github.com/s-yadav/react-number-format" target="_blank">react-number-format</a>, refer to the <a class="text-indigo-600 underline" href="https://s-yadav.github.io/react-number-format/docs/numeric_format" target="_blank">official doc</a> for more usage example .',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic usage of FormNumericInput, all <a class="text-indigo-600 underline" href="https://s-yadav.github.io/react-number-format/docs/customization" target="_blank">react-number-format props</a> can be apply to this component as well.`,
        component: <Basic />,
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
        component: 'FormNumericInput',
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
                propName: 'thousandSeparator',
                type: `<code>boolean</code> | <code>string</code>`,
                default: `-`,
                desc: 'Whether to enable thousandSeparator, also allow custom character',
            },
            {
                propName: 'decimalSeparator',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Decimal separator symbol',
            },
            {
                propName: 'allowedDecimalSeparators',
                type: `<code>Array<string></code>`,
                default: `-`,
                desc: `Characters which when pressed result in a decimal separator. When missing, decimal separator and '.' are used`,
            },
            {
                propName: 'thousandsGroupStyle',
                type: `<code>'thousand'</code> | <code>'lakh'</code> | <code>'wan'</code> | <code>'none'</code>`,
                default: `-`,
                desc: `Defines the thousand grouping style`,
            },
            {
                propName: 'decimalScale',
                type: `<code>number</code>`,
                default: `-`,
                desc: `If defined, it limits the number of digits after the decimal point`,
            },
            {
                propName: 'fixedDecimalScale',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: `If set to true, it adds trailing 0s after decimalSeparator to match given decimalScale`,
            },
            {
                propName: 'allowLeadingZeros',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'This allows enabling or disabling leading zeros in the input field. By default, on blur of an input, leading zeros are removed. To allow leading 0s in the input field, set allowLeadingZeros to true. This does not, however, control trailing zeros',
            },
            {
                propName: 'allowNegative',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'If set to false, negative numbers will not be allowed',
            },
            {
                propName: 'suffix',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Adds the suffix after the input value',
            },
            {
                propName: 'prefix',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Adds the prefix character before the input value',
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

const FormNumericInputDoc = () => {
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

export default FormNumericInputDoc

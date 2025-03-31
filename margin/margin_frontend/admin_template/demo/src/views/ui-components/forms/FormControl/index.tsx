import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import Layout from './Layout'
import Sizes from './Sizes'
import LabelExtra from './LabelExtra'
import FieldValidation from './FieldValidation'
import SchemaValidation from './SchemaValidation'
import DependentValidation from './DependentValidation'
import AsyncValidation from './AsyncValidation'
import DynamicForm from './DynamicForm'
import MixedFormControl from './MixedFormControl'

const mdPath = 'FormControl'

const demoHeader = {
    title: 'Form Control',
    desc: 'Form is used to collect & verify user input data. We use <a class="underline text-blue-500" href="https://formik.org/" target="_blank">Formik</a> as our form control library, most of our form components were compatible with Formik binding.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Sample usage of a simple form with validation.`,
        component: <Basic />,
    },
    {
        mdName: 'Layout',
        mdPath: mdPath,
        title: 'Form Layout',
        desc: `<code>FormContainer</code> allow us to control all the <code>FormItem</code> <code>layout</code> via a single props.`,
        component: <Layout />,
    },
    {
        mdName: 'Sizes',
        mdPath: mdPath,
        title: 'Form Size',
        desc: `<code>FormContainer</code> allow us to control <code>FormItem</code> <code>size</code> as well.`,
        component: <Sizes />,
    },
    {
        mdName: 'LabelExtra',
        mdPath: mdPath,
        title: 'Label Extra',
        desc: `We can add additional content to the form label with <code>FormItem</code> <code>extra</code> props.`,
        component: <LabelExtra />,
    },
    {
        mdName: 'FieldValidation',
        mdPath: mdPath,
        title: 'Field-level Validation',
        desc: `Formik supports field-level validation via the date prop of <code>Field</code> or <code>FastField</code> components or useField hook. `,
        component: <FieldValidation />,
    },
    {
        mdName: 'SchemaValidation',
        mdPath: mdPath,
        title: 'Schema Validation',
        desc: `We can use <a class="underline target="_blank" href="https://github.com/jquense/yup">Yup</a> for object schema validation.`,
        component: <SchemaValidation />,
    },
    {
        mdName: 'DependentValidation',
        mdPath: mdPath,
        title: 'Dependent Validation',
        desc: `You can use <a class="underline target="_blank" href="https://github.com/jquense/yup#schemawhenkeys-string--string-builder-object--values-any-schema--schema-schema">Yup</a> condition to perform field validation based on other form values. `,
        component: <DependentValidation />,
    },
    {
        mdName: 'AsyncValidation',
        mdPath: mdPath,
        title: 'Async Validation',
        desc: `You can also asynchronous validating a fields.`,
        component: <AsyncValidation />,
    },
    {
        mdName: 'DynamicForm',
        mdPath: mdPath,
        title: 'Dynamic Form',
        desc: `Example usage of dynamic form with <code>FieldArray</code>.`,
        component: <DynamicForm />,
    },
    {
        mdName: 'MixedFormControl',
        mdPath: mdPath,
        title: 'Mixed Form Control',
        desc: `Demostrate different kind of form related component witin a form.`,
        component: <MixedFormControl />,
    },
]

const demoApi = [
    {
        component: 'FormContainer',
        api: [
            {
                propName: 'layout',
                type: `<code>'horizontal'</code> | <code>'vertical'</code> | <code>'inline'</code>`,
                default: `<code>'vertical'</code>`,
                desc: 'Form layout',
            },
            {
                propName: 'size',
                type: `<code>'lg'</code>  | <code>'md'</code> | <code>'sm'</code>`,
                default: `<code>'md'</code>`,
                desc: 'Form item size',
            },
            {
                propName: 'labelWidth',
                type: `<code>stirng</code>  | <code>number</code> `,
                default: `<code>100</code>`,
                desc: 'Form label width',
            },
        ],
    },
    {
        component: 'FormItem',
        api: [
            {
                propName: 'layout',
                type: `<code>'horizontal'</code> | <code>'vertical'</code> | <code>'inline'</code>`,
                default: `-`,
                desc: 'Form layout',
            },
            {
                propName: 'size',
                type: `<code>'lg'</code>  | <code>'md'</code> | <code>'sm'</code>`,
                default: `-`,
                desc: 'Form item size',
            },
            {
                propName: 'labelWidth',
                type: `<code>stirng</code>  | <code>number</code> `,
                default: `-`,
                desc: 'Form label width',
            },
            {
                propName: 'errorMessage',
                type: `<code>stirng</code>`,
                default: `-`,
                desc: 'Error Message that will display when <code>invalid</code> was triggered',
            },
            {
                propName: 'invalid',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Validate status of FormItem',
            },
            {
                propName: 'asterisk',
                type: `<code>boolean</code>`,
                default: `-`,
                desc: 'Whether to display asterisk beside label text',
            },
            {
                propName: 'extra',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `-`,
                desc: 'Extra custom content beside label text',
            },
            {
                propName: 'htmlFor',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Set sub label htmlFor',
            },
        ],
    },
]

const formikNote = (
    <div>
        <h4>Formik</h4>
        <p className="mt-2">
            Formik is a flexible form library for React, which allow us to do
            form state manipulation, validation & submission, you can visit the
            official
            <a
                className="underline text-blue-500"
                href="https://formik.org/docs/overview"
                target="_blank"
                rel="noreferrer"
            >
                {' '}
                documentation{' '}
            </a>
            for more detail formik usage & examples.
        </p>
        <h4 className="mt-10">Yup</h4>
        <p className="mt-2">
            Yup is a schema builder for runtime value parsing and validation.
            Define a schema, transform a value to match, assert the shape of an
            existing value, or both. Yup schema are extremely expressive and
            allow modeling complex, interdependent validations, or value
            transformation. you can visit the official
            <a
                className="underline text-blue-500"
                href="https://github.com/jquense/yup"
                target="_blank"
                rel="noreferrer"
            >
                {' '}
                documentation{' '}
            </a>
            for more detail Yup usage & examples.
        </p>
    </div>
)

const FormControl = () => {
    return (
        <DemoLayout
            header={demoHeader}
            demos={demos}
            api={demoApi}
            note={formikNote}
        />
    )
}

export default FormControl

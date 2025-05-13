import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import DragAndDrop from './DragAndDrop'
import Disabled from './Disabled'
import BeforeUpload from './BeforeUpload'
import Customize from './Customize'
import AvatarImage from './AvatarImage'

const mdPath = 'Upload'

const demoHeader = {
    title: 'Upload',
    desc: 'Upload is a component that allow user to attach files & images, it can be used with form and upload the data to some where else.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `A basic Upload example.`,
        component: <Basic />,
    },
    {
        mdName: 'DragAndDrop',
        mdPath: mdPath,
        title: 'Drag and Drop',
        desc: `With <code>draggable</code> prop, we can drag files to a specific area to proceed upload.`,
        component: <DragAndDrop />,
    },
    {
        mdName: 'Disabled',
        mdPath: mdPath,
        title: 'Disabled',
        desc: `Disabled the Upload component by setting <code>disabled</code> to true.`,
        component: <Disabled />,
    },
    {
        mdName: 'Customize',
        mdPath: mdPath,
        title: 'Customize',
        desc: `We can replace the default upload look.`,
        component: <Customize />,
    },
    {
        mdName: 'BeforeUpload',
        mdPath: mdPath,
        title: 'Upload Control',
        desc: `Use <code>beforeUpload</code> prop to make a callback function to validate file before upload.`,
        component: <BeforeUpload />,
    },
    {
        mdName: 'AvatarImage',
        mdPath: mdPath,
        title: 'Avatar',
        desc: `An example for avatar upload`,
        component: <AvatarImage />,
    },
]

const demoApi = [
    {
        component: 'Upload',
        api: [
            {
                propName: 'accept',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'File types that can be accepted as input accept attribute',
            },
            {
                propName: 'beforeUpload',
                type: `<code>(file: FileList | null, fileList: File[]) => boolean | string</code>`,
                default: `-`,
                desc: 'The callback function that before file upload, return false or string with value to intercept the upload',
            },
            {
                propName: 'disabled',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether to disable Upload',
            },
            {
                propName: 'draggable',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether enable draggable upload',
            },
            {
                propName: 'fileList',
                type: `<code>File[]</code>`,
                default: `<code>[]</code>`,
                desc: 'Initial file list',
            },
            {
                propName: 'fileListClass',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Class for file list wrapper',
            },
            {
                propName: 'fileItemClass',
                type: `<code>string</code>`,
                default: `-`,
                desc: 'Class for file item',
            },
            {
                propName: 'onChange',
                type: `<code>(file: File[], fileList: File[]) => void</code>`,
                default: `-`,
                desc: 'Callback function after file uploaded',
            },
            {
                propName: 'onFileRemove',
                type: `<code>(file: File[]) => void</code>`,
                default: `-`,
                desc: 'Callback function when a file was deleted',
            },
            {
                propName: 'showList',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether to show uploaded file list',
            },
            {
                propName: 'tip',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `-`,
                desc: 'Hint message under Upload',
            },
            {
                propName: 'uploadLimit',
                type: `<code>number</code>`,
                default: `-`,
                desc: 'Maximum file to upload',
            },
        ],
    },
]

const FormControl = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default FormControl

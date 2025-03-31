import AdaptableCard from '@/components/shared/AdaptableCard'
import Container from '@/components/shared/Container'
import type { ReactNode } from 'react'

type Log = {
    version: string
    date: string
    updateContent: string[]
}

type LogProps = Omit<Log, 'updateContent'> & {
    border?: boolean
    children?: ReactNode
}

const logData: Log[] = [
    {
        version: '2.2.0',
        date: '07 Jan 2025',
        updateContent: [
            `[Update] React to version 19.`,
            `[Update] Various dependencies to their latest versions.`,
            `[Fix] Vertical menu collapsed issue in Mobile view`,
        ],
    },
    {
        version: '2.1.6',
        date: '08 Dec 2024',
        updateContent: [
            `[Update] Dependencies version`,
            `[Fix] Dependencies vulnerability`,
            `[Change] replace react-quill with react-quill-new`,
        ],
    },
    {
        version: '2.1.5',
        date: '30 Sep 2024',
        updateContent: ['[Fix] Select dropdown background color in dark mode'],
    },
    {
        version: '2.1.4',
        date: '29 Jul 2024',
        updateContent: [
            '[Add] "fileListClass" & "fileItemClass" props to Upload component',
            '[Fix] AuthLoayout maximum width ',
            '[Fix] redundant h-auto from select__control to tally input-sm size',
            '[Fix] unique id for TimeInputField in TimeInput',
        ],
    },
    {
        version: '2.1.3',
        date: '23 May 2024',
        updateContent: [
            '[Fix] Segment code example demo broken',
            '[Fix] Datepicker incorrect view while apply dynamic value to minDate & maxDate ',
            '[Fix] Radio.Group not updating controlled value',
        ],
    },
    {
        version: '2.1.2',
        date: '27 Mar 2024',
        updateContent: [
            '[Add] Firebase integration guide',
            '[Add] Checkbox controlled usage',
            '[Fix] Pagination dissapear upon clicking next while pager legth exceeds certain amount',
        ],
    },
    {
        version: '2.1.1',
        date: '04 Feb 2024',
        updateContent: [
            '[Fix] Missing locale key in demo',
            '[Fix] toast custom close malfunction',
        ],
    },
    {
        version: '2.1.0',
        date: '02 Jan 2024',
        updateContent: [
            '[Change] replace popper js with floating ui in Datepicker component',
            '[Change] replace popper js with floating ui in Tooltip component',
            '[Fix] Map source missing in map demo',
            '[Update] Various dependencies',
        ],
    },
    {
        version: '2.0.4',
        date: '02 Dec 2023',
        updateContent: [
            '[Fix] Upload file list not display properly',
            '[Fix] Incorrect languageList value in LanguageSelector',
        ],
    },
    {
        version: '2.0.3',
        date: '01 Nov 2023',
        updateContent: [
            '[Fix] Multiple date view incorrectly display in date picker',
            '[Fix] Missing code usage in FormCustomFormatInput doc',
        ],
    },
    {
        version: '2.0.2',
        date: '27 Sep 2023',
        updateContent: [
            '[Add] "rows" prop to Input component for textarea',
            '[Fix] Redundant component in print view ',
            '[Fix] Drag & drop not working under StrictMode',
        ],
    },
    {
        version: '2.0.1',
        date: '30 Jul 2023',
        updateContent: [
            '[Add] Multiple level collapse support for Menu component',
            '[Add] External link support for navigation menu',
            '[Fix] Input group insufficient z-index value',
            '[Fix] Auto submit issue when month or year option clicked',
            '[Fix] Select multiple value tag disabled color',
            '[Fix] Steps connect gap if no title value',
        ],
    },
    {
        version: '2.0.0',
        date: '01 Jul 2023',
        updateContent: [
            '[New] Template rewrite with Typescript',
            '[Change] create-react-app to vite',
            '[Update] Various dependencies',
        ],
    },
    {
        version: '1.3.3',
        date: '24 May 2023',
        updateContent: ['[Fix] Sorter order state abnormal issue'],
    },
    {
        version: '1.3.2',
        date: '07 May 2023',
        updateContent: [
            '[Fix] Side nav title missing authority check',
            '[Fix] Crypto Wallet page transaction history table query errors',
            '[Fix] TimelineAvatar components dupilcated css class',
        ],
    },
    {
        version: '1.3.1',
        date: '02 Apr 2023',
        updateContent: [
            '[Fix] Select disabled style in dark mode',
            '[Fix] PageSize display limited to 10 in DataTable',
            '[Add] inputtableBlurClose prop to DatePicker',
        ],
    },
    {
        version: '1.3.0',
        date: '10 Mar 2023',
        updateContent: [
            '[Update] Dependencies react-table to v8 (v7 will remain until next major update)',
            '[Change] DataTable columns props config',
            '[Fix] DatePicker triggering a form submission upon arrow buttons was clicked within formik',
            '[Fix] token not attached to request header after login',
            '[Fix] Insufficient Header z-index value & overlaping with other components',
        ],
    },
    {
        version: '1.2.2',
        date: '17 Feb 2023',
        updateContent: ['[Fix] Option is not highlight when using keyboard'],
    },
    {
        version: '1.2.1',
        date: '14 Feb 2023',
        updateContent: ['[Fix] Menu unable to scroll in stacked side'],
    },
    {
        version: '1.2.0',
        date: '05 Feb 2023',
        updateContent: [
            '[Change] Seperate locale state from theme',
            '[Add] Prettier format command',
        ],
    },
    {
        version: '1.1.6',
        date: '16 Dec 2022',
        updateContent: [
            '[Fix] Dropdown submenu display false direction in RTL',
        ],
    },
    {
        version: '1.1.5',
        date: '08 Dec 2022',
        updateContent: [
            '[Fix] TimeInput display order issue in RTL',
            '[Fix] DateRangePicker incorrect corner display in RTL',
        ],
    },
    {
        version: '1.1.4',
        date: '07 Dec 2022',
        updateContent: [
            '[Fix] Table header incorrect text alignment RTL',
            '[Fix] DataTable checkbox not reset when data changed',
            '[Fix] DataPicker caret in RTL',
            '[Fix] Radio unable to check with group name',
        ],
    },
    {
        version: '1.1.3',
        date: '06 Dec 2022',
        updateContent: ['[Fix] Side nav incorrect menu item padding in RTL'],
    },
    {
        version: '1.1.2',
        date: '06 Dec 2022',
        updateContent: [
            '[Fix] Side nav incorrect tooltip arrow in RTL',
            '[Fix] Side nav incorrect sub menu display in RTL',
        ],
    },
    {
        version: '1.1.1',
        date: '03 Dec 2022',
        updateContent: [
            '[Fix] Chart grid line missing',
            '[Fix] Map demo page broken',
            '[Update] Documentation',
        ],
    },
    {
        version: '1.1.0',
        date: '18 Nov 2022',
        updateContent: [
            '[Fix] Map component demo missing resources.',
            '[Replace] Dependencies @vx/pattern with @visx/patter.',
            '[Replace] Dependencies react-custom-scrollbars with react-custom-scrollbars-2.',
            '[Replace] Dependencies react-html-parser with html-react-parser.',
            '[Update] Dependencies react-select to 5.6.1',
            '[Update] Dependencies react-simple-maps to 3.0.0',
            '[Update] Dependencies tailwind-safelist-generator to 1.0.0',
            '[Change] import ReactHtmlParser from html-react-parser',
            '[Change] import Scrollbars from react-custom-scrollbars-2',
        ],
    },
    {
        version: '1.0.6',
        date: '12 Nov 2022',
        updateContent: [
            '[Add] signUp method to useAuth.',
            '[Change] signUp handler with useAuth signUp method.',
            '[Update] Documentation (Authentication, MockAPi, App config).',
            '[Update] tourPath default value in starter app.config.',
        ],
    },
    {
        version: '1.0.5',
        date: '06 Nov 2022',
        updateContent: ['[Fix] Dark mode not apply to StackedSideNav menu.'],
    },
    {
        version: '1.0.4',
        date: '03 Nov 2022',
        updateContent: [
            '[Fix] Mixed Form Control code demo which will cause warning.',
            '[Fix] Unable to set theme from config, hence remove theme from persist state in starter kit.',
            '[Remove] Binded data from UserDropdown component in starter kit.',
            '[Remove] Duplicated postcss-import from package.json dependencies which already included in devDependencies.',
            '[Change] Enable mock api by default in starter kit.',
        ],
    },
    {
        version: '1.0.3',
        date: '12 Oct 2022',
        updateContent: [
            '[Fix] Menu item collapsing issue in starter pack.',
            '[Fix] ActivityLog filter panel overlap in mobile view.',
            '[Fix] App.js react in jsx scope issue.',
        ],
    },
    {
        version: '1.0.2',
        date: '03 Oct 2022',
        updateContent: ['[Fix] Notification dropdown down overflow in mobile'],
    },
    {
        version: '1.0.1',
        date: '20 Sep 2022',
        updateContent: ['[Fix] Redux persistence abnormal.'],
    },
    {
        version: '1.0.0',
        date: '15 Sep 2022',
        updateContent: ['[Release] Initial Release.'],
    },
]

const Log = (props: LogProps) => {
    return (
        <div className={`py-4 ${props.border && 'border-bottom'}`}>
            <div className="flex items-center">
                <h5 className="font-weight-normal mb-0 mr-3">
                    {props.version}
                </h5>
                <code>{props.date}</code>
            </div>
            <div className="api-container p-0 border-0 mt-3">
                {props.children}
            </div>
        </div>
    )
}

const Changelog = () => {
    return (
        <Container>
            <AdaptableCard>
                <h4>Changelog</h4>
                {logData.map((elm) => (
                    <Log
                        key={elm.version}
                        version={`v${elm.version}`}
                        date={elm.date}
                    >
                        {elm.updateContent.length > 0 ? (
                            <ul>
                                {elm.updateContent.map((item, i) => (
                                    <li key={i}>- {item}</li>
                                ))}
                            </ul>
                        ) : null}
                    </Log>
                ))}
            </AdaptableCard>
        </Container>
    )
}

export default Changelog

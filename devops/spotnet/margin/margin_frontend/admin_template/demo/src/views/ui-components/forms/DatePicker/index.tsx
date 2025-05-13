import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import RangePicker from './RangePicker'
import DateTimePicker from './DateTimePicker'
import Controlled from './Controlled'
import Format from './Format'
import CustomRender from './CustomRender'
import DisableOutOfPeriodDate from './DisableOutOfPeriodDate'
import DisabledCertainDate from './DisabledCertainDate'
import DateViewCount from './DateViewCount'
import Inputtable from './Inputtable'
import DisabledInput from './DisabledInput'
import InputSize from './InputSize'
import InputAffix from './InputAffix'
import ClearButton from './ClearButton'
import Localization from './Localization'

const mdPath = 'DatePicker'

const demoHeader = {
    title: 'DatePicker',
    desc: 'Date picker allow users select a date by from a popup calendar.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Typical usage DatePicker component.`,
        component: <Basic />,
    },
    {
        mdName: 'RangePicker',
        mdPath: mdPath,
        title: 'Range picker',
        desc: `Typical usage RangePicker component.`,
        component: <RangePicker />,
    },
    {
        mdName: 'DateTimePicker',
        mdPath: mdPath,
        title: 'Date time picker',
        desc: `Combination of <code> &lt;DatePicker /&gt;</code> & <code> &lt;TimeInput /&gt;</code>`,
        component: <DateTimePicker />,
    },
    {
        mdName: 'Controlled',
        mdPath: mdPath,
        title: 'Controlled',
        desc: `Controlled usage with <code> &lt;DatePicker /&gt;</code> & <code> &lt;DatePickerRange /&gt;</code>`,
        component: <Controlled />,
    },
    {
        mdName: 'Format',
        mdPath: mdPath,
        title: 'Format',
        desc: `Picker allow us to set custom both date format for input & picker via <code>inputFormat</code> & <code>labelFormat</code> props.`,
        component: <Format />,
    },
    {
        mdName: 'CustomRender',
        mdPath: mdPath,
        title: 'Custom Render',
        desc: `You can render custom day elements or apply styles & className to days with these <code>dayStyle</code>, <code>dayClassName</code> & <code>renderDay</code> props.`,
        component: <CustomRender />,
    },
    {
        mdName: 'DisableOutOfPeriodDate',
        mdPath: mdPath,
        title: 'Disable out of period date',
        desc: `Setting <code>minDate</code> & <code>maxDate</code> props to limit available date within a period.`,
        component: <DisableOutOfPeriodDate />,
    },
    {
        mdName: 'DisabledCertainDate',
        mdPath: mdPath,
        title: 'Disabled certain date',
        desc: `Disabled part of dates by using <code>disabledDate</code> prop callback.`,
        component: <DisabledCertainDate />,
    },
    {
        mdName: 'DateViewCount',
        mdPath: mdPath,
        title: 'Multiple date view',
        desc: `We can have mutiple date view by setting <code>dateViewCount</code> more than <code>1</code>.`,
        component: <DateViewCount />,
    },
    {
        mdName: 'DisabledInput',
        mdPath: mdPath,
        title: 'Disabled Input',
        desc: `Use <code>disabled</code> prop to disable user expand DatePicker.`,
        component: <DisabledInput />,
    },
    {
        mdName: 'Inputtable',
        mdPath: mdPath,
        title: 'Inputtable',
        desc: `Release input lock to let user enter the date manually.`,
        component: <Inputtable />,
    },
    {
        mdName: 'InputSize',
        mdPath: mdPath,
        title: 'Input Size',
        desc: `DatePicker allow us to control the input size via <code>size</code> prop.`,
        component: <InputSize />,
    },
    {
        mdName: 'InputAffix',
        mdPath: mdPath,
        title: 'Input Affix',
        desc: `<code>inputSuffix</code> or <code>inputPrefix</code> allow us to customize input affix content.`,
        component: <InputAffix />,
    },
    {
        mdName: 'ClearButton',
        mdPath: mdPath,
        title: 'Clear Button',
        desc: `You can customize the clear button via <code>clearable</code> or <code>clearButton</code> props.`,
        component: <ClearButton />,
    },
    {
        mdName: 'Localization',
        mdPath: mdPath,
        title: 'Localization',
        desc: `DatePicker receive locale value from <code> &lt;ConfigProvider /&gt;</code>, but there is also an option to input locale manually.`,
        component: <Localization />,
    },
]

const demoApi = [
    {
        component: 'DatePicker',
        api: [
            {
                propName: 'clearable',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether allow to clear value',
            },
            {
                propName: 'clearButton',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `<code>ReactNode</code>`,
                desc: 'Custom clear button',
            },
            {
                propName: 'closePickerOnChange',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether close picker upon date selected',
            },
            {
                propName: 'dateViewCount',
                type: `<code>number</code>`,
                default: `<code>1</code>`,
                desc: 'Amount of date view display in picker',
            },
            {
                propName: 'dayClassName',
                type: `<code>(date: Date, modifiers: {disabled: boolean, weekend: boolean, selectedInRange: boolean, selected: boolean, inRange: boolean, firstInRange: boolean, lastInRange: boolean, outOfMonth: boolean}) => string</code>`,
                default: `-`,
                desc: 'Apply className to days based on argument',
            },
            {
                propName: 'dayStyle',
                type: `<code>(date: Date, modifiers: {disabled: boolean, weekend: boolean, selectedInRange: boolean, selected: boolean, inRange: boolean, firstInRange: boolean, lastInRange: boolean, outOfMonth: boolean}) => CSSProperties</code>`,
                default: `-`,
                desc: 'Apply style to days based on argument',
            },
            {
                propName: 'defaultValue',
                type: `<code>Date</code>`,
                default: `-`,
                desc: 'Default value of DatePicker (use value instead if it is controlled)',
            },
            {
                propName: 'defaultMonth',
                type: `<code>Date</code>`,
                default: `-`,
                desc: 'Default month for uncontrolled DatePicker',
            },
            {
                propName: 'defaultOpen',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether to default open DatePicker',
            },
            {
                propName: 'defaultView',
                type: `<code>'date'</code> | <code>'month'</code> | <code>'year'</code> `,
                default: `<code>'date'</code>`,
                desc: 'Default DatePicker view',
            },
            {
                propName: 'disabled',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Determine whether DatePicker Input is disabled',
            },
            {
                propName: 'disabledDate',
                type: `<code>(date: Date) => boolean</code>`,
                default: `-`,
                desc: 'Specify the date that cannot be selected',
            },
            {
                propName: 'disableOutOfMonth',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether to disable days that out of given month',
            },
            {
                propName: 'enableHeaderLabel',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Enable header label to trigger view change',
            },
            {
                propName: 'firstDayOfWeek',
                type: `<code>'sunday'</code> | <code>'monday'</code>`,
                default: `<code>'monday'</code>`,
                desc: 'First day of week',
            },
            {
                propName: 'hideOutOfMonthDates',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether to hide days that out of given month',
            },
            {
                propName: 'hideWeekdays',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether to hide week days',
            },
            {
                propName: 'inputFormat',
                type: `<code>string</code>`,
                default: `<code>'YYYY-MM-DD'</code>`,
                desc: 'DatePicker Input display format',
            },
            {
                propName: 'inputPrefix',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `-`,
                desc: 'Render a prefix content inside DatePicker Input',
            },
            {
                propName: 'inputSuffix',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `-`,
                desc: 'Render a suffix content inside DatePicker Input',
            },
            {
                propName: 'inputtable',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether to allow input typing',
            },
            {
                propName: 'labelFormat',
                type: `<code>{month: string, year: string}</code>`,
                default: `<code>{month: 'MMM', year: 'YYYY'}</code>`,
                desc: 'Whether to allow input typing',
            },
            {
                propName: 'locale',
                type: `<a href="https://github.com/iamkun/dayjs/tree/dev/src/locale" target="_blank" rel="noopener noreferrer"><code>dayjs locale</code></a>`,
                default: `<code>en</code>`,
                desc: 'DatePicker locale',
            },
            {
                propName: 'maxDate',
                type: `<code>Date</code>`,
                default: `-`,
                desc: 'Maximum date to select',
            },
            {
                propName: 'minDate',
                type: `<code>Date</code>`,
                default: `-`,
                desc: 'Minimum  date to select',
            },
            {
                propName: 'monthLabelFormat',
                type: `<code>string</code>`,
                default: `<code>'YYYY'</code>`,
                desc: 'Month label format',
            },
            {
                propName: 'onBlur',
                type: `<code>function(event: Event)</code> `,
                default: `-`,
                desc: 'Callback when DatePicker Input blur',
            },
            {
                propName: 'onChange',
                type: `<code>function(date: Date)</code> `,
                default: `-`,
                desc: 'Callback when date cell is selected',
            },
            {
                propName: 'onDayMouseEnter',
                type: `<code>function(date: Date)</code> `,
                default: `-`,
                desc: 'Callback when date is hovered',
            },
            {
                propName: 'onFocus',
                type: `<code>function(event: Event)</code> `,
                default: `-`,
                desc: 'Callback when DatePicker Input focus',
            },
            {
                propName: 'onDropdownClose',
                type: `<code>() => void</code> `,
                default: `-`,
                desc: 'Callback when DatePicker close',
            },
            {
                propName: 'onDropdownOpen',
                type: `<code>() => void</code> `,
                default: `-`,
                desc: 'Callback when DatePicker open',
            },
            {
                propName: 'openPickerOnClear',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether to open DatePicker upon clear value',
            },
            {
                propName: 'range',
                type: `<code>[Date | null, Date | null]</code>`,
                default: `-`,
                desc: 'Highlight given date range',
            },
            {
                propName: 'renderDay',
                type: `<code>(date: Date) => ReactNode</code>`,
                default: `<code>false</code>`,
                desc: 'Render custome day element based on the given params',
            },
            {
                propName: 'size',
                type: `<code>'sm'</code> | <code>'md'</code> | <code>'lg'</code> `,
                default: `<code>'md'</code>`,
                desc: 'DatePicker input size',
            },
            {
                propName: 'value',
                type: `<code>Date</code>`,
                default: `-`,
                desc: 'Value of DatePicker (Controlled)',
            },
            {
                propName: 'weekdayLabelFormat',
                type: `<code>string</code>`,
                default: `<code>'dd'</code>`,
                desc: 'Format for weekday display',
            },
            {
                propName: 'weekendDays',
                type: `<code>number[]</code>`,
                default: `<code>[0, 6]</code>`,
                desc: 'Indicate the days of weekend',
            },
            {
                propName: 'yearLabelFormat',
                type: `<code>string</code>`,
                default: `<code>'YYYY'</code>`,
                desc: 'Year label format',
            },
        ],
    },
    {
        component: 'DatePicker.DatePickerRange',
        api: [
            {
                propName: 'clearable',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether allow to clear value',
            },
            {
                propName: 'clearButton',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `<code>ReactNode</code>`,
                desc: 'Custom clear button',
            },
            {
                propName: 'closePickerOnChange',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether close picker upon date selected',
            },
            {
                propName: 'dateViewCount',
                type: `<code>number</code>`,
                default: `<code>1</code>`,
                desc: 'Amount of date view display in picker',
            },
            {
                propName: 'dayClassName',
                type: `<code>(date: Date, modifiers: {disabled: boolean, weekend: boolean, selectedInRange: boolean, selected: boolean, inRange: boolean, firstInRange: boolean, lastInRange: boolean, outOfMonth: boolean}) => string</code>`,
                default: `-`,
                desc: 'Apply className to days based on argument',
            },
            {
                propName: 'dayStyle',
                type: `<code>(date: Date, modifiers: {disabled: boolean, weekend: boolean, selectedInRange: boolean, selected: boolean, inRange: boolean, firstInRange: boolean, lastInRange: boolean, outOfMonth: boolean}) => CSSProperties</code>`,
                default: `-`,
                desc: 'Apply style to days based on argument',
            },
            {
                propName: 'defaultValue',
                type: `<code>Date</code>`,
                default: `-`,
                desc: 'Default value of DatePickerRange (use value instead if it is controlled)',
            },
            {
                propName: 'defaultMonth',
                type: `<code>Date</code>`,
                default: `-`,
                desc: 'Default month for uncontrolled DatePickerRange',
            },
            {
                propName: 'defaultOpen',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether to default open DatePickerRange',
            },
            {
                propName: 'defaultView',
                type: `<code>'date'</code> | <code>'month'</code> | <code>'year'</code> `,
                default: `<code>'date'</code>`,
                desc: 'Default DatePickerRange view',
            },
            {
                propName: 'disabled',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Determine whether DatePickerRange Input is disabled',
            },
            {
                propName: 'disabledDate',
                type: `<code>(date: Date) => boolean</code>`,
                default: `-`,
                desc: 'Specify the date that cannot be selected',
            },
            {
                propName: 'disableOutOfMonth',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether to disable days that out of given month',
            },
            {
                propName: 'enableHeaderLabel',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether to disable header label to trigger view change',
            },
            {
                propName: 'firstDayOfWeek',
                type: `<code>'sunday'</code> | <code>'monday'</code>`,
                default: `<code>'monday'</code>`,
                desc: 'First day of week',
            },
            {
                propName: 'hideOutOfMonthDates',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether to hide days that out of given month',
            },
            {
                propName: 'hideWeekdays',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether to hide week days',
            },
            {
                propName: 'inputFormat',
                type: `<code>string</code>`,
                default: `<code>'YYYY-MM-DD'</code>`,
                desc: 'DatePickerRange Input display format',
            },
            {
                propName: 'inputPrefix',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `-`,
                desc: 'Render a prefix content inside DatePickerRange Input',
            },
            {
                propName: 'inputSuffix',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `-`,
                desc: 'Render a suffix content inside DatePickerRange Input',
            },
            {
                propName: 'inputtable',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether to allow input typing',
            },
            {
                propName: 'inputtableBlurClose',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether to close DatePicker upon input (only work when inputtable is true)',
            },
            {
                propName: 'labelFormat',
                type: `<code>string</code>`,
                default: `<code>'~'</code>`,
                desc: 'Seperator between date display on input',
            },
            {
                propName: 'locale',
                type: `<a href="https://github.com/iamkun/dayjs/tree/dev/src/locale" target="_blank" rel="noopener noreferrer"><code>dayjs locale</code></a>`,
                default: `<code>en</code>`,
                desc: 'DatePickerRange locale',
            },
            {
                propName: 'maxDate',
                type: `<code>Date</code>`,
                default: `-`,
                desc: 'Maximum date to select',
            },
            {
                propName: 'minDate',
                type: `<code>Date</code>`,
                default: `-`,
                desc: 'Minimum  date to select',
            },
            {
                propName: 'monthLabelFormat',
                type: `<code>string</code>`,
                default: `<code>'YYYY'</code>`,
                desc: 'Month label format',
            },
            {
                propName: 'onChange',
                type: `<code>function(date: Date)</code> `,
                default: `-`,
                desc: 'Callback when date cell is selected',
            },
            {
                propName: 'onDayMouseEnter',
                type: `<code>function(date: Date)</code> `,
                default: `-`,
                desc: 'Callback when date is hovered',
            },
            {
                propName: 'onDropdownClose',
                type: `<code>() => void</code> `,
                default: `-`,
                desc: 'Callback when DatePickerRange close',
            },
            {
                propName: 'onDropdownOpen',
                type: `<code>() => void</code> `,
                default: `-`,
                desc: 'Callback when DatePickerRange open',
            },
            {
                propName: 'openPickerOnClear',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether to open DatePickerRange upon clear value',
            },
            {
                propName: 'range',
                type: `<code>[Date | null, Date | null]</code>`,
                default: `-`,
                desc: 'Highlight given date range',
            },
            {
                propName: 'renderDay',
                type: `<code>(date: Date) => ReactNode</code>`,
                default: `<code>false</code>`,
                desc: 'Render custome day element based on the given params',
            },
            {
                propName: 'separator',
                type: `<code>string</code>`,
                default: `<code>'~'</code>`,
                desc: 'Seperator between dates',
            },
            {
                propName: 'size',
                type: `<code>'sm'</code> | <code>'md'</code> | <code>'lg'</code> `,
                default: `<code>'md'</code>`,
                desc: 'DatePickerRange input size',
            },
            {
                propName: 'singleDate',
                type: `<code>boolean</code> `,
                default: `<code>false</code>`,
                desc: 'Only one date can be selected',
            },
            {
                propName: 'value',
                type: `<code>[Date | null, Date | null]</code>`,
                default: `-`,
                desc: 'Value of DatePickerRange (Controlled)',
            },
            {
                propName: 'weekdayLabelFormat',
                type: `<code>string</code>`,
                default: `<code>'dd'</code>`,
                desc: 'Format for weekday display',
            },
            {
                propName: 'weekendDays',
                type: `<code>number[]</code>`,
                default: `<code>[0, 6]</code>`,
                desc: 'Indicate the days of weekend',
            },
            {
                propName: 'yearLabelFormat',
                type: `<code>string</code>`,
                default: `<code>'YYYY'</code>`,
                desc: 'Year label format',
            },
        ],
    },
    {
        component: 'DatePicker.DateTimepicker',
        api: [
            {
                propName: 'amPm',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether to set time input to 12 hours format',
            },
            {
                propName: 'clearable',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether allow to clear value',
            },
            {
                propName: 'clearButton',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `<code>ReactNode</code>`,
                desc: 'Custom clear button',
            },
            {
                propName: 'closePickerOnChange',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether close picker upon date selected',
            },
            {
                propName: 'dateViewCount',
                type: `<code>number</code>`,
                default: `<code>1</code>`,
                desc: 'Amount of date view display in picker',
            },
            {
                propName: 'dayClassName',
                type: `<code>(date: Date, modifiers: {disabled: boolean, weekend: boolean, selectedInRange: boolean, selected: boolean, inRange: boolean, firstInRange: boolean, lastInRange: boolean, outOfMonth: boolean}) => string</code>`,
                default: `-`,
                desc: 'Apply className to days based on argument',
            },
            {
                propName: 'dayStyle',
                type: `<code>(date: Date, modifiers: {disabled: boolean, weekend: boolean, selectedInRange: boolean, selected: boolean, inRange: boolean, firstInRange: boolean, lastInRange: boolean, outOfMonth: boolean}) => CSSProperties</code>`,
                default: `-`,
                desc: 'Apply style to days based on argument',
            },
            {
                propName: 'defaultValue',
                type: `<code>Date</code>`,
                default: `-`,
                desc: 'Default value of DateTimepicker (use value instead if it is controlled)',
            },
            {
                propName: 'defaultMonth',
                type: `<code>Date</code>`,
                default: `-`,
                desc: 'Default month for uncontrolled DateTimepicker',
            },
            {
                propName: 'defaultOpen',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether to default open DateTimepicker',
            },
            {
                propName: 'defaultView',
                type: `<code>'date'</code> | <code>'month'</code> | <code>'year'</code> `,
                default: `<code>'date'</code>`,
                desc: 'Default DateTimepicker view',
            },
            {
                propName: 'disabled',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Determine whether DateTimepicker Input is disabled',
            },
            {
                propName: 'disabledDate',
                type: `<code>(date: Date) => boolean</code>`,
                default: `-`,
                desc: 'Specify the date that cannot be selected',
            },
            {
                propName: 'disableOutOfMonth',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether to disable days that out of given month',
            },
            {
                propName: 'enableHeaderLabel',
                type: `<code>boolean</code>`,
                default: `<code>true</code>`,
                desc: 'Whether to disable header label to trigger view change',
            },
            {
                propName: 'firstDayOfWeek',
                type: `<code>'sunday'</code> | <code>'monday'</code>`,
                default: `<code>'monday'</code>`,
                desc: 'First day of week',
            },
            {
                propName: 'hideOutOfMonthDates',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether to hide days that out of given month',
            },
            {
                propName: 'hideWeekdays',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether to hide week days',
            },
            {
                propName: 'inputFormat',
                type: `<code>string</code>`,
                default: `<code>'YYYY-MM-DD'</code>`,
                desc: 'DateTimepicker Input display format',
            },
            {
                propName: 'inputPrefix',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `-`,
                desc: 'Render a prefix content inside DateTimepicker Input',
            },
            {
                propName: 'inputSuffix',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `-`,
                desc: 'Render a suffix content inside DateTimepicker Input',
            },
            {
                propName: 'labelFormat',
                type: `<code>{month: string, year: string}</code>`,
                default: `<code>{month: 'MMM', year: 'YYYY'}</code>`,
                desc: 'Whether to allow input typing',
            },
            {
                propName: 'locale',
                type: `<a href="https://github.com/iamkun/dayjs/tree/dev/src/locale" target="_blank" rel="noopener noreferrer"><code>dayjs locale</code></a>`,
                default: `<code>en</code>`,
                desc: 'DateTimepicker locale',
            },
            {
                propName: 'maxDate',
                type: `<code>Date</code>`,
                default: `-`,
                desc: 'Maximum date to select',
            },
            {
                propName: 'minDate',
                type: `<code>Date</code>`,
                default: `-`,
                desc: 'Minimum  date to select',
            },
            {
                propName: 'monthLabelFormat',
                type: `<code>string</code>`,
                default: `<code>'YYYY'</code>`,
                desc: 'Month label format',
            },
            {
                propName: 'okButtonContent',
                type: `<code>string</code> | <code>ReactNode</code>`,
                default: `<code>'ok'</code>`,
                desc: 'Ok button content',
            },
            {
                propName: 'onBlur',
                type: `<code>function(event: Event)</code> `,
                default: `-`,
                desc: 'Callback when DateTimepicker Input blur',
            },
            {
                propName: 'onChange',
                type: `<code>function(date: Date)</code> `,
                default: `-`,
                desc: 'Callback when date cell is selected',
            },
            {
                propName: 'onDayMouseEnter',
                type: `<code>function(date: Date)</code> `,
                default: `-`,
                desc: 'Callback when date is hovered',
            },
            {
                propName: 'onFocus',
                type: `<code>function(event: Event)</code> `,
                default: `-`,
                desc: 'Callback when DateTimepicker Input focus',
            },
            {
                propName: 'onDropdownClose',
                type: `<code>() => void</code> `,
                default: `-`,
                desc: 'Callback when DateTimepicker close',
            },
            {
                propName: 'onDropdownOpen',
                type: `<code>() => void</code> `,
                default: `-`,
                desc: 'Callback when DateTimepicker open',
            },
            {
                propName: 'openPickerOnClear',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Whether to open DateTimepicker upon clear value',
            },
            {
                propName: 'range',
                type: `<code>[Date | null, Date | null]</code>`,
                default: `-`,
                desc: 'Highlight given date range',
            },
            {
                propName: 'renderDay',
                type: `<code>(date: Date) => ReactNode</code>`,
                default: `<code>false</code>`,
                desc: 'Render custome day element based on the given params',
            },
            {
                propName: 'size',
                type: `<code>'sm'</code> | <code>'md'</code> | <code>'lg'</code> `,
                default: `<code>'md'</code>`,
                desc: 'DateTimepicker input size',
            },
            {
                propName: 'value',
                type: `<code>Date</code>`,
                default: `-`,
                desc: 'Value of DateTimepicker (Controlled)',
            },
            {
                propName: 'weekdayLabelFormat',
                type: `<code>string</code>`,
                default: `<code>'dd'</code>`,
                desc: 'Format for weekday display',
            },
            {
                propName: 'weekendDays',
                type: `<code>number[]</code>`,
                default: `<code>[0, 6]</code>`,
                desc: 'Indicate the days of weekend',
            },
            {
                propName: 'yearLabelFormat',
                type: `<code>string</code>`,
                default: `<code>'YYYY'</code>`,
                desc: 'Year label format',
            },
        ],
    },
]

const DatePicker = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default DatePicker

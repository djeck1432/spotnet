import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import Range from './Range'
import CustomRender from './CustomRender'
import DisabledCertainDate from './DisabledCertainDate'
import DisableOutOfPeriodDate from './DisableOutOfPeriodDate'
import MultipleDateView from './MultipleDateView'
import MultipleSelection from './MultipleSelection'

const mdPath = 'Calendar'

const demoHeader = {
    title: 'Calendar',
    desc: 'Calendar component is used for categorize content with a keyword.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic usage of Calendar.`,
        component: <Basic />,
    },
    {
        mdName: 'Range',
        mdPath: mdPath,
        title: 'Range',
        desc: `RangeCalendar have similar behavior with Calendar, but it able to select start and end date.`,
        component: <Range />,
    },
    {
        mdName: 'CustomRender',
        mdPath: mdPath,
        title: 'Custom render',
        desc: `You can render custom day elements or apply styles & className to days with these <code>dayStyle</code>, <code>dayClassName</code> & <code>renderDay</code> props.`,
        component: <CustomRender />,
    },
    {
        mdName: 'DisabledCertainDate',
        mdPath: mdPath,
        title: 'Disabled certain date',
        desc: `Disabled part of dates by using <code>disabledDate</code> prop callback.`,
        component: <DisabledCertainDate />,
    },
    {
        mdName: 'DisableOutOfPeriodDate',
        mdPath: mdPath,
        title: 'Disable out of period date',
        desc: `Setting <code>minDate</code> & <code>maxDate</code> props to limit available date within a period.`,
        component: <DisableOutOfPeriodDate />,
    },
    {
        mdName: 'MultipleDateView',
        mdPath: mdPath,
        title: 'Multiple date view',
        desc: `Calender or RangeCalendar can have mutiple date view by setting <code>dateViewCount</code> more than <code>1</code>.`,
        component: <MultipleDateView />,
    },
    {
        mdName: 'MultipleSelection',
        mdPath: mdPath,
        title: 'Multiple selection',
        desc: `Calendar component allow multiple dates selection by setting <code>multipleSelection</code> props`,
        component: <MultipleSelection />,
    },
]

const demoApi = [
    {
        component: 'Calendar',
        api: [
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
                propName: 'defaultMonth',
                type: `<code>Date</code>`,
                default: `-`,
                desc: 'Default month for uncontrolled DatePickerRange',
            },
            {
                propName: 'defaultView',
                type: `<code>'date'</code> | <code>'month'</code> | <code>'year'</code> `,
                default: `<code>'date'</code>`,
                desc: 'Default DatePickerRange view',
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
                propName: 'isDateFirstInRange',
                type: `<code>(date: Date, modifiers: {disabled: boolean, weekend: boolean, selectedInRange: boolean, selected: boolean, inRange: boolean, firstInRange: boolean, lastInRange: boolean, outOfMonth: boolean}) => boolean</code>`,
                default: `-`,
                desc: 'Highlight date as first in a range',
            },
            {
                propName: 'isDateInRange',
                type: `<code>(date: Date, modifiers: {disabled: boolean, weekend: boolean, selectedInRange: boolean, selected: boolean, inRange: boolean, firstInRange: boolean, lastInRange: boolean, outOfMonth: boolean}) => boolean</code>`,
                default: `-`,
                desc: 'Highlight date in a range',
            },
            {
                propName: 'isDateLastInRange',
                type: `<code>(date: Date, modifiers: {disabled: boolean, weekend: boolean, selectedInRange: boolean, selected: boolean, inRange: boolean, firstInRange: boolean, lastInRange: boolean, outOfMonth: boolean}) => boolean</code>`,
                default: `-`,
                desc: 'Highlight date as last in a range',
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
                desc: 'Callback when date is selected',
            },
            {
                propName: 'onDayMouseEnter',
                type: `<code>function(date: Date)</code> `,
                default: `-`,
                desc: 'Callback when date is hovered',
            },
            {
                propName: 'paginateBy',
                type: `<code>number</code>`,
                default: `<code>dateViewCount</code> | <code>1</code>`,
                desc: 'Paginate by count of view',
            },
            {
                propName: 'preventFocus',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Prevent focusing upon click',
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
                propName: 'value',
                type: `<code>Date</code>`,
                default: `-`,
                desc: 'Value of calender (Controlled)',
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
        component: 'RangeCalendar',
        api: [
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
                propName: 'defaultMonth',
                type: `<code>Date</code>`,
                default: `-`,
                desc: 'Default month for uncontrolled DatePickerRange',
            },
            {
                propName: 'defaultView',
                type: `<code>'date'</code> | <code>'month'</code> | <code>'year'</code> `,
                default: `<code>'date'</code>`,
                desc: 'Default DatePickerRange view',
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
                propName: 'isDateFirstInRange',
                type: `<code>(date: Date, modifiers: {disabled: boolean, weekend: boolean, selectedInRange: boolean, selected: boolean, inRange: boolean, firstInRange: boolean, lastInRange: boolean, outOfMonth: boolean}) => boolean</code>`,
                default: `-`,
                desc: 'Highlight date as first in a range',
            },
            {
                propName: 'isDateInRange',
                type: `<code>(date: Date, modifiers: {disabled: boolean, weekend: boolean, selectedInRange: boolean, selected: boolean, inRange: boolean, firstInRange: boolean, lastInRange: boolean, outOfMonth: boolean}) => boolean</code>`,
                default: `-`,
                desc: 'Highlight date in a range',
            },
            {
                propName: 'isDateLastInRange',
                type: `<code>(date: Date, modifiers: {disabled: boolean, weekend: boolean, selectedInRange: boolean, selected: boolean, inRange: boolean, firstInRange: boolean, lastInRange: boolean, outOfMonth: boolean}) => boolean</code>`,
                default: `-`,
                desc: 'Highlight date as last in a range',
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
                desc: 'Callback when date is selected',
            },
            {
                propName: 'onDayMouseEnter',
                type: `<code>function(date: Date)</code> `,
                default: `-`,
                desc: 'Callback when date is hovered',
            },
            {
                propName: 'paginateBy',
                type: `<code>number</code>`,
                default: `<code>dateViewCount</code> | <code>1</code>`,
                desc: 'Paginate by count of view',
            },
            {
                propName: 'preventFocus',
                type: `<code>boolean</code>`,
                default: `<code>false</code>`,
                desc: 'Prevent focusing upon click',
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
                propName: 'singleDate',
                type: `<code>boolean</code> `,
                default: `<code>false</code>`,
                desc: 'Only one date can be selected',
            },
            {
                propName: 'value',
                type: `<code>[Date | null, Date | null]</code>`,
                default: `-`,
                desc: 'Value of calender (Controlled)',
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

const Calendar = () => {
    return <DemoLayout header={demoHeader} demos={demos} api={demoApi} />
}

export default Calendar

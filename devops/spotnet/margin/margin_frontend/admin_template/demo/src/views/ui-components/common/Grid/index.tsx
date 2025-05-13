import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import GridTemplateColumns from './GridTemplateColumns'
import GridColumnStartEnd from './GridColumnStartEnd'
import GridColumnStartEndLine from './GridColumnStartEndLine'
import GridTemplateRows from './GridTemplateRows'
import GridRowStartEndLine from './GridRowStartEndLine'
import GridRowStartEnd from './GridRowStartEnd'
import GridAutoflow from './GridAutoflow'
import GridAutoColumns from './GridAutoColumns'
import GridAutoRows from './GridAutoRows'
import HoverFocus from './HoverFocus'
import BreakpointsMediaQueries from './BreakpointsMediaQueries'

const mdPath = 'Grid'

const demoHeader = {
    title: 'Grid',
    desc: `Grid system from Tailwind CSS, refer to the <a class="text-blue-500 underline" href="https://tailwindcss.com/" target="_blank" >official doc</a> for more detail usage`,
}

const demos = [
    {
        mdName: 'GridTemplateColumns',
        mdPath: mdPath,
        title: 'Grid Template Columns',
        desc: `<p>Use the <code>grid-cols-{n}</code> utilities to create grids with <em>n</em> equally sized columns.</p>`,
        component: <GridTemplateColumns />,
    },
    {
        mdName: 'GridColumnStartEnd',
        mdPath: mdPath,
        title: 'Grid Column Start / End',
        desc: `<p>Use the <code>col-span-{n}</code> utilities to make an element span <em>n</em> columns.</p>`,
        component: <GridColumnStartEnd />,
    },
    {
        mdName: 'GridColumnStartEndLine',
        mdPath: mdPath,
        title: 'Grid Column Start / End Line',
        desc: `<p>Use the <code>col-start-{n}</code> and <code>col-end-{n}</code> utilities to make an element start or end at the <em>nth</em> grid line. These can also be combined with the <code>col-span-{n}</code> utilities to span a specific number of columns.</p> <p>Note that CSS grid lines start at 1, not 0, so a full-width element in a 6-column grid would start at line 1 and end at line 7.</p>`,
        component: <GridColumnStartEndLine />,
    },
    {
        mdName: 'GridTemplateRows',
        mdPath: mdPath,
        title: 'Grid Template Rows',
        desc: `<p>Use the <code>grid-rows-{n}</code> utilities to create grids with <em>n</em> equally sized rows.</p>`,
        component: <GridTemplateRows />,
    },
    {
        mdName: 'GridRowStartEndLine',
        mdPath: mdPath,
        title: 'Grid Row Start / End Line',
        desc: `<p>Use the <code>row-start-{n}</code> and <code>row-end-{n}</code> utilities to make an element start or end at the <em>nth</em> grid line. These can also be combined with the <code>row-span-{n}</code> utilities to span a specific number of rows.</p> <br /> <p>Note that CSS grid lines start at 1, not 0, so a full-height element in a 3-row grid would start at line 1 and end at line 4.</p>`,
        component: <GridRowStartEndLine />,
    },
    {
        mdName: 'GridRowStartEnd',
        mdPath: mdPath,
        title: 'Grid Row Start / End',
        desc: `<p>Use the <code>row-span-{n}</code> utilities to make an element span <em>n</em> rows.</p>`,
        component: <GridRowStartEnd />,
    },
    {
        mdName: 'GridAutoflow',
        mdPath: mdPath,
        title: 'Grid Auto Flow',
        desc: `<p>Use the <code>grid-flow-{keyword}</code> utilities to control how the auto-placement algorithm works for a grid layout.</p>`,
        component: <GridAutoflow />,
    },
    {
        mdName: 'GridAutoColumns',
        mdPath: mdPath,
        title: 'Grid Auto Columns',
        desc: `<p>Use the <code>auto-cols-{size}</code> utilities to control the size of implicitly-created grid columns.</p>`,
        component: <GridAutoColumns />,
    },
    {
        mdName: 'GridAutoRows',
        mdPath: mdPath,
        title: 'Grid Auto Rows',
        desc: `<p>Use the <code>auto-rows-{size}</code> utilities to control the size implicitly-created grid rows.</p>`,
        component: <GridAutoRows />,
    },
    {
        mdName: 'HoverFocus',
        mdPath: mdPath,
        title: 'Hover, focus, and other states',
        desc: `<p>Tailwind lets you conditionally apply utility classes in different states using variant modifiers. For example, use <code>hover:{class}</code> to only apply the <code>{class}</code> utility on hover.</p>`,
        component: <HoverFocus />,
    },
    {
        mdName: 'BreakpointsMediaQueries',
        mdPath: mdPath,
        title: 'Breakpoints and media queries',
        desc: `<p>You can also use variant modifiers to target media queries like responsive breakpoints, dark mode, prefers-reduced-motion, and more. For example, use <code>md:{class}</code> to apply the <code>{class}</code> utility at only medium screen sizes and above.</p>`,
        component: <BreakpointsMediaQueries />,
    },
]

const Typography = () => {
    return <DemoLayout header={demoHeader} demos={demos} />
}

export default Typography

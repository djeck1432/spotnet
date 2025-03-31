import React from 'react'
import Table from '@/components/ui/Table'

const { Tr, Th, Td, THead, TBody } = Table

const packages = [
    {
        name: '@floating-ui/react',
        url: 'https://github.com/floating-ui/floating-ui',
        license: 'MIT',
    },
    {
        name: '@fullcalendar/daygrid',
        url: 'https://github.com/fullcalendar/fullcalendar',
        license: 'MIT',
    },
    {
        name: '@fullcalendar/interaction',
        url: 'https://github.com/fullcalendar/fullcalendar',
        license: 'MIT',
    },
    {
        name: '@fullcalendar/react',
        url: 'https://github.com/fullcalendar/fullcalendar',
        license: 'MIT',
    },
    {
        name: '@fullcalendar/timegrid',
        url: 'https://github.com/fullcalendar/fullcalendar',
        license: 'MIT',
    },
    {
        name: '@react-icons/all-files',
        url: 'https://github.com/react-icons/react-icons',
        license: 'MIT',
    },
    {
        name: '@reduxjs/toolkit',
        url: 'https://github.com/reduxjs/redux-toolkit',
        license: 'MIT',
    },
    {
        name: '@tailwindcss/forms',
        url: 'https://github.com/tailwindlabs/tailwindcss-forms',
        license: 'MIT',
    },
    {
        name: '@tailwindcss/typography',
        url: 'https://github.com/tailwindlabs/tailwindcss-typography',
        license: 'MIT',
    },
    {
        name: '@tanstack/match-sorter-utils',
        url: 'https://github.com/tanstack/table',
        license: 'MIT',
    },
    {
        name: '@tanstack/react-table',
        url: 'https://github.com/tanstack/table',
        license: 'MIT',
    },
    {
        name: '@tanstack/react-virtual',
        url: 'https://github.com/TanStack/virtual',
        license: 'MIT',
    },
    {
        name: '@testing-library/jest-dom',
        url: 'https://github.com/testing-library/jest-dom',
        license: 'MIT',
    },
    {
        name: '@testing-library/react',
        url: 'https://github.com/testing-library/react-testing-library',
        license: 'MIT',
    },
    {
        name: '@testing-library/user-event',
        url: 'https://github.com/testing-library/user-event',
        license: 'MIT',
    },
    {
        name: '@visx/pattern',
        url: 'https://github.com/airbnb/visx',
        license: 'MIT',
    },
    {
        name: '@vitejs/plugin-react',
        url: 'https://github.com/vitejs/vite-plugin-react',
        license: 'MIT',
    },
    {
        name: 'apexcharts',
        url: 'https://github.com/apexcharts/apexcharts.js',
        license: 'MIT',
    },
    { name: 'axios', url: 'https://github.com/axios/axios', license: 'MIT' },
    {
        name: 'classnames',
        url: 'https://github.com/JedWatson/classnames',
        license: 'MIT',
    },
    { name: 'dayjs', url: 'https://github.com/iamkun/dayjs/', license: 'MIT' },
    { name: 'd3-fetch', url: 'https://github.com/d3/d3-fetch', license: 'ISC' },
    { name: 'd3-dsv', url: 'https://github.com/d3/d3-dsv', license: 'ISC' },
    { name: 'd3-scale', url: 'https://github.com/d3/d3-scale', license: 'ISC' },
    {
        name: 'formik',
        url: 'https://github.com/jaredpalmer/formik',
        license: 'Apache',
    },
    {
        name: 'framer-motion',
        url: 'https://github.com/framer/motion',
        license: 'MIT',
    },
    {
        name: 'history',
        url: 'https://github.com/remix-run/history',
        license: 'MIT',
    },
    {
        name: 'http-proxy-middleware',
        url: 'https://github.com/chimurai/http-proxy-middleware',
        license: 'MIT',
    },
    {
        name: 'i18next',
        url: 'https://github.com/i18next/i18next',
        license: 'MIT',
    },
    { name: 'lodash', url: 'https://github.com/lodash/lodash', license: 'MIT' },
    {
        name: 'postcss-import',
        url: 'https://github.com/postcss/postcss-import',
        license: 'MIT',
    },
    {
        name: 'react',
        url: 'https://github.com/facebook/react/',
        license: 'MIT',
    },
    {
        name: 'react-apexcharts',
        url: 'https://github.com/apexcharts/react-apexcharts',
        license: 'MIT',
    },
    {
        name: '@hello-pangea/dnd',
        url: 'https://github.com/hello-pangea/dnd',
        license: 'Apache',
    },
    {
        name: 'react-custom-scrollbars',
        url: 'https://github.com/malte-wessel/react-custom-scrollbars',
        license: 'MIT',
    },
    {
        name: 'react-dom',
        url: 'https://github.com/facebook/react',
        license: 'MIT',
    },
    {
        name: 'react-html-parser',
        url: 'https://github.com/remarkablemark/html-react-parser',
        license: 'MIT',
    },
    {
        name: 'react-i18next',
        url: 'https://github.com/i18next/react-i18next',
        license: 'MIT',
    },
    {
        name: 'react-icons',
        url: 'https://github.com/react-icons/react-icons',
        license: 'MIT',
    },
    {
        name: 'react-markdown',
        url: 'https://github.com/remarkjs/react-markdown',
        license: 'MIT',
    },
    {
        name: 'react-modal',
        url: 'https://github.com/reactjs/react-modal',
        license: 'MIT',
    },
    {
        name: 'react-number-format',
        url: 'https://github.com/s-yadav/react-number-format',
        license: 'MIT',
    },
    {
        name: 'react-portal',
        url: 'https://github.com/tajo/react-portal',
        license: 'MIT',
    },
    {
        name: 'react-quill-new',
        url: 'https://github.com/VaguelySerious/react-quill',
        license: 'MIT',
    },
    {
        name: 'react-redux',
        url: 'https://github.com/reduxjs/react-redux',
        license: 'MIT',
    },
    {
        name: 'react-resize-detector',
        url: 'https://github.com/maslianok/react-resize-detector',
        license: 'MIT',
    },
    {
        name: 'react-router-dom',
        url: 'https://github.com/remix-run/react-router',
        license: 'MIT',
    },
    {
        name: 'react-scroll',
        url: 'https://github.com/fisshy/react-scroll',
        license: 'MIT',
    },
    {
        name: 'react-select',
        url: 'https://github.com/JedWatson/react-select',
        license: 'MIT',
    },
    {
        name: 'react-simple-maps',
        url: 'https://github.com/zcreativelabs/react-simple-maps',
        license: 'MIT',
    },
    {
        name: 'react-syntax-highlighter',
        url: 'https://github.com/react-syntax-highlighter/react-syntax-highlighter',
        license: 'MIT',
    },
    {
        name: 'react-table',
        url: 'https://github.com/tanstack/table/tree/v7',
        license: 'MIT',
    },
    {
        name: 'react-tooltip',
        url: 'https://github.com/wwayne/react-tooltip',
        license: 'MIT',
    },
    {
        name: 'react-window',
        url: 'https://github.com/bvaughn/react-window',
        license: 'MIT',
    },
    { name: 'redux', url: 'https://github.com/reduxjs/redux', license: 'MIT' },
    {
        name: 'redux-persist',
        url: 'https://github.com/rt2zz/redux-persist',
        license: 'MIT',
    },
    {
        name: 'tailwind-safelist-generator',
        url: 'https://github.com/spatie/tailwind-safelist-generator',
        license: 'MIT',
    },
    {
        name: 'twin.macro',
        url: 'https://github.com/ben-rogerson/twin.macro',
        license: 'MIT',
    },
    {
        name: 'web-vitals',
        url: 'https://github.com/GoogleChrome/web-vitals',
        license: 'MIT',
    },
    { name: 'yup', url: 'https://github.com/jquense/yup', license: 'MIT' },
    {
        name: 'autoprefixer',
        url: 'https://github.com/postcss/autoprefixer',
        license: 'MIT',
    },
    {
        name: 'cross-env',
        url: 'https://github.com/kentcdodds/cross-env',
        license: 'MIT',
    },
    {
        name: 'delay-cli',
        url: 'https://github.com/sindresorhus/delay-cli',
        license: 'MIT',
    },
    {
        name: 'miragejs',
        url: 'https://github.com/miragejs/miragejs',
        license: 'MIT',
    },
    {
        name: 'postcss',
        url: 'https://github.com/postcss/postcss',
        license: 'MIT',
    },
    {
        name: 'postcss-cli',
        url: 'https://github.com/postcss/postcss-cli',
        license: 'MIT',
    },
    {
        name: 'postcss-import',
        url: 'https://github.com/postcss/postcss-import',
        license: 'MIT',
    },
    {
        name: 'postcss-nested',
        url: 'https://github.com/postcss/postcss-nested',
        license: 'MIT',
    },
    {
        name: 'postcss-preset-env',
        url: 'https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env',
        license: 'MIT',
    },
    {
        name: 'tailwindcss',
        url: 'https://github.com/tailwindlabs/tailwindcss',
        license: 'MIT',
    },
    {
        name: 'typescript',
        url: 'https://github.com/microsoft/TypeScript',
        license: 'MIT',
    },
    {
        name: 'vite',
        url: 'https://github.com/vitejs/vite',
        license: 'MIT',
    },
    {
        name: 'vite-plugin-dynamic-import',
        url: 'https://github.com/vite-plugin/vite-plugin-dynamic-import',
        license: 'MIT',
    },
]

const Credit = () => {
    return (
        <Table className="demo-api-table">
            <THead>
                <Tr>
                    <Th>Name</Th>
                    <Th>URL</Th>
                    <Th>License</Th>
                </Tr>
            </THead>
            <TBody>
                {packages.map((item) => (
                    <Tr key={`row-${item.name}`}>
                        <Td>{item.name}</Td>
                        <Td>
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {item.url}
                            </a>
                        </Td>
                        <Td>{item.license}</Td>
                    </Tr>
                ))}
            </TBody>
        </Table>
    )
}

export default Credit

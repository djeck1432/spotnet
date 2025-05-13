import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'

const MockApi = () => {
    return (
        <>
            <p>
                A mock API is an API that responds data just like a real API to
                do, however it is just imitating the data & response. This is
                extremely useful in many cases, like when the API you rely on
                isn&apos;t fully developed yet, or simulate API calls on unit
                testing.
            </p>
            <p>
                Elstar uses{' '}
                <a
                    href="https://miragejs.com/"
                    target="_blank"
                    rel="noreferrer"
                >
                    miragejs
                </a>{' '}
                for mocking API calls, all the api interaction in our demo are
                work under miragejs.
            </p>
            <div className="mt-10" id="disableMockApi">
                <h5>Disabled mock api</h5>
                <p className="mt-1">
                    Mock api was enabled by default in our{' '}
                    <strong>starter-kit</strong>, you can turn in on via setting{' '}
                    <code>enableMock</code> field to false in{' '}
                    <code>src/configs/app.config.ts</code> to turn off the mock
                    api.
                </p>
                <SyntaxHighlighter language="ts">{`const appConfig = {
    ...,
    enableMock: false
}`}</SyntaxHighlighter>
            </div>
            <div className="mt-10" id="usingMockApi">
                <h5>Using mock api</h5>
                <p className="mt-1">
                    If you have intent to use mock api, you can follow the steps
                    below to create a fake db data & api
                </p>
                <ol>
                    <li>
                        <strong>Setup</strong>
                        <p className="mt-1">
                            Visit <code>src/mock/index.ts</code>, and here is
                            the overall configuration of mirage
                        </p>
                        <SyntaxHighlighter language="ts">{`export default function mockServer({ environment = 'test' }) {
    return createServer({
        environment,
        seeds(server) {
            server.db.loadData({
                ...
            })
        },
        routes() {
            ...
        },
    })
}`}</SyntaxHighlighter>
                    </li>
                    <li>
                        <strong>Add static data</strong>
                        <p className="mt-1">
                            Now we can add some data to the fake db
                        </p>
                        <SyntaxHighlighter language="ts">{`return createServer({
        environment,
        seeds(server) {
            server.db.loadData({
                usersData: [
                    {
                        id: '1',
                        name: 'Carolyn Perkins',
                    },
                    {
                        id: '2',
                        name: 'Terrance Moreno',
                    },
                    {
                        id: '3',
                        name: 'Ron Vargas',
                    },
                ]
            })
        },
        ...
    })
}`}</SyntaxHighlighter>
                    </li>
                    <li>
                        <strong>Create mock api</strong>
                        <p className="mt-1">Created a mock api under route</p>
                        <SyntaxHighlighter language="ts">{`return createServer({
        ...
        routes() {
            this.get('api/getUsers', schema => schema.db.usersData)
        },
})`}</SyntaxHighlighter>
                    </li>
                </ol>
            </div>
            <div>
                <p>
                    And now you can make request to this api & get the static
                    data just setted above as response
                </p>
                <SyntaxHighlighter language="ts">{`// service
import ApiService from "./ApiService"

type GetUserResponse = {
    id: string
    name: string
    email: string
}[]

export async function apiGetUsers () {
    return ApiService.fetchData<GetUserResponse>({
        url: '/api/getUsers',
        method: 'get'
    })
}`}</SyntaxHighlighter>
                <SyntaxHighlighter language="ts">{`// component
import { useEffect } from 'react'
import { apiGetUsers } from './YourService.ts'

const YourComponent = () => {

    const fetchData = async () => {
        try {
            const resp = await apiGetUsers()
            console.log(resp.data)
        } catch (errors) {
            ...handle errors
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        ...
    )
}`}</SyntaxHighlighter>
            </div>
        </>
    )
}

export default MockApi

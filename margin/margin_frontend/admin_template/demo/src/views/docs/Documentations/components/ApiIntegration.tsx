import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'
import Alert from '@/components/ui/Alert'

const ApiIntegration = () => {
    return (
        <>
            <p>Follow the steps below to make backend api linkage working.</p>
            <ol>
                <li>
                    <p>
                        Create a new service file specific to your feature or
                        module. For example, if you are working on user
                        management, create a file named{' '}
                        <code>UserManagementService.ts</code> in the services
                        directory.
                    </p>
                </li>
                <li>
                    <p>
                        Inside the service file, declare an asynchronous
                        function that will handle the API request. This function
                        should use the
                        <code>ApiService.fetchData</code> method and accept two
                        generic types: Response and Request along with
                        <a
                            href="https://axios-http.com/docs/req_config"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Axios config
                        </a>
                        as parameter. It is recommended to specify these types
                        while creating a new service. You can either directly
                        pass the types to the
                        <code>ApiService.fetchData</code> method. Here is an
                        example:
                    </p>
                    <SyntaxHighlighter language="ts">{`type MyApiResponse = {
    someResponseData: string
    someResponseData2: boolean
}

type MyApiRequest = {
    someRequestData: string
}

export async function myApi (data) {
    return ApiService.fetchData<MyApiResponse,MyApiRequest>({
        url: '/my-api-url',
        method: 'post',
        data
    })
}
...`}</SyntaxHighlighter>
                    <p>or inherit them from the upper level:</p>
                    <SyntaxHighlighter language="ts">{`import ApiService from "./ApiService"

export async function myApi<TResponse, TRequest>(data) {
    return ApiService.fetchData<TResponse, TRequest>({
        url: '/my-api-url',
        method: 'post',
        data
    })
}
...`}</SyntaxHighlighter>
                </li>
                <li>
                    <p>And now you can hook up this API in your component</p>
                    <SyntaxHighlighter language="tsx">{`
type MyApiResponse = {
    someResponseData: string
    someResponseData2: boolean
}

type MyApiRequest = {
    someRequestData: string
}

import { myApi } from './MyService.ts'

const MyComponent = props => {

    const fetchData = async () => {
        const reqeustParam = { key: 'value'}
        try {
            const resp = await myApi<MyApiResponse, MyApiRequest>(reqeustParam)
            if (resp.data) {
                ...do something
            }
        } catch (errors) {
            ...handle errors
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
    ...
)`}</SyntaxHighlighter>
                </li>
                <li>
                    <p>
                        You can also use this service with{' '}
                        <code>createAsyncThunk</code>
                    </p>
                    <SyntaxHighlighter language="ts">{`import { createSlice } from '@reduxjs/toolkit'
import { myApi } from './MyService.ts'

type RequestParam = {
    someRequestData: string
}

export const getApiData = createAsyncThunk('sliceName/getApiData',async (data: RequestParam) => {
    const response = await myApi(data)
    return response.data
})

const mySlice = createSlice({
    ...
    extraReducers: (builder) => {
        builder
            .addCase(getApiData.fulfilled, (state, action) => {
                ...
            })
    },
})

export const { someActionFromYourSlice } = yourSlice.actions

export default yourSlice.reducer`}</SyntaxHighlighter>
                </li>
            </ol>
            <Alert showIcon type="info" title="Note:">
                If you want to connect API with your dev server, please change{' '}
                <code>enableMock</code> to <code>false</code> in{' '}
                <code>src/configs/app.config.ts</code>
            </Alert>
            <div className="mt-10" id="proxying">
                <h5>Proxying</h5>
                <p className="mt-1">
                    Developer often consume API from different servers than the
                    frontend application, there are complications that arise as
                    a result of requests being sent across both servers, here is
                    some way to setting up a proxy server.
                </p>
                <ul>
                    <li>
                        <strong>Add proxy package.json</strong>
                        <p className="mt-1">
                            A simple & quick solution to proxying a server
                        </p>
                        <SyntaxHighlighter language="ts">{`"proxy": "http:yourDevDomain.com"`}</SyntaxHighlighter>
                    </li>
                    <li>
                        <strong>Manually setup</strong>
                        <p className="mt-1">
                            You can choose to setup with{' '}
                            <code>vite.config.ts</code> for more flexible
                            configuration.
                        </p>
                        <SyntaxHighlighter language="ts">{`export default defineConfig({
    plugins: ...,
    server: {
        proxy: {
            '/api': {
                // config the target url based on your backend server
                target: 'http:yourDevDomain.com',
                changeOrigin: true,
                secure: false,
            }
        }
    }
})`}</SyntaxHighlighter>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default ApiIntegration

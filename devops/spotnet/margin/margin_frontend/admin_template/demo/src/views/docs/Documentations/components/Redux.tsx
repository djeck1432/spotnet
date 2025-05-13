import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'

const ReduxToolkit = () => {
    return (
        <>
            <p>
                <a
                    href="https://redux.js.org/"
                    target="_blank"
                    rel="noreferrer"
                >
                    Redux
                </a>{' '}
                is a popular application state management solution that can be
                integrated with front-end frameworks like React, it allows you
                to write scalable apps with maintainable codebases, however,
                using redux requires a lot of boilerplate code. To reduce the
                boilerplate codes and facilitate easier functionalities,{' '}
                <a
                    href="https://redux-toolkit.js.org/"
                    target="_blank"
                    rel="noreferrer"
                >
                    Redux toolkit (RTK)
                </a>{' '}
                is a better option, it comes with comes with built in Redux
                Thunk Middleware that use for asynchronous actions and standard
                way to writing Redux logic.
            </p>
            <p>
                You can find out Redux store configurations under{' '}
                <code>src/store/</code>, there&apos;s also several slice
                globally used as following:
            </p>
            <ul>
                <li>
                    <strong>theme</strong>
                    <p className="m-0">
                        This state handle all theme related data.
                    </p>
                </li>
                <li>
                    <strong>auth</strong>
                    <p className="m-0">
                        This state handles the app authentication info.
                    </p>
                </li>
                <li>
                    <strong>locale</strong>
                    <p className="m-0">This state handles locale of the app.</p>
                </li>
                <li>
                    <strong>base</strong>
                    <p className="m-0">
                        This state is a general app state, you can place any
                        commonly used data here.
                    </p>
                </li>
            </ul>
            <p>
                We also{' '}
                <a
                    href="https://github.com/rt2zz/redux-persist"
                    target="_blank"
                    rel="noreferrer"
                >
                    redux-persist
                </a>{' '}
                to keep <code>auth</code>, <code>theme</code> &{' '}
                <code>locale</code> state alive in localStorage.
            </p>
            <div className="mt-10" id="codeSplitting">
                <h5>Code Splitting</h5>
                <p className="mt-1">
                    We have implemented reducer injection approaches in our code
                    base for a code splitting strategy, it can dynamically add
                    reducers to the store when needed. Here is some example code
                    for reducers registry:
                </p>
                <SyntaxHighlighter language="ts">{`// store/index.ts 
import { combineReducers } from '@reduxjs/toolkit'
import yourFirstSliceReducers, { YOUR_FIRST_SLICE_NAME } from './yourFirstSlice'
import yourSecondSliceReducers, { YOUR_SECOND_SLICE_NAME } from './yourSecondSlice'
import { useSelector } from 'react-redux'

import type { YourFirstSliceState } from './yourFirstSlice'
import type { YourSecondSliceState } from './yourSecondSlice'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '@/store'

const reducer = combineReducers({
    yourFirstStateKeyName: yourFirstSliceReducers,
    yourSecondStateKeyName: yourSecondSliceReducers
})

// create useAppSelector hook combining RootState & your new added state
export const useAppSelector: TypedUseSelectorHook<
    RootState & {
        [YOUR_FIRST_SLICE_NAME]: {
            yourFirstStateKeyName: YourFirstSliceState
        },
        [YOUR_SECOND_SLICE_NAME]: {
            yourSecondStateKeyName: YourSecondSliceState
        }
    }
> = useSelector

export * from './yourFirstSlice'
export * from './yourSecondSlice'
export { useAppDispatch } from '@/store'

export default reducer
`}</SyntaxHighlighter>
            </div>
            <p>
                And then you can expose them to your components (we prefer the
                entry of your view component)
            </p>
            <SyntaxHighlighter language="tsx">{`import reducer, {
    someActionFromYourSlice,
    useAppDispatch,
    useAppSelector,
} from './store'
import { injectReducer } from '@/store'

injectReducer('yourReducerName', reducer)

const YourComponent = () => {

	const dispatch = useAppDispatch()

	// Use the useAppSelector hook to access the store state.
	const someStateFromYourSlice = useAppSelector((state) => state.yourReducerName.yourFirstStateKeyName.someState)

	useEffect(() => {
		// Use useAppDispatch hook to dispatch an action.
		dispatch(someActionFromYourSlice())
	}, [])

	return (
		<>{someStateFromYourSlice}</>
	)
}`}</SyntaxHighlighter>
            <div className="mt-10" id="creatingNewSlice">
                <h5>Creating New Slice</h5>
                <p className="mt-1">
                    Slice is a collection of reducer logic and actions for a
                    single feature, hence we sugguest to place slice file under
                    your features module folder for better logic scoping. Here
                    is a basic example of a slice.
                </p>
                <SyntaxHighlighter language="ts">{`import { createSlice } from '@reduxjs/toolkit'

export type SliceState = {
    someState: string
}

const initialState: SliceState = {
    someState: ''
}

export const SLICE_NAME = 'yourSliceName';

const yourSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {}
})

export default yourSlice.reducer`}</SyntaxHighlighter>
            </div>
            <div className="mt-10" id="creatingReduces">
                <h5>Creating a reducer</h5>
                <p className="mt-1">
                    You can define your reducers in slice as following code:
                </p>
                <SyntaxHighlighter language="ts">{`import { createSlice } from '@reduxjs/toolkit'

export type SliceState = {
    someState: string
}

const initialState: SliceState = {
    someState: ''
}

export const SLICE_NAME = 'yourSliceName';

const yourSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        someActionFromYourSlice: (state, action) => {
            state.someState = action.payload
        },
    }
})

export default yourSlice.reducer`}</SyntaxHighlighter>
            </div>
            <div className="mt-10" id="asyncRequestsWithCreateAsyncThunk">
                <h5>Async Requests with createAsyncThunk</h5>
                <p className="mt-1">
                    You can also make an API request with{' '}
                    <code>createAsyncThunk</code> via extraReducers
                </p>
                <SyntaxHighlighter language="ts">{`import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { someService } from '@/services/SomeService'

export type SliceState = {
    someState: string
    loading: boolean
}

type ApiResponse = {
    ...
}

type ApiRequest = {
    ...
}

export const SLICE_NAME = 'yourSliceName';

export const getApiData = createAsyncThunk(SLICE_NAME + '/getApiData',async (data: ApiRequest) => {
    // assume someService required reesponse & require type as generic
    const response = await someService<ApiResponse, ApiRequest>(data)
    return response.data
})

const initialState: SliceState = {
    someState: ''
    loading: false
}

const yourSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        someActionFromYourSlice: (state, action) => {
            state.someState = action.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getApiData.fulfilled, (state, action) => {
            state.someState = action.payload.someString
            state.loading = false
        })
        .addCase(getApiData.pending, (state) => {
            state.loading = true
        })
        .addCase(getApiData.rejected, (state) => {
            state.loading = false
        })
    },
})

export const { someActionFromYourSlice } = yourSlice.actions

export default yourSlice.reducer`}</SyntaxHighlighter>
            </div>
            <p>
                You can also study the{' '}
                <a
                    href="https://redux-toolkit.js.org/"
                    target="_blank"
                    rel="noreferrer"
                >
                    redux-toolkit
                </a>{' '}
                documentation to better understand if you are not familiar
                redux-toolkit.{' '}
            </p>
            <div className="mt-10" id="rtkQuery">
                <h5>RTK Query</h5>
                <p className="mt-1">
                    RTK Query is an exceptionally robust data fetching and
                    caching tool along with Redux toolkit. In Elstar, we have
                    further enhanced its functionality by encapsulating a
                    pre-configured RTK Query setup within the{' '}
                    <code>src/service/RtkQueryService.ts</code>. If you prefer
                    not to employ the useEffect hook for data fetching, you have
                    the option to utilize the RtkQueryService and create an API
                    instance within your slice.
                </p>
                <p>
                    Below is a simple example to demonstrate the implementation:
                </p>
                <SyntaxHighlighter language="ts">{`// yourSlice.ts
import { createSlice } from '@reduxjs/toolkit'
import RtkQueryService from '@/services/RtkQueryService';

export type SliceState = {
    someState: string
}

type GetUserApiResponse = {
    ...
}

const initialState: SliceState = {
    someState: ''
}

export const SLICE_NAME = 'yourSliceName';

const getUserApi = RtkQueryService.injectEndpoints({
    endpoints: (build) => ({
        getUser: build.query<GetUserApiResponse, void>({
            query: () => (
                { 
                    // Specify the URL for the endpoint
                    url: '/crm/calendar', 
                    // Specify the method for the endpoint (GET, POST, PUT, etc.)
                    method: 'GET'
                }
            ),
        }),
    }),
}) 

const yourSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {}
})

export const { useGetUserQuery } = getUserApi

export default yourSlice.reducer`}</SyntaxHighlighter>
                <SyntaxHighlighter language="ts">{`// YourComponent.tsx
import reducer, {
    useGetUserQuery 
} from './store'
import { injectReducer } from '@/store'

injectReducer('yourReducerName', reducer)

const YourComponent = () => {

	const { data, error, isLoading } = useGetUserQuery();

	return (
		<>
			{
				error && 'there was an error'
			}
			{
				isLoading && 'loading...'
			}
			{
				(data && !error && !isLoading) && <h1>data</h1>
			}
		</>
	)
}`}</SyntaxHighlighter>
                <p>
                    For more detailed information and additional examples, we
                    recommend visiting the official RTK Query documentation site
                    at{' '}
                    <a
                        href="https://redux-toolkit.js.org/rtk-query/overview"
                        target="_blank"
                        rel="noreferrer"
                    >
                        https://redux-toolkit.js.org/rtk-query/overview
                    </a>
                </p>
            </div>
        </>
    )
}

export default ReduxToolkit

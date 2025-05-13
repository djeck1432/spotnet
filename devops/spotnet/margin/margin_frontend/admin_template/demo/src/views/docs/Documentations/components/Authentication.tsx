import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'
import DemoComponentApi from '@/components/docs/DemoComponentApi'
import type { CSSProperties } from 'react'

function range(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

const Authentication = () => {
    return (
        <>
            <p>
                Elstar provides an implementation for JWT authorization that
                allows you to quickly link up your backend services.
            </p>
            <p>
                We are using <code>localStorage</code> & Redux to store
                authentication info. As we mentioned in our{' '}
                <strong>Redux guide</strong>, we use{' '}
                <a
                    href="https://github.com/rt2zz/redux-persist"
                    target="_blank"
                    rel="noreferrer"
                >
                    redux-persist
                </a>{' '}
                to maintain localStorage synchronize with some of our Redux
                state.
            </p>
            <div className="mt-10" id="useAuth">
                <h5>useAuth hook</h5>
                <p>
                    We have created a hook that returns all the necessary method
                    you might need to authenticate a user like{' '}
                    <strong>signIn</strong>, <strong>signOut</strong>,{' '}
                    <strong>signUp</strong> etc
                </p>
            </div>
            <DemoComponentApi
                hideApiTitle
                keyText="properties"
                api={[
                    {
                        api: [
                            {
                                propName: 'authenticated',
                                type: `<code>boolean</code>`,
                                default: `-`,
                                desc: 'A state that define user whether authenticated, it will be true when token state has value & signedIn state is true in redux.',
                            },
                            {
                                propName: 'signIn',
                                type: `<code>(values: {userName: string, password: string}) => Promise<{status: 'success' | 'failed', message: string}></code>`,
                                default: `-`,
                                desc: `Function to sign in user.`,
                            },
                            {
                                propName: 'signUp',
                                type: `<code>(values: {userName: string, email: string, password: string}) => Promise<{status: 'success' | 'failed', message: string}></code>`,
                                default: `-`,
                                desc: `Function to sign up user.`,
                            },
                            {
                                propName: 'signOut',
                                type: `<code>() => void</code>`,
                                default: `-`,
                                desc: `Function to sign out user.`,
                            },
                        ],
                    },
                ]}
            />

            <p>
                Let&apos;s take a look at the signIn logic implementation in the
                useAuth
            </p>

            <SyntaxHighlighter language="ts">{`import { apiSignIn, apiSignOut } from '@/services/AuthService'
...
const signIn = async (values: SignInCredential) => {
    try {
        // fetching the signIn api from AuthService
        const resp = await apiSignIn(values)
        if (resp.data) {
            // Assuming your api response return a token,
            const { token } = resp.data
            
            // Dispatch signInSuccess with token, 
            // it will set to the token state & change signedIn state to true in redux
            dispatch(signInSuccess(token))

            // You can also set the user info to redux here as well, 
            // if it comes along with your sign in api
            if(resp.data.user) {
                dispatch(setUser(resp.data.user || { 
                    avatar: '', 
                    userName: 'Anonymous', 
                    authority: ['USER'], 
                    email: ''
                }))
            }

            const redirectUrl = query.get(REDIRECT_URL_KEY)
            navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath)
            return {
                status: 'success',
                message: ''
            }
        }
    } catch (errors) {
        return {
            status: 'failed',
            message: errors?.response?.data?.message || errors.toString()
        }
    }
}`}</SyntaxHighlighter>

            <div className="mt-10" id="useAuth">
                <h5>AuthService</h5>
                <p>
                    We also created a series of default authentication services
                    under <code>src/services/AuthService.ts</code>, each service
                    method works coresponded <code>useAuth</code> fuction.
                </p>
                <SyntaxHighlighter language="ts">{`import ApiService from './ApiService';
import type {
    SignInCredential,
    SignUpCredential,
    ForgotPassword,
    ResetPassword,
    SignInResponse,
    SignUpResponse,
} from '@/@types/auth';

export async function apiSignIn(data: SignInCredential) {
    return ApiService.fetchData<SignInResponse>({
        url: '/sign-in',
        method: 'post',
        data,
    });
}

export async function apiSignUp(data: SignUpCredential) {
    return ApiService.fetchData<SignUpResponse>({
        url: '/sign-up',
        method: 'post',
        data,
    });
}

export async function apiSignOut() {
    return ApiService.fetchData({
        url: '/sign-out',
        method: 'post',
    });
}

...`}</SyntaxHighlighter>
            </div>
            <p>
                Here is an example for sign in implementation using useAuth
                hook:
            </p>
            <SyntaxHighlighter language="ts">{`import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import { FormItem, FormContainer } from '@/components/ui/Form';
import Alert from '@/components/ui/Alert';
import PasswordInput from '@/components/shared/PasswordInput';
import ActionLink from '@/components/shared/ActionLink';
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage';
import useAuth from '@/utils/hooks/useAuth';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

type SignInFormSchema = {
    userName: string;
    password: string;
};

const SignInForm = () => {

    const [message, setMessage] = useTimeOutMessage()

    const { signIn } = useAuth()

    const onSignIn = async (
        values: SignInFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { userName, password } = values;
        setSubmitting(true);

        const result = await signIn({ userName, password });

        if (result?.status === 'failed') {
            setMessage(result.message);
        }

        setSubmitting(false);
    };

    return (
        <Formik
            onSubmit={(values, { setSubmitting }) => {
                onSignIn(values, setSubmitting)
            }}
            ...
        >
        ...
    )
`}</SyntaxHighlighter>
            <div className="mt-10" id="overview">
                <h5>Remove default authenticate implementation</h5>
                <p>
                    If you feel the default Authenticate implementation
                    incompatible with your case, you can remove the code as
                    following
                </p>
            </div>
            <div className="mt-10" id="overview">
                <span>useAuth.ts</span>
                <SyntaxHighlighter
                    language="ts"
                    wrapLines={true}
                    showLineNumbers={true}
                    lineProps={(lineNumber) => {
                        const style: CSSProperties = { display: 'block' }
                        if (range(21, 27).includes(lineNumber)) {
                            style.backgroundColor = '#00ff002e'
                        } else if (
                            [...range(28, 53), ...[63]].includes(lineNumber)
                        ) {
                            style.backgroundColor = '#ff00001f'
                        }
                        return { style }
                    }}
                >{`
import { setUser, initialState, signInSuccess, signOutSuccess, useAppSelector, useAppDispatch } from '@/store'
import { apiSignIn, apiSignOut } from '@/services/AuthService'
import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useNavigate } from 'react-router-dom'
import useQuery from './useQuery'

function useAuth() {

    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const query = useQuery()

    const { signedIn } = useAppSelector((state) => state.auth.session)

    const signIn = async (values) => {
        dispatch(signInSuccess('exampleToken'))
        const redirectUrl = query.get(REDIRECT_URL_KEY)
        navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath)
        return {
            status: 'success',
            message: ''
        }
        try {
            const resp = await apiSignIn(values)
            if (resp.data) {
                const { token } = resp.data
                dispatch(signInSuccess(token))
                if(resp.data.user) {
                    dispatch(setUser(resp.data.user || { 
                        avatar: '', 
                        userName: 'Anonymous', 
                        authority: ['USER'], 
                        email: ''
                    }))
                }
                const redirectUrl = query.get(REDIRECT_URL_KEY)
                navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath)
                return {
                    status: 'success',
                    message: ''
                }
            }
        } catch (errors) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString()
            }
        }
    }

    const handleSignOut = ()  => {
        dispatch(signOutSuccess())
        dispatch(setUser(initialState))
        navigate(appConfig.unAuthenticatedEntryPath)
    }

    const signOut = async () => {
        await apiSignOut()
        handleSignOut()
    }
    
    return {
        authenticated: signedIn,
        signIn,
        signOut
    }
}

export default useAuth`}</SyntaxHighlighter>
            </div>
        </>
    )
}

export default Authentication

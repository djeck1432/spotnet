import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'

const FirebaseIntegration = () => {
    return (
        <>
            <p>
                Firebase is a platform developed by Google for creating mobile
                and web applications. It offers various tools and services such
                as authentication, real-time database, cloud storage, hosting,
                and more, which known as a backend as service.
            </p>
            <p>
                While our template doesn&apos;t have Firebase integration
                pre-built, we&apos;ve noticed a high demand from our customers
                for it. As a result, we&apos;ve put together a straightforward
                auth integration tutorial to help you seamlessly incorporate
                Firebase into the template.
            </p>
            <div className="mt-10" id="prerequisites">
                <h5>Prerequisites</h5>
                <ul className="mt-1">
                    <li>
                        <p>
                            A Firebase project created on the Firebase Console.
                        </p>
                        <ol>
                            <li>
                                Go to the{' '}
                                <a
                                    target="_new"
                                    href="https://console.firebase.google.com/"
                                >
                                    Firebase Console
                                </a>{' '}
                                and create a new project.
                            </li>
                            <li>
                                Once the project is created, click on the
                                &apos;Web&apos; option to add a web app to your
                                project.
                            </li>
                            <li>
                                Follow the instructions to register the app and
                                obtain the Firebase configuration object.
                            </li>
                        </ol>
                    </li>
                    <li>
                        <p>
                            Install Firebase SDK and its dependencies using npm.
                        </p>
                        <SyntaxHighlighter language="js">{`npm install firebase`}</SyntaxHighlighter>
                    </li>
                </ul>
            </div>
            <div className="mt-10" id="initialize-firebase">
                <h5>Initialize Firebase</h5>
                <ul>
                    <li>
                        <p>
                            In your template directory, go ahead and create a
                            file named <code>firebase.config.ts</code> within
                            the <code>/configs</code> directory. Put your
                            Firebase configuration details in this file (you can
                            find this information in your Firebase account).
                            It&apos;s best practice to store these values in a{' '}
                            <code>.env</code> file.
                        </p>
                        <SyntaxHighlighter language="js">{`const firebaseConfig = {
    apiKey: 'xxxxxxx',
    authDomain: 'yourApp.firebaseapp.com',
    databaseURL: 'https://yourApp.firebaseio.com',
    projectId: 'yourApp',
    storageBucket: 'yourApp.appspot.com',
    messagingSenderId: 'xxxxxxx',
    appId: 'xxxxxx',
    measurementId: 'xxxxx'
};

export default firebaseConfig`}</SyntaxHighlighter>
                    </li>
                    <li>
                        <p>
                            Create a Firebase entry in your <code>/src</code>{' '}
                            directory. You can do this by adding a file named
                            firebase.ts
                        </p>
                        <SyntaxHighlighter language="js">{`import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore/lite'
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
} from 'firebase/auth'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

import firebaseConfig from '@/configs/firebase.config'

const firebaseApp = initializeApp(firebaseConfig)

const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)
const currentUser = auth.currentUser

export {
    db,
    auth,
    currentUser,
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword
}`}</SyntaxHighlighter>
                    </li>
                </ul>
            </div>
            <div className="mt-10" id="integrating-firebase">
                <h5>Start integrating Firebase</h5>
                <ul>
                    <li>
                        <p>
                            Open <code>AuthService.ts</code> under{' '}
                            <code>/services</code> directory, & paste the
                            following code
                        </p>
                        <SyntaxHighlighter language="js">{`import ApiService from './ApiService'
import type {
    ForgotPassword,
    ResetPassword,
} from '@/@types/auth'

import {
    auth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
} from '@/firebase';

export async function apiSignIn ({email, password}: {email: string, password: string}) {
    return await signInWithEmailAndPassword(auth, email, password).then(user => user).catch(err => err);
}

export async function apiSignUp ({email, password}: {email: string, password: string}) {
    return createUserWithEmailAndPassword(auth, email, password).then(user => user).catch(err => err);  
}

export async function apiSignOut () {
    return await signOut(auth).then(user => user).catch(err => err);
}`}</SyntaxHighlighter>
                    </li>
                    <li>
                        <p>
                            As Firebase utilizes <code>email</code> rather than{' '}
                            <code>username</code> as a credential, you&apos;ll
                            need to make adjustments to the input and schema in{' '}
                            <code>SignInForm.tsx</code>,{' '}
                            <code>SignUpForm.tsx</code> &{' '}
                            <code>@types/auth.ts</code>. Below, you&apos;ll find
                            the updated code that you can use to replace them.
                        </p>
                        <strong>auth.ts</strong>
                        <SyntaxHighlighter language="js">{`export type SignInCredential = {
    email: string
    password: string
}

export type SignUpCredential = {
    email: string
    password: string
}`}</SyntaxHighlighter>
                        <strong>SignInForm.tsx</strong>
                        <SyntaxHighlighter language="js">{`type SignInFormSchema = {
    email: string
    password: string
    rememberMe: boolean
}

const validationSchema = Yup.object().shape({
    email: Yup.string().required('Please enter your email'),
    password: Yup.string().required('Please enter your password'),
    rememberMe: Yup.bool(),
})

const SignInForm = (props: SignInFormProps) => {
    ...

    const onSignIn = async (
        values: SignInFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { email, password } = values
        setSubmitting(true)

        const result = await signIn({ email, password })

        if (result?.status === 'failed') {
            setMessage(result.message)
        }

        setSubmitting(false)
    }

    return (
        <div className={className}>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <>{message}</>
                </Alert>
            )}
            <Formik
                initialValues={{
                    email: 'admin@example.com',
                    password: '123Qwe',
                    rememberMe: true,
                }}
                ...
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                label="User Name"
                                invalid={
                                    (errors.email &&
                                        touched.email) as boolean
                                }
                                errorMessage={errors.email}
                            >
                                <Field
                                    type="email"
                                    autoComplete="off"
                                    name="email"
                                    placeholder="Email"
                                    component={Input}
                                />
                            </FormItem>
                            ...
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}`}</SyntaxHighlighter>
                        <strong>SignUpForm.tsx</strong>
                        <SyntaxHighlighter language="js">{`type SignUpFormSchema = {
    password: string
    email: string
}

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email')
        .required('Please enter your email'),
    password: Yup.string().required('Please enter your password'),
    confirmPassword: Yup.string().oneOf(
        [Yup.ref('password')],
        'Your passwords do not match'
    ),
})

const SignUpForm = (props: SignUpFormProps) => {
    const { disableSubmit = false, className, signInUrl = '/sign-in' } = props

    const { signUp } = useAuth()

    const [message, setMessage] = useTimeOutMessage()

    const onSignUp = async (
        values: SignUpFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { password, email } = values
        setSubmitting(true)
        const result = await signUp({ password, email })

        if (result?.status === 'failed') {
            setMessage(result.message)
        }

        setSubmitting(false)
    }

    return (
        <div className={className}>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    {message}
                </Alert>
            )}
            <Formik
                initialValues={{
                    userName: 'admin1',
                    password: '123Qwe1',
                    confirmPassword: '123Qwe1',
                    email: 'test@testmail.com',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        onSignUp(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                label="Email"
                                invalid={errors.email && touched.email}
                                errorMessage={errors.email}
                            >
                                <Field
                                    type="email"
                                    autoComplete="off"
                                    name="email"
                                    placeholder="Email"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Password"
                                invalid={errors.password && touched.password}
                                errorMessage={errors.password}
                            >
                                <Field
                                    autoComplete="off"
                                    name="password"
                                    placeholder="Password"
                                    component={PasswordInput}
                                />
                            </FormItem>
                            <FormItem
                                label="Confirm Password"
                                invalid={
                                    errors.confirmPassword &&
                                    touched.confirmPassword
                                }
                                errorMessage={errors.confirmPassword}
                            >
                                <Field
                                    autoComplete="off"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    component={PasswordInput}
                                />
                            </FormItem>
                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                            >
                                {isSubmitting
                                    ? 'Creating Account...'
                                    : 'Sign Up'}
                            </Button>
                            <div className="mt-4 text-center">
                                <span>Already have an account? </span>
                                <ActionLink to={signInUrl}>Sign in</ActionLink>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}`}</SyntaxHighlighter>
                    </li>
                </ul>
            </div>
            <div className="mt-10" id="conclusion">
                <h5>Conclusion</h5>
                <p>
                    By following these steps, you have successfully integrated
                    Firebase SDK auth with to the template. You can leverage the
                    powerful features offered by Firebase to enhance the
                    functionality and user experience along with Elstar.
                </p>
                <p>
                    Make sure to refer to the{' '}
                    <a target="_new" href="https://firebase.google.com/docs">
                        Firebase documentation
                    </a>{' '}
                    for detailed information on using Firebase services in your
                    application
                </p>
            </div>
        </>
    )
}

export default FirebaseIntegration

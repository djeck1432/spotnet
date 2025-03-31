import SignUpForm from '@/views/auth/SignUp/SignUpForm'
import Cover from '@/components/layouts/AuthLayout/Cover'

const SignUpCover = () => {
    return (
        <Cover
            content={
                <>
                    <h3 className="mb-1">Sign Up</h3>
                    <p>And lets get started with your free trial</p>
                </>
            }
        >
            <SignUpForm disableSubmit={true} signInUrl="/auth/sign-in-cover" />
        </Cover>
    )
}

export default SignUpCover

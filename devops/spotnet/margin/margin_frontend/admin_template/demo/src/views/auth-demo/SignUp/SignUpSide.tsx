import SignUpForm from '@/views/auth/SignUp/SignUpForm'
import Side from '@/components/layouts/AuthLayout/Side'

const SignUpSide = () => {
    return (
        <Side
            content={
                <>
                    <h3 className="mb-1">Sign Up</h3>
                    <p>And lets get started with your free trial</p>
                </>
            }
        >
            <SignUpForm disableSubmit={true} signInUrl="/auth/sign-in-side" />
        </Side>
    )
}

export default SignUpSide

import SignInForm from '@/views/auth/SignIn/SignInForm'
import Side from '@/components/layouts/AuthLayout/Side'

const SignInSide = () => {
    return (
        <Side
            content={
                <>
                    <h3 className="mb-1">Welcome back!</h3>
                    <p>Please enter your credentials to sign in!</p>
                </>
            }
        >
            <SignInForm
                disableSubmit={true}
                signUpUrl="/auth/sign-up-side"
                forgotPasswordUrl="/auth/forgot-password-side"
            />
        </Side>
    )
}

export default SignInSide

import SignInForm from '@/views/auth/SignIn/SignInForm'
import Simple from '@/components/layouts/AuthLayout/Simple'

const SignInSimple = () => {
    return (
        <Simple
            content={
                <div className="mb-4">
                    <h3 className="mb-1">Welcome back!</h3>
                    <p>Please enter your credentials to sign in!</p>
                </div>
            }
        >
            <SignInForm
                disableSubmit={true}
                signUpUrl="/auth/sign-up-simple"
                forgotPasswordUrl="/auth/forgot-password-simple"
            />
        </Simple>
    )
}

export default SignInSimple

import ForgotPasswordForm from '@/views/auth/ForgotPassword/ForgotPasswordForm'
import Simple from '@/components/layouts/AuthLayout/Simple'

const ForgotPasswordSimple = () => {
    return (
        <Simple>
            <ForgotPasswordForm
                disableSubmit={true}
                signInUrl="/auth/sign-in-simple"
            />
        </Simple>
    )
}

export default ForgotPasswordSimple

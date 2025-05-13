import ResetPasswordForm from '@/views/auth/ResetPassword/ResetPasswordForm'
import Simple from '@/components/layouts/AuthLayout/Simple'

const ResetPasswordSimple = () => {
    return (
        <Simple>
            <ResetPasswordForm
                disableSubmit={true}
                signInUrl="/auth/sign-in-simple"
            />
        </Simple>
    )
}

export default ResetPasswordSimple

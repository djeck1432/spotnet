import ForgotPasswordForm from '@/views/auth/ForgotPassword/ForgotPasswordForm'
import Side from '@/components/layouts/AuthLayout/Side'

const ForgotPasswordCover = () => {
    return (
        <Side>
            <ForgotPasswordForm
                disableSubmit={true}
                signInUrl="/auth/sign-in-side"
            />
        </Side>
    )
}

export default ForgotPasswordCover

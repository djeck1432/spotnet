import ForgotPasswordForm from '@/views/auth/ForgotPassword/ForgotPasswordForm'
import Cover from '@/components/layouts/AuthLayout/Cover'

const ForgotPasswordCover = () => {
    return (
        <Cover>
            <ForgotPasswordForm
                disableSubmit={true}
                signInUrl="/auth/sign-in-cover"
            />
        </Cover>
    )
}

export default ForgotPasswordCover

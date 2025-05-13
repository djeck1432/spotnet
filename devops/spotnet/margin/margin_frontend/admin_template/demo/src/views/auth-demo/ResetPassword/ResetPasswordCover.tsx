import ResetPasswordForm from '@/views/auth/ResetPassword/ResetPasswordForm'
import Cover from '@/components/layouts/AuthLayout/Cover'

const ResetPasswordCover = () => {
    return (
        <Cover>
            <ResetPasswordForm
                disableSubmit={true}
                signInUrl="/auth/sign-in-cover"
            />
        </Cover>
    )
}

export default ResetPasswordCover

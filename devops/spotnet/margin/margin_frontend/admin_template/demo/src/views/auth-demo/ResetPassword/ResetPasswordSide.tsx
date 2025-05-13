import ResetPasswordForm from '@/views/auth/ResetPassword/ResetPasswordForm'
import Side from '@/components/layouts/AuthLayout/Side'

const ResetPasswordSide = () => {
    return (
        <Side>
            <ResetPasswordForm
                disableSubmit={true}
                signInUrl="/auth/sign-in-side"
            />
        </Side>
    )
}

export default ResetPasswordSide

import DoubleSidedImage from '@/components/shared/DoubleSidedImage'

const AccountReview = () => {
    return (
        <div className="text-center h-full flex flex-col justify-center">
            <DoubleSidedImage
                className="mb-6 mx-auto"
                src="/img/others/pending-approval.png"
                darkModeSrc="/img/others/pending-approval-dark.png"
                alt=""
            />
            <h4 className="mb-4">Account application proccessing</h4>
            <p>
                Your account application is currently under review & will be
                finalize shortly.
                <br />
                To fast track your account proccessing, you can try to contact
                our customer services.
            </p>
        </div>
    )
}

export default AccountReview

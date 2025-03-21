import { useState } from 'react'
import { Input } from '../core/input'
import { Card } from '../core/card'
import { Button } from '../core/button'


const ResetPasswordForm = () => {
    const [passwordVisible, setPasswordVisibility] = useState(false);
    const [newInput, setNewInput] = useState('');
    const [confirmInput, setConfirmInput] = useState('');

    const onSubmit = async () => {
        console.log('onSubmit');
    }

    const passwordInput = (label: string, onChange: (value: string) => void) => {
        return (
            <div className='flex flex-col'>
                <label>{label}</label>
                <div className='w-100 relative flex items-center  justify-center'>

                    <Input
                        className='w-100 pr-10'
                        type={passwordVisible ?'text': 'password'}
                        onChange={(e) => onChange(e.target.value)} />
                    <svg
                        onClick={() => setPasswordVisibility(!passwordVisible)}
                        className="shrink-0 size-3.5 absolute right-4 cursor-pointer" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path className="hs-password-active:hidden" d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                        <path className="hs-password-active:hidden" d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                        <path className="hs-password-active:hidden" d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                        <line className={passwordVisible? "hidden":''} x1="2" x2="22" y1="2" y2="22"></line>
                        <path className={!passwordVisible? "hidden":''} d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                        <circle className={!passwordVisible? "hidden":''} cx="12" cy="12" r="3"></circle>
                    </svg>
                </div>
            </div>
        )
    }

    return (
        <Card className='text-white flex gap-4 flex-col'>
            <h1 className='font-bold text-lg'>Set new Password</h1>
            <form action="" className='flex gap-2 flex-col' onSubmit={(e) => {e.preventDefault();onSubmit()}}>
                {passwordInput("Password", setNewInput)}
                {passwordInput("Confirm", setConfirmInput)}

                <div className='text-red-400 h-4'>
                    {(newInput !== confirmInput && confirmInput.length > 0) && "Your passwords do not match"}
                </div>

                <Button
                    variant={"outline"}
                    size={"md"}
                    type='submit'
                    disabled={(newInput !== confirmInput) || !newInput.length}
                    className='mt-4'
                >
                    Submit
                </Button>
            </form>
        </Card>
    )
}

export default ResetPasswordForm
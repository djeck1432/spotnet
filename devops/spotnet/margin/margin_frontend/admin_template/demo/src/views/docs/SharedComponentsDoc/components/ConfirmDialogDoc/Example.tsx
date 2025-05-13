import { useState } from 'react'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Radio from '@/components/ui/Radio'
import Button from '@/components/ui/Button'

type DialogTypeKey = 'Info' | 'Success' | 'Warning' | 'Danger'

type DialogType = Record<
    DialogTypeKey,
    {
        type: 'info' | 'success' | 'warning' | 'danger'
        title: string
        children: string
        cancelText: string
        confirmText: string
        confirmButtonColor: string
    }
>

const dialogType: DialogType = {
    Info: {
        type: 'info',
        title: 'Note',
        children: 'Just some information for you!',
        cancelText: 'Cancel',
        confirmText: 'Okay',
        confirmButtonColor: 'blue-600',
    },
    Success: {
        type: 'success',
        title: 'Complete!',
        children: 'Just some success message for you!',
        cancelText: 'Cancel',
        confirmText: 'All Good',
        confirmButtonColor: 'emerald-600',
    },
    Warning: {
        type: 'warning',
        title: 'Warning',
        children: 'Just some warning message for you!',
        cancelText: 'Cancel',
        confirmText: 'Understand',
        confirmButtonColor: 'amber-600',
    },
    Danger: {
        type: 'danger',
        title: 'Delete',
        children: 'Are you sure you wan to delete?',
        cancelText: 'Cancel',
        confirmText: 'Delete',
        confirmButtonColor: 'red-600',
    },
}

const Example = () => {
    const [selected, setSelected] = useState<DialogTypeKey>(
        Object.keys(dialogType)[0] as DialogTypeKey,
    )
    const [open, setOpen] = useState(false)

    const handleClose = () => {
        console.log('Close')
        setOpen(false)
    }

    const handleConfirm = () => {
        console.log('Confirm')
        setOpen(false)
    }

    return (
        <div className="flex flex-col gap-6">
            <Radio.Group value={selected} onChange={(val) => setSelected(val)}>
                {Object.keys(dialogType).map((value) => {
                    return (
                        <Radio key={value} value={value}>
                            {value}
                        </Radio>
                    )
                })}
            </Radio.Group>
            <div>
                <Button onClick={() => setOpen(true)}>Trigger</Button>
            </div>
            <ConfirmDialog
                isOpen={open}
                type={dialogType[selected].type}
                title={dialogType[selected].title}
                confirmButtonColor={dialogType[selected].confirmButtonColor}
                onClose={handleClose}
                onRequestClose={handleClose}
                onCancel={handleClose}
                onConfirm={handleConfirm}
            >
                <p>{dialogType[selected].children}</p>
            </ConfirmDialog>
        </div>
    )
}

export default Example

import { useRef } from 'react'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import {
    closeEditCustomerDetailDialog,
    updateProfileData,
    putCustomer,
    useAppDispatch,
    useAppSelector,
    Customer,
} from '../store'
import CustomerForm, { FormikRef, FormModel } from '@/views/crm/CustomerForm'
import cloneDeep from 'lodash/cloneDeep'
import dayjs from 'dayjs'

type DrawerFooterProps = {
    onSaveClick?: () => void
    onCancel?: () => void
}

const DrawerFooter = ({ onSaveClick, onCancel }: DrawerFooterProps) => {
    return (
        <div className="text-right w-full">
            <Button size="sm" className="mr-2" onClick={onCancel}>
                Cancel
            </Button>
            <Button size="sm" variant="solid" onClick={onSaveClick}>
                Save
            </Button>
        </div>
    )
}

const EditCustomerProfile = () => {
    const dispatch = useAppDispatch()

    const formikRef = useRef<FormikRef>(null)

    const dialogOpen = useAppSelector(
        (state) => state.crmCustomerDetails.data.editCustomerDetailDialog,
    )
    const customer = useAppSelector(
        (state) => state.crmCustomerDetails.data.profileData,
    )

    const onDrawerClose = () => {
        dispatch(closeEditCustomerDetailDialog())
    }

    const formSubmit = () => {
        formikRef.current?.submitForm()
    }

    const onFormSubmit = (values: FormModel) => {
        const clonedData = cloneDeep(customer)
        const {
            name,
            birthday,
            email,
            img,
            location,
            title,
            phoneNumber,
            facebook,
            twitter,
            pinterest,
            linkedIn,
        } = values

        const basicInfo = { name, email, img }
        const personalInfo = {
            location,
            title,
            birthday: dayjs(birthday).format('DD/MM/YYYY'),
            phoneNumber,
            facebook,
            twitter,
            pinterest,
            linkedIn,
        }
        clonedData.personalInfo = {
            ...clonedData.personalInfo,
            ...personalInfo,
        }
        const newData = { ...clonedData, ...basicInfo }
        dispatch(updateProfileData(newData))
        dispatch(putCustomer(newData as Customer))
        onDrawerClose()
    }

    return (
        <Drawer
            isOpen={dialogOpen}
            closable={false}
            bodyClass="p-0"
            footer={
                <DrawerFooter
                    onCancel={onDrawerClose}
                    onSaveClick={formSubmit}
                />
            }
            onClose={onDrawerClose}
            onRequestClose={onDrawerClose}
        >
            <CustomerForm
                ref={formikRef}
                customer={customer}
                onFormSubmit={onFormSubmit}
            />
        </Drawer>
    )
}

export default EditCustomerProfile

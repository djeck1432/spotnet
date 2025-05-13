import {
    updatePaymentMethodData,
    closeDeletePaymentMethodDialog,
    useAppDispatch,
    useAppSelector,
} from '../store'
import cloneDeep from 'lodash/cloneDeep'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

const DeletePaymentMethod = () => {
    const dispatch = useAppDispatch()
    const data = useAppSelector(
        (state) => state.crmCustomerDetails.data.paymentMethodData,
    )
    const dialogOpen = useAppSelector(
        (state) => state.crmCustomerDetails.data.deletePaymentMethodDialog,
    )
    const selectedCard = useAppSelector(
        (state) => state.crmCustomerDetails.data.selectedCard,
    )

    const onDelete = () => {
        let newData = cloneDeep(data) || []
        newData = newData.filter(
            (payment) => payment.last4Number !== selectedCard.last4Number,
        )
        dispatch(closeDeletePaymentMethodDialog())
        dispatch(updatePaymentMethodData(newData))
    }

    const onDialogClose = () => {
        dispatch(closeDeletePaymentMethodDialog())
    }

    return (
        <ConfirmDialog
            isOpen={dialogOpen}
            type="danger"
            title="Remove payment method"
            confirmButtonColor="red-600"
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            onCancel={onDialogClose}
            onConfirm={onDelete}
        >
            <p> Are you sure you want to remove this payment method? </p>
        </ConfirmDialog>
    )
}

export default DeletePaymentMethod

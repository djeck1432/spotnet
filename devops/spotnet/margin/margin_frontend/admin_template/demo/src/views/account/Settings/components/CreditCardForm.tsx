import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Tooltip from '@/components/ui/Tooltip'
import Checkbox from '@/components/ui/Checkbox'
import hooks from '@/components/ui/hooks'
import { Field, Form, Formik } from 'formik'
import { HiCreditCard, HiCalendar, HiInformationCircle } from 'react-icons/hi'
import FormCustomFormatInput from '@/components/shared/FormCustomFormatInput'
import FormPatternInput from '@/components/shared/FormPatternInput'
import * as Yup from 'yup'
import type { FieldProps } from 'formik'

export type CreditCardInfo = {
    cardId: string
    cardHolderName: string
    cardType: string
    expMonth: string
    expYear: string
    last4Number: string
    primary: boolean
}

export type CreditCardFormModel = {
    cardHolderName: string
    ccNumber: string
    cardExpiry: string
    code: string
    primary: boolean
}

type CreditCardFormProps = {
    card?: Partial<CreditCardInfo>
    type?: 'NEW' | 'EDIT' | ''
    onUpdate: (card: CreditCardInfo) => void
}

const { useUniqueId } = hooks

const validationSchema = Yup.object().shape({
    cardHolderName: Yup.string().required('Card holder name required'),
    ccNumber: Yup.string()
        .required('Credit card number required')
        .matches(
            /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
            'Invalid credit card number',
        ),
    cardExpiry: Yup.string()
        .required('Card holder name required')
        .matches(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/, 'Invalid Date'),
    code: Yup.string()
        .required()
        .matches(/^[0-9]{3}$/, 'Invalid CVV'),
    primary: Yup.bool(),
})

function limit(val: string, max: string) {
    if (val.length === 1 && val[0] > max[0]) {
        val = '0' + val
    }

    if (val.length === 2) {
        if (Number(val) === 0) {
            val = '01'
        } else if (val > max) {
            val = max
        }
    }

    return val
}

function cardExpiryFormat(val: string) {
    const month = limit(val.substring(0, 2), '12')
    const date = limit(val.substring(2, 4), '31')

    return month + (date.length ? '/' + date : '')
}

const CreditCardForm = ({ card, type, onUpdate }: CreditCardFormProps) => {
    const newId = useUniqueId('cc-')

    const handleUpdate = (values: CreditCardFormModel) => {
        const { cardHolderName, ccNumber, cardExpiry, primary } = values
        if (card) {
            const { cardType, cardId } = card
            let updatedCard: CreditCardInfo = {
                cardId: '',
                cardType: '',
                last4Number: ccNumber.substr(ccNumber.length - 4),
                expYear: cardExpiry.substr(cardExpiry.length - 2),
                expMonth: cardExpiry.substring(0, 2),
                cardHolderName,
                primary,
            }

            if (type === 'EDIT') {
                updatedCard = {
                    ...updatedCard,
                    cardId: cardId as string,
                    cardType: cardType as string,
                }
            }

            if (type === 'NEW') {
                updatedCard = {
                    ...updatedCard,
                    cardId: newId,
                    cardType: 'VISA',
                }
            }
            console.log('updatedCard', updatedCard)
            onUpdate(updatedCard)
        }
    }

    return (
        <Formik<CreditCardFormModel>
            initialValues={{
                cardHolderName: card?.cardHolderName || '',
                ccNumber: '',
                cardExpiry:
                    (card?.expMonth as string) + (card?.expYear as string) ||
                    '',
                code: '',
                primary: card?.primary || false,
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                handleUpdate(values)
                setSubmitting(false)
            }}
        >
            {({ touched, errors }) => (
                <Form>
                    <FormContainer>
                        <FormItem
                            label="Card holder name"
                            invalid={
                                errors.cardHolderName && touched.cardHolderName
                            }
                            errorMessage={errors.cardHolderName}
                        >
                            <Field
                                type="text"
                                autoComplete="off"
                                name="cardHolderName"
                                component={Input}
                            />
                        </FormItem>
                        <FormItem
                            label="Credit Card Number"
                            invalid={errors.ccNumber && touched.ccNumber}
                            errorMessage={errors.ccNumber}
                        >
                            <Field name="ccNumber">
                                {({ field, form }: FieldProps) => {
                                    return (
                                        <FormPatternInput
                                            form={form}
                                            field={field}
                                            placeholder="•••• •••• •••• ••••"
                                            format="#### #### #### ####"
                                            inputSuffix={
                                                <HiCreditCard className="text-lg" />
                                            }
                                            onValueChange={(e) => {
                                                form.setFieldValue(
                                                    field.name,
                                                    e.value,
                                                )
                                            }}
                                        />
                                    )
                                }}
                            </Field>
                        </FormItem>
                        <div className="grid grid-cols-2 gap-4">
                            <FormItem
                                label="Expiration date"
                                invalid={
                                    errors.cardExpiry && touched.cardExpiry
                                }
                                errorMessage={errors.cardExpiry}
                            >
                                <Field name="cardExpiry">
                                    {({ field, form }: FieldProps) => {
                                        return (
                                            <FormCustomFormatInput
                                                form={form}
                                                field={field}
                                                placeholder="••/••"
                                                inputSuffix={
                                                    <HiCalendar className="text-lg" />
                                                }
                                                format={cardExpiryFormat}
                                                defaultValue={
                                                    form.values.cardExpiry
                                                }
                                                onValueChange={(e) => {
                                                    form.setFieldValue(
                                                        field.name,
                                                        e.value,
                                                    )
                                                }}
                                            />
                                        )
                                    }}
                                </Field>
                            </FormItem>
                            <FormItem
                                label="CVV"
                                invalid={errors.code && touched.code}
                                errorMessage={errors.code}
                            >
                                <Field name="code">
                                    {({ field, form }: FieldProps) => {
                                        return (
                                            <FormPatternInput
                                                form={form}
                                                field={field}
                                                placeholder="•••"
                                                format="###"
                                                inputPrefix={
                                                    <Tooltip title="The CVV/CVC code is located on the back of your credit/debit card on the right side of the white signature strip">
                                                        <HiInformationCircle className="cursor-pointer text-lg" />
                                                    </Tooltip>
                                                }
                                                onValueChange={(e) => {
                                                    form.setFieldValue(
                                                        field.name,
                                                        e.value,
                                                    )
                                                }}
                                            />
                                        )
                                    }}
                                </Field>
                            </FormItem>
                        </div>
                        <FormItem>
                            <Field name="primary" component={Checkbox}>
                                Set this card as primary
                            </Field>
                        </FormItem>
                        <FormItem className="mb-0 text-right">
                            <Button block variant="solid" type="submit">
                                Update
                            </Button>
                        </FormItem>
                    </FormContainer>
                </Form>
            )}
        </Formik>
    )
}

export default CreditCardForm

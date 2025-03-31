import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import InputGroup from '@/components/ui/InputGroup'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { FormNumericInput } from '@/components/shared'
import { Field, Form, Formik, FieldProps } from 'formik'
import { components, ControlProps, OptionProps } from 'react-select'
import { HiCheck } from 'react-icons/hi'
import { currencyList, paymentList, Currency, Payment } from './options.data'
import * as Yup from 'yup'

export type FormModel = {
    amount: number
    price: number
    cryptoSymbol: string
    rate: number
    payWith: string
}

export type BuyFormProps = {
    amount: number
    symbol: string
    onBuy: (
        values: FormModel,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => void
}

const { Control } = components

const MAX_BUY = 100000000

const validationSchema = Yup.object().shape({
    amount: Yup.number()
        .min(1, 'Min amount 1')
        .required('Please enter an amount'),
    price: Yup.number().required('Price cannot be 0'),
})

const CryptoSelectOption = ({
    innerProps,
    label,
    data,
    isSelected,
}: OptionProps<Currency>) => {
    return (
        <div
            className={`cursor-pointer flex items-center justify-between p-2 ${
                isSelected
                    ? 'bg-gray-100 dark:bg-gray-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
            {...innerProps}
        >
            <div className="flex items-center">
                <Avatar shape="circle" size={20} src={data.img} />
                <span className="ml-2 rtl:mr-2">{label}</span>
            </div>
            {isSelected && <HiCheck className="text-emerald-500 text-xl" />}
        </div>
    )
}

const CryptoControl = ({ children, ...props }: ControlProps<Currency>) => {
    const selected = props.getValue()[0]
    return (
        <Control {...props}>
            {selected && (
                <Avatar
                    className="ltr:ml-4 rtl:mr-4"
                    shape="circle"
                    size={18}
                    src={selected.img}
                />
            )}
            {children}
        </Control>
    )
}

const PaymentSelectOption = ({
    innerProps,
    label,
    data,
    isSelected,
}: OptionProps<Payment>) => {
    return (
        <div
            className={`cursor-pointer flex items-center justify-between p-2 ${
                isSelected
                    ? 'bg-gray-100 dark:bg-gray-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
            {...innerProps}
        >
            <div className="flex items-center">
                <img className="max-w-[35px]" src={data.img} alt="" />
                <span className="ml-2 rtl:mr-2">{label}</span>
            </div>
            {isSelected && <HiCheck className="text-emerald-500 text-xl" />}
        </div>
    )
}

const PaymentControl = ({ children, ...props }: ControlProps<Payment>) => {
    const selected = props.getValue()[0]
    return (
        <Control {...props}>
            {selected && (
                <img className="max-w-[35px] ml-2" src={selected.img} alt="" />
            )}
            {children}
        </Control>
    )
}

const BuyForm = (props: BuyFormProps) => {
    const { onBuy, amount, symbol } = props

    return (
        <div>
            <Formik
                initialValues={{
                    amount: amount,
                    price: 1,
                    cryptoSymbol: symbol,
                    rate: amount,
                    payWith: 'MASTER',
                }}
                enableReinitialize={true}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    onBuy(values, setSubmitting)
                }}
            >
                {({ values, touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                label="Amount"
                                invalid={errors.amount && touched.amount}
                                errorMessage={errors.amount}
                            >
                                <Field name="amount">
                                    {({ field, form }: FieldProps) => {
                                        return (
                                            <FormNumericInput
                                                thousandSeparator={true}
                                                form={form}
                                                field={field}
                                                placeholder="YOU PAY"
                                                decimalScale={2}
                                                value={field.value}
                                                inputSuffix={
                                                    <span className="font-semibold">
                                                        USD
                                                    </span>
                                                }
                                                onValueChange={(e) => {
                                                    let value = e.floatValue
                                                        ? e.floatValue
                                                        : 1
                                                    if (value > MAX_BUY) {
                                                        value = MAX_BUY
                                                    }
                                                    form.setFieldValue(
                                                        field.name,
                                                        value,
                                                    )
                                                    form.setFieldValue(
                                                        'price',
                                                        value /
                                                            form.values.rate,
                                                    )
                                                }}
                                            />
                                        )
                                    }}
                                </Field>
                            </FormItem>
                            <FormItem
                                label="Price"
                                invalid={errors.price && touched.price}
                                errorMessage={errors.price}
                            >
                                <InputGroup>
                                    <Field name="price">
                                        {({ field, form }: FieldProps) => {
                                            return (
                                                <FormNumericInput
                                                    readOnly
                                                    form={form}
                                                    field={field}
                                                    placeholder="YOU RECEIVE"
                                                    decimalScale={5}
                                                    value={field.value}
                                                    onValueChange={(e) => {
                                                        form.setFieldValue(
                                                            field.name,
                                                            e.floatValue,
                                                        )
                                                    }}
                                                />
                                            )
                                        }}
                                    </Field>
                                    <Field name="cryptoSymbol">
                                        {({ field, form }: FieldProps) => (
                                            <Select<Currency>
                                                className="min-w-[120px]"
                                                components={{
                                                    Option: CryptoSelectOption,
                                                    Control: CryptoControl,
                                                }}
                                                field={field}
                                                form={form}
                                                options={currencyList}
                                                value={currencyList.filter(
                                                    (currency) =>
                                                        currency.value ===
                                                        values.cryptoSymbol,
                                                )}
                                                onChange={(currency) => {
                                                    form.setFieldValue(
                                                        field.name,
                                                        currency?.value,
                                                    )
                                                    form.setFieldValue(
                                                        'rate',
                                                        currency?.rate,
                                                    )
                                                    form.setFieldValue(
                                                        'amount',
                                                        (currency?.rate as number) <
                                                            1
                                                            ? 1
                                                            : currency?.rate,
                                                    )
                                                }}
                                            />
                                        )}
                                    </Field>
                                </InputGroup>
                            </FormItem>
                            <FormItem
                                label="Pay With"
                                invalid={errors.payWith && touched.payWith}
                                errorMessage={errors.payWith}
                            >
                                <Field name="payWith">
                                    {({ field, form }: FieldProps) => (
                                        <Select<Payment>
                                            components={{
                                                Option: PaymentSelectOption,
                                                Control: PaymentControl,
                                            }}
                                            field={field}
                                            form={form}
                                            options={paymentList}
                                            value={paymentList.filter(
                                                (payment) =>
                                                    payment.value ===
                                                    values.payWith,
                                            )}
                                            onChange={(payment) => {
                                                form.setFieldValue(
                                                    field.name,
                                                    payment?.value,
                                                )
                                            }}
                                        />
                                    )}
                                </Field>
                            </FormItem>
                            <Button
                                block
                                variant="solid"
                                loading={isSubmitting}
                                type="submit"
                            >
                                Buy
                            </Button>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default BuyForm

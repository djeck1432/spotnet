import { PatternFormat, PatternFormatProps } from 'react-number-format'
import Input from '@/components/ui/Input'
import type { FieldInputProps } from 'formik'
import type { ReactNode, ComponentType } from 'react'
import type { InputProps } from '@/components/ui'

interface InputAffix {
    inputSuffix?: string | ReactNode
    inputPrefix?: string | ReactNode
}

interface NumberInputProps
    extends Omit<InputProps, 'prefix' | 'suffix'>,
        InputAffix {}

type NumberFormatInputProps = Omit<PatternFormatProps, 'form'> & {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    form?: any
    field?: FieldInputProps<unknown>
} & InputAffix

type FormPatternInputProps = NumberInputProps & NumberFormatInputProps

const NumberInput = ({
    inputSuffix,
    inputPrefix,
    ...props
}: NumberInputProps) => {
    return (
        <Input
            {...props}
            value={props.value}
            suffix={inputSuffix}
            prefix={inputPrefix}
        />
    )
}

const NumberFormatInput = ({
    onValueChange,
    form,
    field,
    ...rest
}: NumberFormatInputProps) => {
    return (
        <PatternFormat
            customInput={NumberInput as ComponentType}
            form={form}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            field={field}
            onBlur={field?.onBlur}
            onValueChange={onValueChange}
            {...rest}
        />
    )
}

const FormPatternInput = ({
    form,
    field,
    inputSuffix,
    inputPrefix,
    onValueChange,
    ...rest
}: FormPatternInputProps) => {
    return (
        <NumberFormatInput
            form={form}
            field={field}
            inputPrefix={inputPrefix}
            inputSuffix={inputSuffix}
            onValueChange={onValueChange}
            {...rest}
        />
    )
}

export default FormPatternInput

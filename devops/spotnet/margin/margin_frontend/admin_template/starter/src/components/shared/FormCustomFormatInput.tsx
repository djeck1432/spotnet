import { NumberFormatBase, NumberFormatBaseProps } from 'react-number-format'
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

type NumberFormatInputProps = Omit<NumberFormatBaseProps, 'form'> & {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    form?: any
    field?: FieldInputProps<unknown>
} & InputAffix

type NumberFormatBasePropsOptional = {
    format?: (value: string) => string
    removeFormatting?: (value: string) => string
    getCaretBoundary?: (formattedValue: string) => boolean[]
}

type FormCustomFormatInputProps = NumberInputProps &
    Omit<
        NumberFormatInputProps,
        'format' | 'removeFormatting' | 'getCaretBoundary'
    > &
    NumberFormatBasePropsOptional

function charIsNumber(char?: string) {
    return !!(char || '').match(/\d/)
}
function caretUnknownFormatBoundary(formattedValue: string) {
    const boundaryAry = Array.from({ length: formattedValue.length + 1 }).map(
        () => true,
    )

    for (let i = 0, ln = boundaryAry.length; i < ln; i++) {
        boundaryAry[i] = Boolean(
            charIsNumber(formattedValue[i]) ||
                charIsNumber(formattedValue[i - 1]),
        )
    }

    return boundaryAry
}

function defaultRemoveFormatting(value: string) {
    return value.replace(/[^0-9]/g, '')
}

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
        <NumberFormatBase
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

const FormCustomFormatInput = ({
    form,
    field,
    inputSuffix,
    inputPrefix,
    onValueChange,
    format = (value: string) => value,
    getCaretBoundary = caretUnknownFormatBoundary,
    removeFormatting = defaultRemoveFormatting,
    ...rest
}: FormCustomFormatInputProps) => {
    return (
        <NumberFormatInput
            form={form}
            field={field}
            inputPrefix={inputPrefix}
            inputSuffix={inputSuffix}
            format={format}
            getCaretBoundary={getCaretBoundary}
            removeFormatting={removeFormatting}
            onValueChange={onValueChange}
            {...rest}
        />
    )
}

export default FormCustomFormatInput

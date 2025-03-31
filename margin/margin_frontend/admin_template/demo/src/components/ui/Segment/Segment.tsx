import { forwardRef, useCallback, useMemo } from 'react'
import classNames from 'classnames'
import { SegmentContextProvider } from './context'
import useControllableState from '../hooks/useControllableState'
import { useForm } from '../Form/context'
import { useInputGroup } from '../InputGroup/context'
import { useConfig } from '../ConfigProvider'
import type { CommonProps, TypeAttributes } from '../@types/common'
import type { SegmentValue } from './context'

export interface SegmentProps extends CommonProps {
    defaultValue?: SegmentValue
    onChange?: (segmentValue: SegmentValue) => void
    selectionType?: 'single' | 'multiple'
    size?: TypeAttributes.Size
    value?: SegmentValue
}

const Segment = forwardRef<HTMLDivElement, SegmentProps>((props, ref) => {
    const {
        children,
        className,
        defaultValue,
        onChange = () => {
            // empty callback
        },
        selectionType = 'single',
        size,
        value: valueProp,
        ...rest
    } = props

    const formControl = useForm()
    const inputGroupControl = useInputGroup()
    const { controlSize } = useConfig()

    const [value, setValue] = useControllableState({
        prop: valueProp,
        defaultProp: defaultValue,
        onChange: onChange,
    })

    const onActive = useCallback(
        (itemValue: SegmentValue) => {
            setValue(itemValue)
        },
        [setValue],
    )

    const onDeactivate = useCallback(
        (itemValue: SegmentValue) => {
            if (selectionType === 'single') {
                setValue('')
            }

            if (selectionType === 'multiple') {
                setValue((prevValue = []) => {
                    return (prevValue as string[]).filter(
                        (value) => value !== itemValue,
                    )
                })
            }
        },
        [setValue, selectionType],
    )

    const segmentValue = useMemo(() => {
        if (selectionType === 'single') {
            if (value && typeof value === 'string') {
                return [value]
            }

            if (value && Array.isArray(value)) {
                return value
            }

            return []
        }

        if (selectionType === 'multiple') {
            return value ? value : []
        }
    }, [selectionType, value])

    return (
        <SegmentContextProvider
            value={{
                value: segmentValue,
                onActive: onActive,
                onDeactivate: onDeactivate,
                size:
                    size ||
                    inputGroupControl?.size ||
                    formControl?.size ||
                    controlSize,
                selectionType,
            }}
        >
            <div
                ref={ref}
                className={classNames('segment', className)}
                {...rest}
            >
                {children}
            </div>
        </SegmentContextProvider>
    )
})

Segment.displayName = 'Segment'

export default Segment

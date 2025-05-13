import type { RefObject } from 'react'

type CreateAmPmHandlerParams = {
    amLabel: string
    pmLabel: string
    onChange(value: string): void
    nextRef?: RefObject<HTMLInputElement>
}

export function createAmPmHandler({
    amLabel,
    pmLabel,
    onChange,
    nextRef,
}: CreateAmPmHandlerParams) {
    return (value: string, triggerShift: boolean) => {
        const testRegex = new RegExp(`(^(${amLabel}|${pmLabel})?$)`)
        const valLower = value.toLowerCase()

        if (valLower === amLabel || valLower === pmLabel) {
            onChange(valLower)
            triggerShift && nextRef?.current?.focus()
            triggerShift && nextRef?.current?.select()
            return
        }

        if (!testRegex.test(valLower)) {
            return
        }

        onChange(valLower)
    }
}

export type Modifiers = {
    disabled: boolean
    weekend: boolean
    selectedInRange: boolean
    selected: boolean
    inRange: boolean
    firstInRange: boolean
    lastInRange: boolean
    outOfMonth: boolean
}

export type DayKeydownPayload = {
    rowIndex: number
    cellIndex: number
    date: Date
}

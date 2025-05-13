import type { Ticket, Columns } from './types'
import { DraggableLocation } from '@hello-pangea/dnd'

export const reorder = <T>(list: T[], startIndex: number, endIndex: number) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
}

export const reorderQuoteMap = ({
    quoteMap,
    source,
    destination,
}: {
    quoteMap: Columns
    source: DraggableLocation
    destination: DraggableLocation
}) => {
    const current = [...quoteMap[source.droppableId]]
    const next = [...quoteMap[destination.droppableId]]
    const target = current[source.index]

    // moving to same list
    if (source.droppableId === destination.droppableId) {
        const reordered = reorder(current, source.index, destination.index)
        const result = {
            ...quoteMap,
            [source.droppableId]: reordered,
        }
        return {
            quoteMap: result,
        }
    }
    current.splice(source.index, 1)
    next.splice(destination.index, 0, target)
    const result = {
        ...quoteMap,
        [source.droppableId]: current,
        [destination.droppableId]: next,
    }

    return {
        quoteMap: result,
    }
}

export const createUID = (len: number) => {
    const buf = [],
        chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        charlen = chars.length,
        length = len || 32

    for (let i = 0; i < length; i++) {
        buf[i] = chars.charAt(Math.floor(Math.random() * charlen))
    }
    return buf.join('')
}

export const createCardObject = (): Ticket => {
    return {
        id: createUID(10),
        name: 'Untitled Card',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        cover: '',
        members: [],
        labels: ['Task'],
        attachments: [],
        comments: [],
        dueDate: null,
    }
}

export const taskLabelColors: Record<string, string> = {
    'Live issue': 'bg-rose-500',
    Task: 'bg-blue-500',
    Bug: 'bg-amber-400',
    'Low priority': 'bg-indigo-500',
}

export const labelList = ['Task', 'Bug', 'Live issue', 'Low priority']

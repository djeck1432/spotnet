import {
    HiOutlineInbox,
    HiOutlinePaperAirplane,
    HiOutlinePencil,
    HiOutlineStar,
    HiOutlineTrash,
} from 'react-icons/hi'
import type { JSX } from 'react'

type MenuBase = {
    value: string
    label: string
}

type Group = MenuBase & {
    icon: JSX.Element
}

type Label = MenuBase & {
    dotClass: string
}

export const groupList: Group[] = [
    { value: 'inbox', label: 'Inbox', icon: <HiOutlineInbox /> },
    { value: 'sentItem', label: 'Sent Item', icon: <HiOutlinePaperAirplane /> },
    { value: 'draft', label: 'Draft', icon: <HiOutlinePencil /> },
    { value: 'starred', label: 'Starred', icon: <HiOutlineStar /> },
    { value: 'deleted', label: 'Deleted', icon: <HiOutlineTrash /> },
]

export const labelList: Label[] = [
    { value: 'work', label: 'Work', dotClass: 'bg-blue-500' },
    { value: 'private', label: 'Private', dotClass: 'bg-indigo-500' },
    { value: 'important', label: 'Important', dotClass: 'bg-red-500' },
]

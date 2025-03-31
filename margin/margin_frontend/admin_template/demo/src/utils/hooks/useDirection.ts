import { useEffect } from 'react'
import { setDirection, useAppDispatch, useAppSelector } from '@/store'
import type { Direction } from '@/@types/theme'

function useDirection(): [
    direction: Direction,
    updateDirection: (dir: Direction) => void,
] {
    const direction = useAppSelector((state) => state.theme.direction)

    const dispatch = useAppDispatch()
    const updateDirection = (dir: Direction) => {
        dispatch(setDirection(dir))
    }

    useEffect(() => {
        if (window === undefined) {
            return
        }
        const root = window.document.documentElement
        root.setAttribute('dir', direction)
    }, [direction])

    return [direction, updateDirection]
}

export default useDirection

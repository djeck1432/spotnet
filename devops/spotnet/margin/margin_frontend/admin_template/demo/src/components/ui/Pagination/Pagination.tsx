import { useState, useEffect, useMemo, useCallback } from 'react'
import Pager from './Pagers'
import Prev from './Prev'
import Next from './Next'
import Total from './Total'
import classNames from 'classnames'
import { useConfig } from '../ConfigProvider'
import type { CommonProps } from '../@types/common'

export interface PaginationProps extends CommonProps {
    currentPage?: number
    displayTotal?: boolean
    onChange?: (pageNumber: number) => void
    pageSize?: number
    total?: number
}

const Pagination = (props: PaginationProps) => {
    const {
        className,
        currentPage = 1,
        displayTotal = false,
        onChange,
        pageSize = 1,
        total = 5,
    } = props

    const [paginationTotal, setPaginationTotal] = useState(total)
    const [internalPageSize, setInternalPageSize] = useState(pageSize)

    const { themeColor, primaryColorLevel } = useConfig()

    const getInternalPageCount = useMemo(() => {
        if (typeof paginationTotal === 'number') {
            return Math.ceil(paginationTotal / internalPageSize)
        }
        return null
    }, [paginationTotal, internalPageSize])

    const getValidCurrentPage = useCallback(
        (count: number | string) => {
            const value = parseInt(count as string, 10)
            const internalPageCount = getInternalPageCount
            let resetValue
            if (!internalPageCount) {
                if (isNaN(value) || value < 1) {
                    resetValue = 1
                }
            } else {
                if (value < 1) {
                    resetValue = 1
                }
                if (value > internalPageCount) {
                    resetValue = internalPageCount
                }
            }

            if (
                (resetValue === undefined && isNaN(value)) ||
                resetValue === 0
            ) {
                resetValue = 1
            }

            return resetValue === undefined ? value : resetValue
        },
        [getInternalPageCount],
    )

    const [internalCurrentPage, setInternalCurrentPage] = useState(
        currentPage ? getValidCurrentPage(currentPage) : 1,
    )

    useEffect(() => {
        if (total !== paginationTotal) {
            setPaginationTotal(total)
        }

        if (pageSize !== internalPageSize) {
            setInternalPageSize(pageSize)
        }

        if (currentPage !== internalCurrentPage) {
            setInternalCurrentPage(currentPage)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [total, pageSize, currentPage])

    const onPaginationChange = (val: number) => {
        setInternalCurrentPage(getValidCurrentPage(val))
        onChange?.(getValidCurrentPage(val))
    }

    const onPrev = useCallback(() => {
        const newPage = internalCurrentPage - 1
        setInternalCurrentPage(getValidCurrentPage(newPage))
        onChange?.(getValidCurrentPage(newPage))
    }, [onChange, internalCurrentPage, getValidCurrentPage])

    const onNext = useCallback(() => {
        const newPage = internalCurrentPage + 1
        setInternalCurrentPage(getValidCurrentPage(newPage))
        onChange?.(getValidCurrentPage(newPage))
    }, [onChange, internalCurrentPage, getValidCurrentPage])

    const pagerClass = {
        default: 'pagination-pager',
        inactive: 'pagination-pager-inactive',
        active: `text-${themeColor}-${primaryColorLevel} bg-${themeColor}-50 hover:bg-${themeColor}-50 dark:bg-${themeColor}-${primaryColorLevel} dark:text-gray-100`,
        disabled: 'pagination-pager-disabled',
    }

    const paginationClass = classNames('pagination', className)

    return (
        <div className={paginationClass}>
            {displayTotal && <Total total={total} />}
            <Prev
                currentPage={internalCurrentPage}
                pagerClass={pagerClass}
                onPrev={onPrev}
            />
            <Pager
                pageCount={getInternalPageCount as number}
                currentPage={internalCurrentPage}
                pagerClass={pagerClass}
                onChange={onPaginationChange}
            />
            <Next
                currentPage={internalCurrentPage}
                pageCount={getInternalPageCount as number}
                pagerClass={pagerClass}
                onNext={onNext}
            />
        </div>
    )
}

Pagination.displayName = 'Pagination'

export default Pagination

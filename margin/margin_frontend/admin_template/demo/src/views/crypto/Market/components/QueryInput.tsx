import { forwardRef } from 'react'
import Input from '@/components/ui/Input'
import { HiOutlineSearch } from 'react-icons/hi'
import debounce from 'lodash/debounce'

type QueryInputProps = {
    onInputChange: (value: string) => void
}

const QueryInput = forwardRef<HTMLInputElement, QueryInputProps>(
    ({ onInputChange }, ref) => {
        const debounceFn = debounce(handleDebounceFn, 500)

        function handleDebounceFn(val: string) {
            onInputChange?.(val)
        }

        const onEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
            debounceFn(e.target.value)
        }

        return (
            <Input
                ref={ref}
                className="lg:w-52"
                size="sm"
                placeholder="Search"
                prefix={<HiOutlineSearch className="text-lg" />}
                onChange={onEdit}
            />
        )
    },
)

QueryInput.displayName = 'QueryInput'

export default QueryInput

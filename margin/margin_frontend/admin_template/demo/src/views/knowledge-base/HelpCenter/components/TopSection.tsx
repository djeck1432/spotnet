import { useRef } from 'react'
import Container from '@/components/shared/Container'
import {
    setSearchCategory,
    queryArticles,
    setQueryText,
    setSearch,
    useAppDispatch,
    useAppSelector,
} from '../store'
import InputGroup from '@/components/ui/InputGroup'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { HiOutlineSearch } from 'react-icons/hi'

type Option = {
    label: string
    value: string
}

const categoryOptions: Option[] = [
    { label: 'All', value: '' },
    { label: 'Survey', value: 'survey' },
    { label: 'Themes', value: 'themes' },
    { label: 'Security', value: 'security' },
    { label: 'Integration', value: 'integration' },
    { label: 'Media', value: 'media' },
    { label: 'Analytic', value: 'analytic' },
    { label: 'Chatbot', value: 'chatbot' },
    { label: 'Commission', value: 'commission' },
]

const TopSection = () => {
    const dispatch = useAppDispatch()

    const searchCategory = useAppSelector(
        (state) => state.knowledgeBaseHelpCenter.data.searchCategory,
    )

    const searchInput = useRef<HTMLInputElement>(null)

    const onSearch = () => {
        if (searchInput.current) {
            const text = searchInput.current.value
            if (text) {
                dispatch(
                    queryArticles({
                        queryText: text,
                        category: searchCategory,
                    }),
                )
                dispatch(setQueryText(text))
                dispatch(setSearch(true))
            } else {
                toast.push(
                    <Notification
                        title="Please key in any text to search"
                        type="danger"
                    />,
                    {
                        placement: 'top-center',
                    },
                )
            }
        }
    }

    const onCategoryChange = (selected: Option | null) => {
        if (selected) {
            dispatch(setSearchCategory(selected.value))
        }
    }

    return (
        <section className="flex flex-col justify-center h-[200px] bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600">
            <Container className="flex flex-col items-center px-4">
                <h3 className="mb-6 text-center">
                    Get your question answered quickly here!
                </h3>
                <InputGroup className="mb-4 xl:min-w-[800px]">
                    <Input ref={searchInput} placeholder="Search..." />
                    <div className="min-w-[120px]">
                        <Select<Option>
                            isSearchable={false}
                            placeholder="Category"
                            options={categoryOptions}
                            value={categoryOptions.filter(
                                (option) => option.value === searchCategory,
                            )}
                            onChange={onCategoryChange}
                        />
                    </div>
                    <Button
                        icon={
                            <span className="mx-4">
                                <HiOutlineSearch />
                            </span>
                        }
                        onClick={onSearch}
                    />
                </InputGroup>
            </Container>
        </section>
    )
}

export default TopSection

import { useMemo } from 'react'
import Card from '@/components/ui/Card'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import { queryArticles, setSearch, useAppDispatch } from '../store'
import type { Category } from '../store'

const CategoryIcon = ({ type }: { type: string }) => {
    const iconTypeProps = useMemo(() => {
        return {
            src: `/img/thumbs/help-center-category-${type}.png`,
            darkModeSrc: `/img/thumbs/help-center-category-${type}-dark.png`,
        }
    }, [type])

    return <DoubleSidedImage {...iconTypeProps} alt="" />
}

const Categories = (props: { data: Category[] }) => {
    const { data = [] } = props

    const dispatch = useAppDispatch()

    const onCategoryClick = (name: string) => {
        dispatch(queryArticles({ queryText: '', category: name.toLowerCase() }))
        dispatch(setSearch(true))
    }

    return (
        <div className="grid lg:grid-cols-2 2xl:grid-cols-4 gap-4">
            {data.map((cat) => (
                <Card
                    key={cat.id}
                    clickable
                    onClick={() => onCategoryClick(cat.name)}
                >
                    <div className="mb-4 flex justify-center">
                        <CategoryIcon type={cat.id} />
                    </div>
                    <div className="text-center">
                        <h5 className="mb-1">{cat.name}</h5>
                        <strong>{cat.articleCounts} </strong>
                        <span>Articles</span>
                    </div>
                </Card>
            ))}
        </div>
    )
}

export default Categories

import { useEffect } from 'react'
import classNames from 'classnames'
import TextEllipsis from '@/components/shared/TextEllipsis'
import Loading from '@/components/shared/Loading'
import TextBlockSkeleton from '@/components/shared/loaders/TextBlockSkeleton'
import isLastChild from '@/utils/isLastChild'
import {
    getOthersArticle,
    useAppDispatch,
    useAppSelector,
    Article,
} from '../store'
import { useNavigate, useLocation } from 'react-router-dom'

type ArticleItemProps = {
    data?: Partial<Article>
    isLastChild?: boolean
}

const Loaders = ({ counts = 2 }: { counts?: number }) => {
    return (
        <div className="flex flex-col mt-6">
            {Array.from(new Array(counts), (_, i) => i + 1).map(
                (loader, index) => (
                    <div key={loader}>
                        <TextBlockSkeleton rowCount={2} />
                        {index !== counts - 1 && <hr className="my-6" />}
                    </div>
                ),
            )}
        </div>
    )
}

const ArticleItem = ({ data = {}, isLastChild }: ArticleItemProps) => {
    const navigate = useNavigate()

    const onArticleClick = (id = '') => {
        navigate(`/app/knowledge-base/article?id=${id}`)
    }

    return (
        <div
            className={classNames(
                'py-6 group cursor-pointer',
                !isLastChild && 'border-b border-gray-200 dark:border-gray-600',
            )}
            onClick={() => onArticleClick(data.id)}
        >
            <h6 className="mb-1 group-hover:underline !text-sm">
                {data.title}
            </h6>
            <p className="mb-1">
                <TextEllipsis text={data.content} maxTextCount={40} />
            </p>
            <span className="text-xs">Updated {data.updateTime}</span>
        </div>
    )
}

const OthersArticle = ({ articleId }: { articleId: string }) => {
    const dispatch = useAppDispatch()

    const { popularArticle, relatedArticle } = useAppSelector(
        (state) => state.knowledgeBaseArticle.data.othersArticle,
    )
    const loading = useAppSelector(
        (state) => state.knowledgeBaseArticle.data.otherLoading,
    )

    const { search } = useLocation()

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search])

    const fetchData = () => {
        if (articleId) {
            dispatch(getOthersArticle({ id: articleId }))
        }
    }

    return (
        <div className="lg:w-[400px] mt-6 ltr:lg:border-l rtl:lg:border-r border-gray-200 dark:border-gray-600 md:px-8">
            <div className="mb-8">
                <h4>Related Topics</h4>
                <Loading customLoader={<Loaders />} loading={loading}>
                    {relatedArticle?.map((article, index) => (
                        <ArticleItem
                            key={article.id}
                            data={article}
                            isLastChild={isLastChild(relatedArticle, index)}
                        />
                    ))}
                </Loading>
            </div>
            <div>
                <h4>Popular Topics</h4>
                <Loading
                    customLoader={<Loaders counts={4} />}
                    loading={loading}
                >
                    {popularArticle?.map((article, index) => (
                        <ArticleItem
                            key={article.id}
                            data={article}
                            isLastChild={isLastChild(popularArticle, index)}
                        />
                    ))}
                </Loading>
            </div>
        </div>
    )
}

export default OthersArticle

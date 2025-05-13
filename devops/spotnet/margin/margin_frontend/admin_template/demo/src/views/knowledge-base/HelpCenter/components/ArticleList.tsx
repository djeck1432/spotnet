import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import UsersAvatarGroup from '@/components/shared/UsersAvatarGroup'
import { HiOutlineClock, HiStar } from 'react-icons/hi'
import { useNavigate, createSearchParams } from 'react-router-dom'
import type { Article } from '../store'

const articleTagClass = (category: string) => {
    switch (category) {
        case 'themes':
            return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100'
        case 'survey':
            return 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100 dark:bg-blue-500/20 dark:text-blue-100'
        case 'security':
            return 'text-purple-500 bg-purple-100 dark:bg-purple-500/20 dark:text-purple-100'
        case 'integration':
            return 'text-pink-500 bg-pink-100 dark:bg-pink-500/20 dark:text-pink-100'
        case 'media':
            return 'text-cyan-500 bg-cyan-100 dark:bg-cyan-500/20 dark:text-cyan-100'
        case 'analytic':
            return 'text-orange-500 bg-orange-100 dark:bg-orange-500/20 dark:text-orange-100'
        case 'chatbot':
            return 'text-indigo-500 bg-indigo-100 dark:bg-indigo-500/20 dark:text-indigo-100'
        case 'commission':
            return 'text-teal-500 bg-teal-100 dark:bg-teal-500/20 dark:text-teal-100'
        default:
            return ''
    }
}

const ArticleList = (props: { data: Article[] }) => {
    const { data = [] } = props

    const navigate = useNavigate()

    const onArticleClick = (id: string) => {
        navigate(`/app/knowledge-base/article?${createSearchParams({ id })}`)
    }

    return (
        <>
            {data.map((article) => (
                <article key={article.id}>
                    <Card
                        clickable
                        className="group mb-4"
                        onClick={() => onArticleClick(article.id)}
                    >
                        <div className="px-8 py-3 relative">
                            {article.starred && (
                                <div className="absolute ltr:left-0 rtl:right-0">
                                    <div className="text-amber-500 p-0.5 rounded-full border border-amber-500 mt-1">
                                        <HiStar />
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center justify-between mb-2">
                                <h5 className="group-hover:underline">
                                    {article.title}
                                </h5>
                                <Tag
                                    className={`border-0 rounded capitalize ${articleTagClass(
                                        article.category,
                                    )}`}
                                >
                                    {article.category}
                                </Tag>
                            </div>
                            <p>
                                {article.content.length > 230
                                    ? article.content.substring(0, 229) + '...'
                                    : article.content}
                            </p>
                            <div className="flex items-center justify-between mt-6">
                                <div className="flex items-center gap-2">
                                    <span>Written by:</span>
                                    <UsersAvatarGroup
                                        avatarProps={{ size: 25 }}
                                        users={article.authors || []}
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-2">
                                        <HiOutlineClock className="text-lg" />
                                        <span>
                                            Updated {article.updateTime}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </article>
            ))}
        </>
    )
}

export default ArticleList

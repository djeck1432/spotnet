import Container from '@/components/shared/Container'
import AdaptableCard from '@/components/shared/AdaptableCard'
import reducer from './store'
import { injectReducer } from '@/store'
import useQuery from '@/utils/hooks/useQuery'
import ArticleContent from './components/ArticleContent'
import OthersArticle from './components/OthersArticle'

injectReducer('knowledgeBaseArticle', reducer)

const Article = () => {
    const query = useQuery()
    const id = query.get('id') as string

    return (
        <Container>
            <AdaptableCard bodyClass="lg:flex gap-4">
                <div className="my-6 max-w-[800px] w-full mx-auto">
                    <ArticleContent articleId={id} />
                </div>
                <OthersArticle articleId={id} />
            </AdaptableCard>
        </Container>
    )
}

export default Article

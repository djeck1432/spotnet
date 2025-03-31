import AdaptableCard from '@/components/shared/AdaptableCard'
import DocumentationNav from '@/components/docs/DocumentationNav'
import shareComponentsDocRoutes from './shareComponentsDocRoutes'
import ShareComponentsDocView from './ShareComponentsDocView'

const SharedComponentsDoc = () => {
    return (
        <AdaptableCard className="h-full" bodyClass="lg:flex h-full gap-8">
            <div className="lg:w-[280px] py-2 lg-py-0 px-4 mb-4 border border-gray-200 dark:border-gray-700 rounded-md lg:border-0">
                <DocumentationNav routes={shareComponentsDocRoutes} basePath='/docs/shared-component-doc/' />
            </div>
            <div className="w-full">
                <ShareComponentsDocView />
            </div>
        </AdaptableCard>
    )
}

export default SharedComponentsDoc

import AdaptableCard from '@/components/shared/AdaptableCard'
import DocumentationNav from '@/components/docs/DocumentationNav'
import documentationRoutes from './documentationRoutes'
import DocumentationView from './DocumentationView'

const Documentations = () => {
    return (
        <AdaptableCard className="h-full" bodyClass="lg:flex h-full gap-8">
            <div className="lg:w-[280px] py-2 lg-py-0 px-4 mb-4 border border-gray-200 dark:border-gray-700 rounded-md lg:border-0">
                <DocumentationNav routes={documentationRoutes} basePath='/docs/documentation/' />
            </div>
            <div className="w-full">
                <DocumentationView />
            </div>
        </AdaptableCard>
    )
}

export default Documentations

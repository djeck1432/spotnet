import ActionBar from './components/ActionBar'
import ProjectListContent from './components/ProjectListContent'
import NewProjectDialog from './components/NewProjectDialog'
import Container from '@/components/shared/Container'
import reducer from './store'
import { injectReducer } from '@/store'

injectReducer('projectList', reducer)

const ProjectList = () => {
    return (
        <Container className="h-full">
            <ActionBar />
            <ProjectListContent />
            <NewProjectDialog />
        </Container>
    )
}

export default ProjectList

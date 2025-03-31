import reducer from './store'
import { injectReducer } from '@/store'
import Container from '@/components/shared/Container'
import ScrumBoardHeader from './components/ScrumBoardHeader'
import Board from './components/Board'

injectReducer('scrumBoard', reducer)

const ScrumBoard = () => {
    return (
        <>
            <ScrumBoardHeader />
            <Container className="h-full">
                <Board />
            </Container>
        </>
    )
}

export default ScrumBoard

import { Draggable } from '@hello-pangea/dnd'
import BoardTitle from './BoardTitle'
import BoardCardList, { BaseBoardProps } from './BoardCardList'

interface BoardColumnProps extends BaseBoardProps {
    title: string
    index: number
    isScrollable?: boolean
}

const BoardColumn = (props: BoardColumnProps) => {
    const { title, contents, index, isScrollable, isCombineEnabled, useClone } =
        props

    return (
        <Draggable draggableId={title} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    className="
							board-column 
							flex 
							flex-col
							mb-3
							min-w-[300px] 
							w-[300px] 
							max-w-[300px] 
							p-0
							rounded-lg
						"
                    {...provided.draggableProps}
                >
                    <BoardTitle
                        title={title}
                        dragHandleProps={provided.dragHandleProps}
                    />
                    <BoardCardList
                        listId={title}
                        listType="CONTENT"
                        className={snapshot.isDragging ? 'is-dragging' : ''}
                        contents={contents}
                        internalScroll={isScrollable}
                        isCombineEnabled={isCombineEnabled}
                        useClone={useClone}
                    />
                </div>
            )}
        </Draggable>
    )
}

export default BoardColumn

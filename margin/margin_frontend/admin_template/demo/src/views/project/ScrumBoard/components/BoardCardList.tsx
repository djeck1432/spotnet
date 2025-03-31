import {
    Draggable,
    Droppable,
    DraggableChildrenFn,
    DroppableProvided,
} from '@hello-pangea/dnd'
import BoardCard from './BoardCard'
import type { Ticket } from '../types'
import type { CSSProperties } from 'react'

export interface BaseBoardProps {
    contents?: Ticket[]
    useClone?: DraggableChildrenFn
    isCombineEnabled?: boolean
}

interface BoardCardListProps extends BaseBoardProps {
    ignoreContainerClipping?: boolean
    internalScroll?: boolean
    scrollContainerStyle?: CSSProperties
    isDropDisabled?: boolean
    listId?: string
    style?: CSSProperties
    listType?: string
    className?: string
}

type InnerListProps = {
    dropProvided: DroppableProvided
    contents?: Ticket[]
}

function InnerList(props: InnerListProps) {
    const { dropProvided, contents, ...rest } = props

    return (
        <div ref={dropProvided.innerRef} className="board-dropzone h-full">
            <div className="px-4 h-full">
                {contents?.map((item, index) => (
                    <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                    >
                        {(dragProvided) => (
                            <BoardCard
                                ref={dragProvided.innerRef}
                                data={item}
                                {...rest}
                                {...dragProvided.draggableProps}
                                {...dragProvided.dragHandleProps}
                            />
                        )}
                    </Draggable>
                ))}
            </div>
        </div>
    )
}

const BoardCardList = (props: BoardCardListProps) => {
    const {
        ignoreContainerClipping,
        internalScroll,
        scrollContainerStyle,
        isDropDisabled,
        isCombineEnabled,
        listId = 'LIST',
        style,
        listType,
        contents,
        useClone,
    } = props

    return (
        <Droppable
            droppableId={listId}
            type={listType}
            ignoreContainerClipping={ignoreContainerClipping}
            isDropDisabled={isDropDisabled}
            isCombineEnabled={isCombineEnabled}
            renderClone={useClone}
        >
            {(dropProvided) => (
                <div
                    style={style}
                    className="board-wrapper overflow-hidden flex-auto"
                    {...dropProvided.droppableProps}
                >
                    {internalScroll ? (
                        <div
                            className="board-scrollContainer"
                            style={scrollContainerStyle}
                        >
                            <InnerList
                                contents={contents}
                                dropProvided={dropProvided}
                            />
                        </div>
                    ) : (
                        <InnerList
                            contents={contents}
                            dropProvided={dropProvided}
                        />
                    )}
                    {dropProvided.placeholder}
                </div>
            )}
        </Droppable>
    )
}

export default BoardCardList

import classNames from 'classnames'
import Segment from '@/components/ui/Segment'
import SegmentItemOption from '@/components/shared/SegmentItemOption'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import { HiCheckCircle } from 'react-icons/hi'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { setLayout, useAppSelector, useAppDispatch } from '@/store'
import {
    LAYOUT_TYPE_CLASSIC,
    LAYOUT_TYPE_MODERN,
    LAYOUT_TYPE_STACKED_SIDE,
    LAYOUT_TYPE_SIMPLE,
    LAYOUT_TYPE_DECKED,
    LAYOUT_TYPE_BLANK,
} from '@/constants/theme.constant'
import type { LayoutType } from '@/@types/theme'

const layouts = [
    {
        value: LAYOUT_TYPE_CLASSIC,
        label: 'Classic',
        src: '/img/thumbs/layouts/classic.jpg',
        srcDark: '/img/thumbs/layouts/classic-dark.jpg',
    },
    {
        value: LAYOUT_TYPE_MODERN,
        label: 'Mordern',
        src: '/img/thumbs/layouts/modern.jpg',
        srcDark: '/img/thumbs/layouts/modern-dark.jpg',
    },
    {
        value: LAYOUT_TYPE_STACKED_SIDE,
        label: 'Stacked Side',
        src: '/img/thumbs/layouts/stackedSide.jpg',
        srcDark: '/img/thumbs/layouts/stackedSide-dark.jpg',
    },
    {
        value: LAYOUT_TYPE_SIMPLE,
        label: 'Simple',
        src: '/img/thumbs/layouts/simple.jpg',
        srcDark: '/img/thumbs/layouts/simple-dark.jpg',
    },
    {
        value: LAYOUT_TYPE_DECKED,
        label: 'Decked',
        src: '/img/thumbs/layouts/decked.jpg',
        srcDark: '/img/thumbs/layouts/decked-dark.jpg',
    },
    {
        value: LAYOUT_TYPE_BLANK,
        label: 'Blank',
        src: '/img/thumbs/layouts/blank.jpg',
        srcDark: '/img/thumbs/layouts/blank-dark.jpg',
    },
]

const LayoutSwitcher = () => {
    const type = useAppSelector((state) => state.theme.layout.type)
    const dispatch = useAppDispatch()

    const onLayoutSelect = (val: LayoutType) => {
        dispatch(setLayout(val))
    }

    const { textTheme } = useThemeClass()

    return (
        <div>
            <Segment
                className="w-full"
                value={[type]}
                onChange={(val) => onLayoutSelect(val[0] as LayoutType)}
            >
                <div className="grid grid-cols-3 gap-4 w-full">
                    {layouts.map((layout) => (
                        <Segment.Item key={layout.value} value={layout.value}>
                            {({ active, onSegmentItemClick, disabled }) => {
                                return (
                                    <div className="text-center">
                                        <SegmentItemOption
                                            hoverable
                                            active={active}
                                            disabled={disabled}
                                            defaultGutter={false}
                                            className="relative min-h-[80px] w-full"
                                            customCheck={
                                                <HiCheckCircle
                                                    className={classNames(
                                                        textTheme,
                                                        'absolute top-2 right-2 text-lg',
                                                    )}
                                                />
                                            }
                                            onSegmentItemClick={
                                                onSegmentItemClick
                                            }
                                        >
                                            <DoubleSidedImage
                                                className="rounded-md"
                                                src={layout.src}
                                                darkModeSrc={layout.srcDark}
                                                alt=""
                                            />
                                        </SegmentItemOption>
                                        <div
                                            className={classNames(
                                                active && textTheme,
                                                'mt-2 font-semibold',
                                            )}
                                        >
                                            {layout.label}
                                        </div>
                                    </div>
                                )
                            }}
                        </Segment.Item>
                    ))}
                </div>
            </Segment>
        </div>
    )
}

export default LayoutSwitcher

import ConfigProvider from '@/components/ui/ConfigProvider'
import useDarkMode from '@/utils/hooks/useDarkmode'
import type { CommonProps } from '@/@types/common'
import { themeConfig } from '@/configs/theme.config'
import { useAppSelector } from '@/store'

const Theme = (props: CommonProps) => {
    const theme = useAppSelector((state) => state.theme)
    const locale = useAppSelector((state) => state.locale.currentLang)
    useDarkMode()

    const currentTheme = {
        ...themeConfig,
        ...theme,
        ...{ locale },
    }

    return (
        <ConfigProvider value={currentTheme}>{props.children}</ConfigProvider>
    )
}

export default Theme

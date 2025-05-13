import HorizontalMenuContent from './HorizontalMenuContent'
import useResponsive from '@/utils/hooks/useResponsive'
import { useAppSelector } from '@/store'

const HorizontalNav = () => {
    const mode = useAppSelector((state) => state.theme.mode)
    const userAuthority = useAppSelector((state) => state.auth.user.authority)

    const { larger } = useResponsive()

    return (
        <>
            {larger.md && (
                <HorizontalMenuContent
                    manuVariant={mode}
                    userAuthority={userAuthority}
                />
            )}
        </>
    )
}

export default HorizontalNav

import navigationConfig from '@/configs/navigation.config'
import Dropdown from '@/components/ui/Dropdown'
import AuthorityCheck from '@/components/shared/AuthorityCheck'
import HorizontalMenuItem from './HorizontalMenuItem'
import HorizontalMenuDropdownItem from './HorizontalMenuDropdownItem'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { useTranslation } from 'react-i18next'
import type { NavMode } from '@/@types/theme'

type HorizontalMenuContentProps = {
    manuVariant: NavMode
    userAuthority?: string[]
}

const HorizontalMenuContent = ({
    manuVariant,
    userAuthority = [],
}: HorizontalMenuContentProps) => {
    const { t } = useTranslation()

    return (
        <span className="flex items-center">
            {navigationConfig.map((nav) => {
                if (
                    nav.type === NAV_ITEM_TYPE_TITLE ||
                    nav.type === NAV_ITEM_TYPE_COLLAPSE
                ) {
                    return (
                        <AuthorityCheck
                            key={nav.key}
                            authority={nav.authority}
                            userAuthority={userAuthority}
                        >
                            <Dropdown
                                trigger="hover"
                                renderTitle={
                                    <HorizontalMenuItem
                                        manuVariant={manuVariant}
                                        nav={nav}
                                    />
                                }
                            >
                                {nav.subMenu.map((secondarySubNav) => (
                                    <AuthorityCheck
                                        key={secondarySubNav.key}
                                        authority={secondarySubNav.authority}
                                        userAuthority={userAuthority}
                                    >
                                        {secondarySubNav.subMenu.length > 0 ? (
                                            <Dropdown.Menu
                                                title={t(
                                                    secondarySubNav.translateKey,
                                                    secondarySubNav.title,
                                                )}
                                            >
                                                {secondarySubNav.subMenu.map(
                                                    (tertiarySubNav) => (
                                                        <AuthorityCheck
                                                            key={
                                                                tertiarySubNav.key
                                                            }
                                                            authority={
                                                                tertiarySubNav.authority
                                                            }
                                                            userAuthority={
                                                                userAuthority
                                                            }
                                                        >
                                                            <HorizontalMenuDropdownItem
                                                                nav={
                                                                    tertiarySubNav
                                                                }
                                                            />
                                                        </AuthorityCheck>
                                                    ),
                                                )}
                                            </Dropdown.Menu>
                                        ) : (
                                            <HorizontalMenuDropdownItem
                                                key={secondarySubNav.key}
                                                nav={secondarySubNav}
                                            />
                                        )}
                                    </AuthorityCheck>
                                ))}
                            </Dropdown>
                        </AuthorityCheck>
                    )
                }
                if (nav.type === NAV_ITEM_TYPE_ITEM) {
                    return (
                        <AuthorityCheck
                            key={nav.key}
                            authority={nav.authority}
                            userAuthority={userAuthority}
                        >
                            <HorizontalMenuItem
                                isLink
                                nav={nav}
                                manuVariant={manuVariant}
                            />
                        </AuthorityCheck>
                    )
                }
                return <></>
            })}
        </span>
    )
}

export default HorizontalMenuContent

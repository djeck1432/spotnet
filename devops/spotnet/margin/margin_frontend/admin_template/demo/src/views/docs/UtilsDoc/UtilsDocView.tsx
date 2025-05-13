import { Fragment, Suspense } from 'react'
import Spinner from '@/components/ui/Spinner'
import utilsDocRoutes from './utilsDocRoutes'
import { Routes, Route, Navigate } from 'react-router-dom'

const UtilsDocView = () => {
    return (
        <Routes>
            {utilsDocRoutes.map((group) => (
                <Fragment key={group.groupName}>
                    {group.nav.map(({ path, component: Component, label }) => (
                        <Route
                            key={label}
                            path={path}
                            element={
                                <Suspense
                                    fallback={
                                        <div className="h-full w-full flex items-center justify-center">
                                            <Spinner size={40} />
                                        </div>
                                    }
                                >
                                    <Component />
                                </Suspense>
                            }
                        />
                    ))}
                </Fragment>
            ))}
            <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
    )
}

export default UtilsDocView

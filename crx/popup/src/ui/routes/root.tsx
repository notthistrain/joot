import React, { memo, useMemo } from 'react'
import { Outlet, redirect, NavLink, useLocation } from "react-router-dom"

export const loader = () => {
    const pathname = globalThis.localStorage.getItem(`last-pathname`)
    return redirect(pathname || "/clipboard")
}

export const Root = memo(() => {
    const location = useLocation()
    const menu_list = useMemo(() => [
        {
            title: "剪贴板",
            link: "/clipboard"
        },
        {
            title: "截屏",
            link: "/screenshot"
        }
    ], [])
    return <div className="joot-app relative w-full h-full flex flex-row overflow-hidden">
        <div className='workspace flex-1 h-full overflow-auto'>
            <Outlet />
        </div>
        <div className='menu flex-shrink-0 h-full w-40 flex flex-col border-solid border-black border-l-2 border-r-2'>
            {
                menu_list.map(menu => {
                    return <div
                        key={menu.link}
                        className={`
                            menu-item flex-1 w-full text-2xl flex justify-center items-center 
                            border-solid border-black border-y-1
                            ${location.pathname.startsWith(menu.link) ? 'bg-blue-400' : ''}
                        `}
                    >
                        <NavLink to={menu.link}>{menu.title}</NavLink>
                    </div>
                })
            }
        </div>
    </div >
}
)
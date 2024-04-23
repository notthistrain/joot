import React from 'react'
import { Outlet, redirect, NavLink } from "react-router-dom"

export const loader = () => {
    return redirect("/clipboard-view")
}

export const Root = () => {
    return <div className="joot-app relative w-full h-full flex flex-row overflow-hidden">
        <div className='workspace flex-1 h-full'>
            <Outlet />
        </div>
        <div className='menu flex-shrink-0 h-full w-40 flex flex-col border-solid border-black border-l-2 border-r-2'>
            <div className='menu-item flex-1 w-full text-2xl flex justify-center items-center border-solid border-black border-t-1 border-b-1'>
                <NavLink to="/clipboard-view">剪贴板</NavLink>
            </div>
            <div className='menu-item flex-1 w-full text-2xl flex justify-center items-center border-solid border-black border-t-1 border-b-1'>
                <NavLink to="/screenshot-view">截屏</NavLink>
            </div>
        </div>
    </div >
}

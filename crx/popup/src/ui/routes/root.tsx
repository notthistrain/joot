import React from 'react'
import { Outlet, redirect } from "react-router-dom"

export const loader = () => {
    return redirect("/clipboard-view")
}

export const Root = () => {
    return <div className="app relative w-full h-full flex flex-row overflow-hidden">
        <div className='workspace flex-1 h-full'>
            <Outlet />
        </div>
        <div className='menu flex-shrink-0 h-full w-40 flex flex-col border-2 border-solid border-black'>
            <div className='menu-item flex-1 w-full text-2xl flex justify-center items-center'>
                剪贴板
            </div>
        </div>
    </div>
}

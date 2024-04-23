import React from 'react'
import { useLoaderData } from 'react-router-dom'
import { EJootTarget, IChromeBaseMessage } from "joot-types"

export const loader = async () => {
    const msg: IChromeBaseMessage = {
        target: EJootTarget.Background,
        action: 'screenshot:call'
    }
    const data_url: string | undefined = await chrome.runtime.sendMessage(msg)
    return data_url
}

export const ScreenshotView = () => {
    const data_url = useLoaderData() as (string | undefined)
    return <div className='screenshot-view w-full h-full flex justify-center items-center'>
        <img src={data_url} alt="current tab screenshot" />
    </div>
}
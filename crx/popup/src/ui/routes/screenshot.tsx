import React, { memo, useCallback, useEffect, useState } from 'react'
import { LoaderFunction, useFetcher, useLoaderData } from 'react-router-dom'
import { EJootTarget, IChromeBaseMessage } from "joot-types"

export const index_loader: LoaderFunction = async () => {
    const msg: IChromeBaseMessage = {
        target: EJootTarget.Background,
        action: "screenshot:get-data"
    }
    const data_url: string | undefined = await chrome.runtime.sendMessage(msg)
    return data_url
}

export const dispatch_loader: LoaderFunction = async () => {
    const msg: IChromeBaseMessage = {
        target: EJootTarget.Background,
        action: "screenshot:call"
    }
    const data_url: string | undefined = await chrome.runtime.sendMessage(msg)
    return data_url
}

type TScreenshotData = string | undefined

function ScreenshotRoute() {
    const data_url_cache = useLoaderData() as TScreenshotData

    const fetcher = useFetcher<TScreenshotData>()

    const call_screenshot = useCallback(() => {
        fetcher.load('/screenshot-call')
    }, [fetcher])

    useEffect(() => {
        if (!data_url_cache) {
            // call_screenshot()
        }
    }, [])

    const data_url = fetcher.data

    return <div className='screenshot w-full h-full flex justify-center items-center relative'>
        <button className='absolute bg-black text-white px-2 text-base rounded' onClick={call_screenshot}>截图</button>
        {(data_url || data_url_cache) && <img src={data_url || data_url_cache} className='h-full' alt="current tab screenshot" />}
    </div>
}

export default memo(ScreenshotRoute)
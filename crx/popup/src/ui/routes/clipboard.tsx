import React, { FC, memo } from 'react'
import { LoaderFunction, useLoaderData } from 'react-router-dom'
import { EClipboardFormat, EJootTarget, IChromeBaseMessage, IClipboardDataPayload } from 'joot-types'
import { useClipboardData } from '../hooks/use-clipboard-data'

export const loader: LoaderFunction = async () => {
    const message: IChromeBaseMessage = {
        action: "clipboard:get-data",
        target: EJootTarget.Background
    }
    return await chrome.runtime.sendMessage(message)
}

const TextView: FC<{ text: string }> = ({ text }) => {
    return <p>{text}</p>
}

const ImageView: FC<{ array: number[] }> = ({ array }) => {
    const url = URL.createObjectURL(new Blob([new Uint8Array(array)], { type: 'image/png' }))
    return <img src={url} className='h-full' alt="from clipboard" />
}

function ClipboardRoute() {
    const payload = useLoaderData() as (IClipboardDataPayload)
    const clipboard = useClipboardData(payload)
    return <div className='clipboard w-full h-full flex justify-center items-center'>
        {(clipboard?.format === EClipboardFormat.Text && typeof clipboard.data === 'string') && <TextView text={clipboard.data} />}
        {(clipboard?.format === EClipboardFormat.Image && typeof clipboard.data === 'object') && <ImageView array={clipboard.data} />}
    </div>
}

export default memo(ClipboardRoute)
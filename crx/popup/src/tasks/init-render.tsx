import "@/ui/css/styles.css"
import React from 'react'
import { createRoot } from "react-dom/client"
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { ErrorRoute } from "@/ui/routes/error-route"
import { Root, loader as RootLoader } from "@/ui/routes/root"
import { ClipboardView, loader as ClipboardLoader } from "@/ui/routes/clipboard-view"
import { ScreenshotView, loader as ScreenshotViewLoader } from "@/ui/routes/screenshot-view"

export async function init_render() {
    const rootEl = document.getElementById('root')

    const router = createMemoryRouter([
        {
            path: '/',
            id: 'root',
            element: <Root />,
            children: [
                {
                    path: 'clipboard-view',
                    loader: ClipboardLoader,
                    element: <ClipboardView />,
                    errorElement: <ErrorRoute />
                },
                {
                    path: 'screenshot-view',
                    loader: ScreenshotViewLoader,
                    element: <ScreenshotView />,
                    errorElement: <ErrorRoute />
                }
            ]
        },
        {
            index: true,
            loader: RootLoader,
        }
    ])

    if (rootEl) {
        createRoot(rootEl).render(<RouterProvider router={router} />)
        console.log("render popup")
    }
}
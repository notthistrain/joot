import "@/ui/css/styles.css"
import React, { Suspense, lazy } from 'react'
import { createRoot } from "react-dom/client"
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { Root, loader as RootLoader } from "@/ui/routes/root"
import { AppLoading } from "@/ui/components/app-loading"
import { ErrorRoute } from "@/ui/routes/error-route"

const ClipboardRoute = lazy(() => import("@/ui/routes/clipboard"))
const ScreenshotRoute = lazy(() => import("@/ui/routes/screenshot"))

export async function init_render() {
    const rootEl = document.createElement('div')
    rootEl.id = "root"
    document.body.appendChild(rootEl)

    const router = createMemoryRouter([
        {
            path: '/',
            id: 'root',
            element: <Root />,
            children: [
                {
                    path: 'clipboard',
                    loader: async (...args) => (await import("@/ui/routes/clipboard")).loader(...args),
                    element: <Suspense fallback={<AppLoading />}>
                        <ClipboardRoute />
                    </Suspense>,
                    errorElement: <ErrorRoute />
                },
                {
                    path: 'screenshot',
                    loader: async (...args) => (await import("@/ui/routes/screenshot")).index_loader(...args),
                    element: <Suspense fallback={<AppLoading />}>
                        <ScreenshotRoute />
                    </Suspense>,
                    errorElement: <ErrorRoute />
                },
                {
                    path: 'screenshot-call',
                    loader: async (...args) => (await import("@/ui/routes/screenshot")).dispatch_loader(...args)
                }
            ],
            errorElement: <ErrorRoute />
        },
        {
            index: true,
            loader: RootLoader,
        }
    ])

    router.subscribe(({ location }) => {
        globalThis.localStorage.setItem(`last-pathname`, location.pathname)
    })

    createRoot(rootEl).render(<RouterProvider router={router} />)
}

import "@/ui/css/styles.css"
import React from 'react'
import { createRoot } from "react-dom/client"
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { Root } from '@/ui/routes/root'

export const init_render = async () => {
    const rootEl = document.createElement('div')
    document.body.appendChild(rootEl)

    const router = createMemoryRouter([
        {
            path: '/',
            element: <Root />
        }
    ])

    if (rootEl) {
        createRoot(rootEl).render(<RouterProvider router={router} />)
    }
}
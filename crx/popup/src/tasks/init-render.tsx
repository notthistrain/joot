import React from 'react'
import { createRoot } from "react-dom/client"
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { Root } from "@/ui/routes/root"

export async function init_render() {
    const rootEl = document.getElementById('root')

    const router = createMemoryRouter([
        {
            path: '/',
            id: 'root',
            element: <Root />,
            loader: async (...args) => (await import('../ui/routes/root')).loader(...args),
        }
    ])

    if (rootEl) {
        createRoot(rootEl).render(<RouterProvider router={router} />)
    }
}
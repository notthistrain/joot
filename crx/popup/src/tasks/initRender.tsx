import React from 'react'
import { createRoot } from "react-dom/client"
import Root from '../ui/routes/Root'

export async function init_render() {
    const rootEl = document.getElementById('root')

    if (rootEl) {
        createRoot(rootEl).render(<Root />)
    }
}
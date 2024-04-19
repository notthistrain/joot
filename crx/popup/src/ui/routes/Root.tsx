import "../css/styles.css"

import React, { useEffect } from 'react'
import { useClipboard } from "../hooks/useClipboardData"

const Root = () => {
    const clipboard = useClipboard()

    return <div className="app">
        <p>{clipboard?.format}</p>
        <p>{clipboard?.data}</p>
    </div>
}

export default Root
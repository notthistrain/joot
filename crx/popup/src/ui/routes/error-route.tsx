import React from "react"
import { useRouteError } from "react-router-dom"

export const ErrorRoute = () => {
    const error: any = useRouteError()
    return <div>{error}</div>
}
import { useEffect, useState } from "react"
import {checkLicense} from "../services/license.js"

export function useLicense() {
    const [license, setLicense] = useState(null)

    useEffect(() => {
        checkLicense().then(setLicense)
    }, [])

    return license
}
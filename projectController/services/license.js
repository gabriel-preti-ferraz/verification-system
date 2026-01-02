import { LICENSE_API, LICENSE_TOKEN } from "../config/license.js"

export async function checkLicense() {
    try {
        const response = await fetch(`${LICENSE_API}/license/check`, {
            headers: {
                Authorization: `Bearer ${LICENSE_TOKEN}`
            },
        })

        if (!response.ok) {
            return {status: "error"}
        }

        return await response.json()
    } catch (err) {
        console.error("License check failed:", err)
        return {status: "offline"}
    }
}
import client from "./database/db.js"

const GRACE_DAYS = 7

export default async function checkLicense(projectId) {
    const now = Date.now()
    
    const result = await client.query("SELECT * FROM projects WHERE id = $1", [projectId])
    const project = result.rows[0]
    
    if (!project) {
        return {status: "404", message: "Project not found"}
    }

    const expiresAt = new Date(project.expires_at)
    const graceUntil = new Date(expiresAt.getTime() + GRACE_DAYS * 24 * 60 * 60 * 1000)

    let licenseState
    if (now < expiresAt.getTime()) {
        licenseState = "active"
    } else if (now <= graceUntil.getTime()) {
        licenseState = "grace"
    } else {
        licenseState = "expired"
    }

    const daysLeft = Math.ceil((expiresAt.getTime() - now) / (24 * 60 * 60 * 1000))

    return {
        status: licenseState,
        expires_at: expiresAt,
        grace_until: graceUntil,
        days_left: daysLeft,
        project_id: project.id,
        project_name: project.name,
        user_id: project.user_id
    }
}
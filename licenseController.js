import client from "./database/db.js"

const GRACE_DAYS = 7

function checkLicense(projectId) {
    return new Promise((resolve, reject) => {
        const now = Date.now()

        client.query(
            `SELECT * FROM projects WHERE id = $1`, [projectId],
            (err, result) => {
                if (err) return reject(err)
                const project = result.rows[0]
                if (!project) return resolve({status: 404, message: "Project not found"})

                if (project.status === "blocked") {
                    return resolve({status: "blocked"})
                }

                const expiresAt = new Date(project.expires_at)
                const graceUntil = new Date(expiresAt.getTime() + GRACE_DAYS * 24 * 60 * 60 * 1000)

                let licenseState
                if (now < expiresAt) {
                    licenseState = "active"
                } else if (now <= graceUntil) {
                    licenseState = "grace"
                } else {
                    licenseState = "expired"
                }

                const diffMs = graceUntil - now
                const daysLeft = Math.ceil(diffMs / (24 * 60 * 60 * 1000))

                resolve({
                    status: licenseState,
                    expiresAt: expiresAt,
                    grace_until: graceUntil,
                    days_left: daysLeft,
                    project_id: project.id,
                    project_name: project.name,
                })
            }
        )
    })
}

export default checkLicense
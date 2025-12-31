import db from "./database/db.js"

const GRACE_DAYS = 7

function checkLicense(projectId) {
    return new Promise((resolve, reject) => {
        const now = Math.floor(Date.now() / 1000)

        db.get(
            `SELECT * FROM projects WHERE id = ?`, [projectId],
            (err, project) => {
                if (err) return reject(err)
                if (!project) return resolve({status: 404, message: "Project not found"})

                if (project.status === "blocked") {
                    return resolve({status: "blocked"})
                }

                const expiresAt = project.expirestAt
                const graceUntil = expiresAt + GRACE_DAYS * 24 * 60 * 60

                let licenseState
                if (now < expiresAt) {
                    licenseState = "active"
                } else if (now <= graceUntil) {
                    licenseState = "grace"
                } else {
                    licenseState = "expired"
                }

                const daysLeft = Math.ceil((expiresAt - now) / (24 * 60 * 60))

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
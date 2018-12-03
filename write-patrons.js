#!/usr/bin/env node
'use strict'

const fs = require('fs').promises
const sh = require('child_process').execSync
const csv = require('csv')

const csvFile = sh(`curl -Ss 'https://www.patreon.com/api/members.csv?filter\\[campaign_id\\]=2234363&json-api-version=1.0&include=[]' -H 'Referer: https://www.patreon.com/members' -H 'Cookie: __cfduid=d153ab568f7b8463e0bcc9a840a52d51b1539708190; patreon_device_id=284cc9fc-b573-487a-8120-a1acfc1ba32f; fbm_130127590512253=base_domain=.patreon.com; session_id=aGcAzJZ88-6IUJGav9HA2-uvOOhb2D4QZYi1skphvn8; _pendo_visitorId.84b39519-1e4c-483a-47ce-19bf730de8f7=15181903; _pendo_meta.84b39519-1e4c-483a-47ce-19bf730de8f7=19222041; _pendo_accountId.84b39519-1e4c-483a-47ce-19bf730de8f7=2234363; __stripe_mid=5ffdeb4d-55da-4126-b923-f8a7753d292b'`).toString()

async function main() {
    const users = await new Promise((resolve, reject) => {
        csv.parse(csvFile, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    })

    let names = []
    users.forEach((user) => {
        const [ name, , , , , , pledge ] = user
        if (parseFloat(pledge.replace('$', '')) >= 5) {
            names.push(name)
        }
    })

    names = names.sort()

    await fs.writeFile('PATRONS.md', names.map(name => ` * ${name}\n`).join(''))
}

main().catch(err => { console.error(err); process.exit(1) })


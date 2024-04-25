import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const publishHookType = process.argv[2]

const __dirname = fileURLToPath(import.meta.url)
const packageJsonPath = path.resolve(__dirname, "../../package.json")
const backupPath = path.resolve(__dirname, "../.backup-package.json")

const readFile = (path) => fs.readFileSync(path, "utf-8")
const writeFile = (path, content) => fs.writeFileSync(path, content, "utf-8")

if (publishHookType === "pre" && !fs.existsSync(backupPath)) {
    const packageJson = readFile(packageJsonPath)
    const packageObj = JSON.parse(packageJson)
    writeFile(backupPath, packageJson)
    delete packageObj.type

    const newPackageJson = JSON.stringify(packageObj, null, 2)
    writeFile(packageJsonPath, newPackageJson)
} else if (publishHookType === "post") {
    const packageJson = readFile(backupPath)
    writeFile(packageJsonPath, packageJson)
    fs.unlinkSync(backupPath)
}

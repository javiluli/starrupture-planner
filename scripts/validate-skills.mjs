import { access, readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const projectRoot = process.cwd()
const skillsRoot = path.join(projectRoot, '.agents', 'skills')
const lockPath = path.join(projectRoot, 'skills-lock.json')

const canRead = async (filePath) => {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

const getInstalledSkills = async () => {
  const entries = await readdir(skillsRoot, { withFileTypes: true })
  const skills = []

  for (const entry of entries) {
    if (entry.isDirectory() && (await canRead(path.join(skillsRoot, entry.name, 'SKILL.md')))) {
      skills.push(entry.name)
    }
  }

  return skills.sort()
}

const getLocalMarkdownLinks = (markdown) => {
  const links = []
  const linkPattern = /\[[^\]]+\]\(([^)]+)\)/g

  for (const match of markdown.matchAll(linkPattern)) {
    const target = match[1].trim().split(/\s+["']/)[0]
    if (!target || target.startsWith('#') || target.startsWith('/') || /^[a-z]+:/i.test(target)) continue
    if (target.startsWith('.playwright-cli/')) continue
    links.push(target.split('#')[0])
  }

  return links
}

const errors = []
const lock = JSON.parse(await readFile(lockPath, 'utf8'))
const installedSkills = await getInstalledSkills()
const lockedSkills = Object.keys(lock.skills ?? {}).sort()

for (const skill of lockedSkills.filter((skill) => !installedSkills.includes(skill))) {
  errors.push(`Locked skill is not installed: ${skill}`)
}

for (const skill of installedSkills.filter((skill) => !lockedSkills.includes(skill))) {
  errors.push(`Installed skill is not locked: ${skill}`)
}

for (const skill of installedSkills) {
  const skillPath = path.join(skillsRoot, skill, 'SKILL.md')
  const markdown = await readFile(skillPath, 'utf8')
  const frontmatter = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)

  if (!frontmatter) {
    errors.push(`${skill}/SKILL.md has no YAML frontmatter`)
    continue
  }

  const declaredName = frontmatter[1].match(/^name:\s*["']?([^"'\r\n]+)["']?\s*$/m)?.[1]
  const description = frontmatter[1].match(/^description:\s*(.+)$/m)?.[1]
  if (declaredName !== skill) errors.push(`${skill}/SKILL.md declares name '${declaredName ?? ''}'`)
  if (!description?.trim()) errors.push(`${skill}/SKILL.md has no description`)

  for (const target of getLocalMarkdownLinks(markdown)) {
    const resolvedTarget = path.resolve(path.dirname(skillPath), target)
    if (!(await canRead(resolvedTarget))) errors.push(`${skill}/SKILL.md links to missing '${target}'`)
  }
}

if (errors.length > 0) {
  console.error(`Skill validation failed with ${errors.length} problem${errors.length === 1 ? '' : 's'}:`)
  errors.forEach((error) => console.error(`- ${error}`))
  process.exitCode = 1
} else {
  console.log(`Skill validation passed: ${installedSkills.length} installed and locked skills`)
}

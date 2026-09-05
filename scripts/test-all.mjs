import { spawn } from 'node:child_process'

const packageManager = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
const command = process.platform === 'win32' ? (process.env.ComSpec ?? 'cmd.exe') : packageManager

const stages = [
  { id: 'format', label: 'Format check', script: 'format:check' },
  { id: 'lint', label: 'Lint', script: 'lint' },
  { id: 'unit', label: 'Unit tests', script: 'test', testOutput: 'vitest' },
  { id: 'e2e-typecheck', label: 'E2E typecheck', script: 'typecheck:e2e' },
  { id: 'build', label: 'Build', script: 'build' },
  { id: 'e2e', label: 'E2E tests', script: 'test:e2e', testOutput: 'playwright' },
]

const stripAnsi = (value) => value.replace(/\u001B\[[0-?]*[ -/]*[@-~]/g, '')

const findCount = (output, label) => {
  const matches = [...output.matchAll(new RegExp(`(\\d+)\\s+${label}`, 'gi'))]
  return matches.length > 0 ? Number(matches.at(-1)[1]) : undefined
}

const parseTestCounts = (output, parser) => {
  const normalizedOutput = stripAnsi(output)
  const labels = ['passed', 'failed', 'skipped']

  if (parser === 'vitest') {
    const testsSection = normalizedOutput.match(/^\s*Tests\s+(.+)$/m)?.[1] ?? ''
    const counts = Object.fromEntries(labels.map((label) => [label, findCount(testsSection, label)]))
    return Object.values(counts).some((count) => count !== undefined)
      ? Object.fromEntries(labels.map((label) => [label, counts[label] ?? 0]))
      : undefined
  }

  const counts = Object.fromEntries(labels.map((label) => [label, findCount(normalizedOutput, label)]))
  return Object.values(counts).some((count) => count !== undefined)
    ? Object.fromEntries(labels.map((label) => [label, counts[label] ?? 0]))
    : undefined
}

const runStage = ({ script, ...stage }) =>
  new Promise((resolve) => {
    const startedAt = Date.now()
    let output = ''
    const args = process.platform === 'win32' ? ['/d', '/s', '/c', `${packageManager} ${script}`] : [script]
    const child = spawn(command, args, {
      cwd: process.cwd(),
      env: process.env,
      stdio: ['inherit', 'pipe', 'pipe'],
    })

    const appendOutput = (chunk, stream) => {
      const text = chunk.toString()
      output += text
      stream.write(text)
    }

    child.stdout.on('data', (chunk) => appendOutput(chunk, process.stdout))
    child.stderr.on('data', (chunk) => appendOutput(chunk, process.stderr))
    child.on('close', (exitCode, signal) => {
      resolve({
        ...stage,
        script,
        exitCode: exitCode ?? 1,
        signal,
        output,
        counts: stage.testOutput ? parseTestCounts(output, stage.testOutput) : undefined,
        durationMs: Date.now() - startedAt,
      })
    })
  })

const formatDuration = (durationMs) => `${(durationMs / 1000).toFixed(1)}s`

const formatCount = (value) => (value === undefined ? '-' : String(value))

const getTestSummary = (counts) => {
  if (!counts) return '-'

  const values = ['passed', 'failed', 'skipped'].filter((key) => counts[key] !== undefined)
  return values.map((key) => `${key}: ${counts[key]}`).join(', ')
}

const getStageDetails = (result) => {
  if (result.testOutput) return getTestSummary(result.counts)
  if (result.exitCode !== 0) {
    const normalizedOutput = stripAnsi(result.output)
    if (result.id === 'format') {
      const files = normalizedOutput.match(/^\[warn\] .+$/gm) ?? []
      return files.length > 0 ? `${files.length} files need formatting` : `exit ${result.exitCode}`
    }
    if (result.id === 'lint') {
      const problems = normalizedOutput.match(/(\d+)\s+problems?/i)?.[1]
      return problems ? `${problems} problems` : `exit ${result.exitCode}`
    }
    if (result.id === 'e2e-typecheck') return 'TypeScript errors'
    if (result.id === 'build') return `exit ${result.exitCode}`
    return `exit ${result.exitCode}`
  }

  if (result.id === 'format') return 'Prettier OK'
  if (result.id === 'lint') return '0 problems'
  if (result.id === 'e2e-typecheck') return 'TypeScript OK'
  if (result.id === 'build') {
    const modules = stripAnsi(result.output).match(/(\d+)\s+modules transformed/i)?.[1]
    return modules ? `${modules} modules transformed` : 'Vite OK'
  }
  return 'completed'
}

const getColumnWidths = (rows) => {
  const headers = ['Stage', 'Command', 'Status', 'Passed', 'Failed', 'Skipped', 'Time', 'Details']
  return headers.map((header, index) => Math.max(header.length, ...rows.map((row) => row[index].length)))
}

const printTable = (results) => {
  const rows = results.map((result) => [
    result.label,
    `pnpm ${result.script}`,
    result.exitCode === 0 ? 'PASS' : 'FAIL',
    formatCount(result.counts?.passed),
    formatCount(result.counts?.failed),
    formatCount(result.counts?.skipped),
    formatDuration(result.durationMs),
    getStageDetails(result),
  ])
  const headers = ['Stage', 'Command', 'Status', 'Passed', 'Failed', 'Skipped', 'Time', 'Details']
  const widths = getColumnWidths(rows)
  const separator = `+${widths.map((width) => '-'.repeat(width + 2)).join('+')}+`
  const line = (values) => `| ${values.map((value, index) => value.padEnd(widths[index])).join(' | ')} |`

  console.log('\n' + separator)
  console.log(line(headers))
  console.log(separator)
  rows.forEach((row) => console.log(line(row)))
  console.log(separator)

  const testResults = results.filter((result) => result.counts)
  const totals = testResults.reduce(
    (accumulator, result) => {
      for (const key of ['passed', 'failed', 'skipped']) {
        accumulator[key] += result.counts[key] ?? 0
      }
      return accumulator
    },
    { passed: 0, failed: 0, skipped: 0 },
  )
  if (testResults.length === 0) {
    console.log('Tests total: - | Passed: - | Failed: - | Skipped: -')
    return
  }

  const total = totals.passed + totals.failed + totals.skipped
  console.log(`Tests total: ${total} | Passed: ${totals.passed} | Failed: ${totals.failed} | Skipped: ${totals.skipped}`)
}

const results = []

for (const stage of stages) {
  const result = await runStage(stage)
  results.push(result)
  if (result.exitCode !== 0) break
}

printTable(results)

const failedStage = results.find((result) => result.exitCode !== 0)
if (failedStage) {
  console.error(`\nTest pipeline stopped at: ${failedStage.label} (exit ${failedStage.exitCode})`)
  process.exitCode = failedStage.exitCode
}

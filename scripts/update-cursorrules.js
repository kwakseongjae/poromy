#!/usr/bin/env node

const { execSync } = require('child_process')
const path = require('path')

async function main() {
  const args = process.argv.slice(2)
  const options = {
    watch: args.includes('--watch') || args.includes('-w'),
    hook: args.includes('--hook') || args.includes('-h'),
    help: args.includes('--help'),
  }

  if (options.help) {
    console.log(`
🚀 CursorRules Structure Auto-Updater

Usage:
  node scripts/update-cursorrules.js [options]

Options:
  --watch, -w    Watch for file changes and auto-update
  --hook, -h     Setup git pre-commit hook
  --help         Show this help message

Examples:
  node scripts/update-cursorrules.js              # Update once
  node scripts/update-cursorrules.js --watch      # Watch mode
  node scripts/update-cursorrules.js --hook       # Setup git hook

npm scripts:
  pnpm cursorrules:update    # One-time update
  pnpm cursorrules:watch     # Watch mode
  pnpm dev                   # Start dev with auto-update
`)
    return
  }

  console.log('🔧 Updating .cursorrules with project structure...\n')

  try {
    execSync('npx tsx scripts/structure-injector.ts', { stdio: 'inherit' })
  } catch (error) {
    console.error('❌ Failed to update structure:', error.message)
    process.exit(1)
  }

  if (options.watch) {
    console.log('👀 Watching for file system changes...')
    const chokidar = require('chokidar')
    const watcher = chokidar.watch('.', {
      ignored: [
        'node_modules/**',
        '.git/**',
        '.next/**',
        '**/.cursorrules',
        '**/dist/**',
        '**/coverage/**',
      ],
      ignoreInitial: true,
      depth: 4,
    })

    let updateTimer
    const debouncedUpdate = () => {
      clearTimeout(updateTimer)
      updateTimer = setTimeout(() => {
        console.log('🔄 Detected changes, updating structure...')
        execSync('npx tsx scripts/structure-injector.ts', { stdio: 'inherit' })
      }, 1000)
    }

    watcher
      .on('add', debouncedUpdate)
      .on('unlink', debouncedUpdate)
      .on('addDir', debouncedUpdate)
      .on('unlinkDir', debouncedUpdate)

    process.on('SIGINT', () => {
      console.log('\n👋 Stopping watcher...')
      process.exit(0)
    })
  }

  if (options.hook) {
    setupGitHook()
  }
}

function setupGitHook() {
  const fs = require('fs')
  const path = require('path')

  try {
    const hooksDir = path.join(process.cwd(), '.git', 'hooks')
    const preCommitPath = path.join(hooksDir, 'pre-commit')

    let existingHook = ''
    try {
      existingHook = fs.readFileSync(preCommitPath, 'utf-8')
    } catch (error) {}

    const hookCommand = 'node scripts/update-cursorrules.js'

    if (!existingHook.includes(hookCommand)) {
      const newHook = `#!/bin/sh
${existingHook}
# Auto-update .cursorrules with project structure
${hookCommand}
`

      fs.writeFileSync(preCommitPath, newHook, 'utf-8')
      fs.chmodSync(preCommitPath, 0o755)
      console.log('✅ Git pre-commit hook updated')
    }
  } catch (error) {
    console.warn('⚠️  Could not setup git hook:', error.message)
  }
}

main().catch(console.error)

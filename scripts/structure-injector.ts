import fs from 'fs/promises'
import path from 'path'

interface ProjectStructure {
  path: string
  type: 'file' | 'directory'
  children?: ProjectStructure[]
  extension?: string
}

class CursorRulesStructureInjector {
  private config = {
    projectStructureMarkers: {
      start: '<!-- PROJECT_STRUCTURE_START -->',
      end: '<!-- PROJECT_STRUCTURE_END -->',
    },
    ignoredPaths: [
      'node_modules',
      '.git',
      '.next',
      'dist',
      'build',
      '.vercel',
      '.env*',
      '*.log',
      '.DS_Store',
      'coverage',
      '.nyc_output',
      '.pnpm-store',
      'temp',
      'company_generate_prompt.md',
      'position_generate_prompt.md',
      '.cursor',
      '.vscode',
      'legacy_prompt',
    ],
    maxDepth: 4,
    includeFileExtensions: [
      '.ts',
      '.tsx',
      '.js',
      '.jsx',
      '.json',
      '.md',
      '.yml',
      '.yaml',
      '.env.example',
      '.gitignore',
    ],
    excludeDirectories: [
      'node_modules',
      '.git',
      '.next',
      'dist',
      'build',
      'coverage',
      '.nyc_output',
      '.pnpm-store',
      'temp',
    ],
  }

  async scanDirectory(
    dirPath: string,
    currentDepth = 0,
    relativePath = ''
  ): Promise<ProjectStructure[]> {
    if (currentDepth >= this.config.maxDepth) return []

    let entries: any[] = []
    try {
      entries = await fs.readdir(dirPath, { withFileTypes: true })
    } catch {
      return []
    }
    const structure: ProjectStructure[] = []

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name)
      const entryRelativePath = path.join(relativePath, entry.name)

      if (this.shouldIgnorePath(entryRelativePath)) continue

      if (entry.isDirectory()) {
        const children = await this.scanDirectory(
          fullPath,
          currentDepth + 1,
          entryRelativePath
        )
        structure.push({
          path: entryRelativePath + '/',
          type: 'directory',
          children,
        })
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name)
        if (this.shouldIncludeFile(entry.name, ext)) {
          structure.push({
            path: entryRelativePath,
            type: 'file',
            extension: ext,
          })
        }
      }
    }

    return structure.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'directory' ? -1 : 1
      return a.path.localeCompare(b.path)
    })
  }

  private shouldIgnorePath(relativePath: string): boolean {
    return this.config.ignoredPaths.some((pattern) => {
      if (pattern.includes('*')) {
        const regex = new RegExp(
          pattern.replace(/\*/g, '.*').replace(/\./g, '\\.')
        )
        return regex.test(relativePath)
      }
      return relativePath.includes(pattern)
    })
  }

  private shouldIncludeFile(fileName: string, extension: string): boolean {
    const importantFiles = [
      'package.json',
      'tsconfig.json',
      'next.config.js',
      'tailwind.config.js',
      '.cursorrules',
      'README.md',
    ]
    return (
      importantFiles.includes(fileName) ||
      this.config.includeFileExtensions.includes(extension)
    )
  }

  async updateCursorRules(): Promise<void> {
    const structure = await this.scanDirectory(process.cwd())
    const currentContent = await fs
      .readFile('.cursorrules', 'utf-8')
      .catch(() => '')
    const packageInfo = await this.getProjectInfo()

    const structureMarkdown = this.formatStructureAsMarkdown(structure)
    const newStructureSection = this.generateStructureSection(
      packageInfo,
      structureMarkdown
    )

    // Frontend Design Guideline 파일 읽기 (존재할 때만)
    let guidelineContent = ''
    try {
      guidelineContent = await fs.readFile(
        'frontend-design-guideline.md',
        'utf-8'
      )
    } catch {}

    const { start, end } = this.config.projectStructureMarkers
    const startIndex = currentContent.indexOf(start)
    const endIndex = currentContent.indexOf(end)

    let newContent: string
    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      // 기존 마커 구간만 교체 (중복 방지, 이후 모든 내용 제거)
      newContent = currentContent.substring(0, startIndex) + newStructureSection
    } else {
      // 마커가 없으면 구조 섹션만
      newContent = newStructureSection
    }

    // 가이드라인 붙이기 (항상 한 줄 개행)
    if (guidelineContent.trim()) {
      const trimmedGuideline = guidelineContent.trim()
      newContent =
        newContent.replace(/[\s\r\n]+$/, '') + '\n\n' + trimmedGuideline
    }

    // 파일 끝에도 정확히 한 줄만 남도록 보장
    await fs.writeFile(
      '.cursorrules',
      newContent.replace(/[\s\r\n]+$/, '') + '\n',
      'utf-8'
    )
    console.log('✅ .cursorrules updated successfully!')
  }

  private async getProjectInfo(): Promise<any> {
    try {
      const packageJsonPath = path.join(process.cwd(), 'package.json')
      const content = await fs.readFile(packageJsonPath, 'utf-8')
      return JSON.parse(content)
    } catch {
      return {}
    }
  }

  private formatStructureAsMarkdown(
    structure: ProjectStructure[],
    indent = ''
  ): string {
    let result = ''
    for (const item of structure) {
      const icon = item.type === 'directory' ? '📁' : '📄'
      result += `${indent}${icon} ${item.path}\n`
      if (item.children && item.children.length > 0) {
        result += this.formatStructureAsMarkdown(item.children, indent + '  ')
      }
    }
    return result
  }

  private generateStructureSection(
    projectInfo: any,
    structureMarkdown: string
  ): string {
    const { start, end } = this.config.projectStructureMarkers
    return `${start}

## 📋 Project Structure

### 🔧 Project Info
- **Name**: ${projectInfo.name || 'Unknown'}
- **Version**: ${projectInfo.version || 'Unknown'}
- **Package Manager**: pnpm
- **Framework**: Next.js (App Router)
- **Language**: TypeScript

### 📁 Directory Structure

\`\`\`
${structureMarkdown.trim()}
\`\`\`

### 🎯 Guidelines
- Follow Domain-Driven Design (DDD) under \`src/domains/\`
- Keep shared components in \`src/components/\`
- Use TypeScript for type safety
- Implement error boundaries and loading states
- Follow the frontend design guidelines

### 🔗 Key Conventions
- Use barrel exports (index.ts) for clean imports
- Prefer composition over props drilling
- Keep components focused and single-responsibility
- Abstract complex logic into custom hooks
- Use descriptive names for better readability

${end}
`
  }
}

if (require.main === module) {
  const injector = new CursorRulesStructureInjector()
  injector.updateCursorRules().catch(console.error)
}

export default CursorRulesStructureInjector

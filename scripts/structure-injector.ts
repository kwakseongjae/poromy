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

    const { start, end } = this.config.projectStructureMarkers
    const startIndex = currentContent.indexOf(start)
    const endIndex = currentContent.indexOf(end)

    let newContent: string
    if (startIndex !== -1 && endIndex !== -1) {
      newContent =
        currentContent.substring(0, startIndex) +
        newStructureSection +
        currentContent.substring(endIndex + end.length)
    } else {
      newContent =
        currentContent +
        (currentContent.endsWith('\n') ? '' : '\n') +
        newStructureSection
    }

    await fs.writeFile('.cursorrules', newContent, 'utf-8')
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
    return `\n${start}\n\n## 📋 Project Structure\n\n### 🔧 Project Info\n- **Name**: ${projectInfo.name || 'Unknown'}\n- **Version**: ${projectInfo.version || 'Unknown'}\n- **Package Manager**: pnpm\n- **Framework**: Next.js (App Router)\n- **Language**: TypeScript\n\n### 📁 Directory Structure\n\n\`\`\`\n${structureMarkdown.trim()}\n\`\`\`\n\n### 🎯 Guidelines\n- Follow Domain-Driven Design (DDD) under \`src/domains/\`\n- Keep shared components in \`src/components/\`\n- Use TypeScript for type safety\n- Implement error boundaries and loading states\n- Follow the frontend design guidelines\n\n### 🔗 Key Conventions\n- Use barrel exports (index.ts) for clean imports\n- Prefer composition over props drilling\n- Keep components focused and single-responsibility\n- Abstract complex logic into custom hooks\n- Use descriptive names for better readability\n\n${end}\n`
  }
}

if (require.main === module) {
  const injector = new CursorRulesStructureInjector()
  injector.updateCursorRules().catch(console.error)
}

export default CursorRulesStructureInjector

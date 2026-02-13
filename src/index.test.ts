import { describe, it, expect } from 'vitest';
import { parseAgentsMd, validateAgentsMd, findNearestAgentsMd } from '../src/index.js';
import { writeFileSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('parseAgentsMd', () => {
  it('should parse a basic AGENTS.md', () => {
    const content = `# Project
## Setup
run npm install

## Code Style
Use TypeScript
`;
    const tmpDir = tmpdir();
    const testFile = join(tmpDir, 'test-agents.md');
    writeFileSync(testFile, content);

    const result = parseAgentsMd(testFile);
    
    expect(result.sections).toHaveLength(3);
    expect(result.sections[0].title).toBe('Project');
    expect(result.sections[1].title).toBe('Setup');
    expect(result.sections[2].title).toBe('Code Style');
  });

  it('should handle empty content', () => {
    const content = '# Title\n\n';
    const tmpDir = tmpdir();
    const testFile = join(tmpDir, 'test-empty.md');
    writeFileSync(testFile, content);

    const result = parseAgentsMd(testFile);
    expect(result.sections).toHaveLength(1);
  });
});

describe('validateAgentsMd', () => {
  it('should validate a well-formed AGENTS.md', () => {
    const parsed = {
      filePath: 'test.md',
      raw: '',
      sections: [
        { title: 'Setup Commands', content: '', level: 2 },
        { title: 'Code Style', content: '', level: 2 },
        { title: 'Testing', content: '', level: 2 }
      ]
    };

    const result = validateAgentsMd(parsed);
    expect(result.valid).toBe(true);
  });

  it('should suggest missing sections', () => {
    const parsed = {
      filePath: 'test.md',
      raw: '',
      sections: [
        { title: 'Overview', content: '', level: 1 }
      ]
    };

    const result = validateAgentsMd(parsed);
    expect(result.valid).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
  });
});

import { Checkbox, Code, Select, Style, TextInput } from '@makeswift/runtime/controls';

import { runtime } from '~/lib/makeswift/runtime';

import { MSCodeBlock } from './client';

runtime.registerComponent(MSCodeBlock, {
  type: 'code-block',
  label: 'Basic / Code Block',
  icon: 'code',
  props: {
    className: Style(),
    snippet: Code({
      label: 'Code',
      defaultValue: `function greet(name: string) {
  console.log(\`Hello, \${name}!\`);
}

greet('world');`,
    }),
    language: Select({
      label: 'Language',
      options: [
        { value: 'typescript', label: 'TypeScript' },
        { value: 'javascript', label: 'JavaScript' },
        { value: 'tsx', label: 'TSX' },
        { value: 'jsx', label: 'JSX' },
        { value: 'html', label: 'HTML' },
        { value: 'css', label: 'CSS' },
        { value: 'json', label: 'JSON' },
        { value: 'python', label: 'Python' },
        { value: 'bash', label: 'Bash' },
        { value: 'sql', label: 'SQL' },
        { value: 'markdown', label: 'Markdown' },
        { value: 'yaml', label: 'YAML' },
        { value: 'text', label: 'Plain text' },
      ],
      defaultValue: 'typescript',
    }),
    filename: TextInput({
      label: 'Filename (optional)',
      defaultValue: '',
    }),
    showLineNumbers: Checkbox({
      label: 'Show line numbers',
      defaultValue: false,
    }),
  },
});

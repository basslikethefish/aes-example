'use client';

import type { BundledLanguage } from 'shiki';

import { CodeBlock } from '@/vibes/soul/primitives/code-block';

const SUPPORTED_LANGUAGES = [
  'typescript',
  'javascript',
  'tsx',
  'jsx',
  'html',
  'css',
  'json',
  'python',
  'bash',
  'sql',
  'markdown',
  'yaml',
  'text',
] as const satisfies readonly BundledLanguage[];

type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const SUPPORTED_LANGUAGE_SET = new Set<string>(SUPPORTED_LANGUAGES);

function isSupportedLanguage(language: string): language is SupportedLanguage {
  return SUPPORTED_LANGUAGE_SET.has(language);
}

type CodeSnippet = string | { value?: string | null } | null | undefined;

function getSnippetCode(snippet: CodeSnippet): string {
  if (typeof snippet === 'string') {
    return snippet;
  }

  if (snippet && typeof snippet === 'object' && 'value' in snippet) {
    return typeof snippet.value === 'string' ? snippet.value : '';
  }

  return '';
}

interface MSCodeBlockProps {
  className?: string;
  snippet?: CodeSnippet;
  language?: string;
  showLineNumbers?: boolean;
  filename?: string;
}

export function MSCodeBlock({
  className,
  snippet,
  language = 'typescript',
  showLineNumbers = false,
  filename,
}: MSCodeBlockProps) {
  const code = getSnippetCode(snippet);

  if (code === '') {
    return null;
  }

  const resolvedLanguage: BundledLanguage = isSupportedLanguage(language) ? language : 'text';

  return (
    <CodeBlock
      className={className}
      code={code}
      filename={filename}
      language={resolvedLanguage}
      showLineNumbers={showLineNumbers}
    />
  );
}

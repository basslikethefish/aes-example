'use client';

import { clsx } from 'clsx';
import { Check, Copy } from 'lucide-react';
import { Component, type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import type { BundledLanguage } from 'shiki';

import { Button } from '@/vibes/soul/primitives/button';

function CodeBlockCopyButton({ code }: { code: string }) {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<number>(0);

  const copyToClipboard = useCallback(async () => {
    if (typeof window === 'undefined' || isCopied) {
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      timeoutRef.current = window.setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // noop
    }
  }, [code, isCopied]);

  useEffect(
    () => () => {
      window.clearTimeout(timeoutRef.current);
    },
    [],
  );

  const Icon = isCopied ? Check : Copy;

  return (
    <Button
      aria-label={isCopied ? 'Copied' : 'Copy code'}
      className="text-white/70 hover:text-white"
      onClick={copyToClipboard}
      size="x-small"
      type="button"
      variant="ghost"
    >
      <Icon className="size-4" strokeWidth={1.5} />
    </Button>
  );
}

function PlainCode({ code, showLineNumbers }: { code: string; showLineNumbers: boolean }) {
  const lines = code.split('\n');

  return (
    <pre
      className={clsx(
        'overflow-x-auto p-4 font-mono text-sm leading-relaxed text-[#e6edf3]',
        showLineNumbers && '[counter-reset:line]',
      )}
    >
      <code>
        {lines.map((line, index) => (
          <span
            className={clsx(
              'block',
              showLineNumbers &&
                'before:content-[counter(line)] before:inline-block before:[counter-increment:line] before:w-8 before:mr-4 before:text-right before:text-white/30 before:select-none',
            )}
            key={index}
          >
            {line === '' ? '\n' : line}
          </span>
        ))}
      </code>
    </pre>
  );
}

function HighlightedCode({
  code,
  language,
  showLineNumbers,
}: {
  code: string;
  language: BundledLanguage;
  showLineNumbers: boolean;
}) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setHtml(null);

    async function highlight() {
      try {
        const { codeToHtml } = await import('shiki');

        const highlighted = await codeToHtml(code, {
          lang: language,
          theme: 'github-dark',
        });

        if (!cancelled) {
          setHtml(highlighted);
        }
      } catch {
        if (!cancelled) {
          setHtml(null);
        }
      }
    }

    void highlight();

    return () => {
      cancelled = true;
    };
  }, [code, language]);

  if (html) {
    return (
      <div
        className={clsx(
          'overflow-x-auto p-4 text-sm [&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-0 [&_code]:font-mono [&_code]:leading-relaxed',
          showLineNumbers && '[&_code]:[counter-reset:line]',
        )}
        // Shiki returns a complete <pre><code>…</code></pre> fragment.
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return <PlainCode code={code} showLineNumbers={showLineNumbers} />;
}

class CodeBlockErrorBoundary extends Component<
  { code: string; showLineNumbers: boolean; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <PlainCode code={this.props.code} showLineNumbers={this.props.showLineNumbers} />;
    }

    return this.props.children;
  }
}

export interface CodeBlockProps {
  className?: string;
  code: string;
  language?: BundledLanguage;
  showLineNumbers?: boolean;
  filename?: string;
}

export function CodeBlock({
  className,
  code,
  language = 'typescript',
  showLineNumbers = false,
  filename,
}: CodeBlockProps) {
  const headerLabel = (typeof filename === 'string' ? filename.trim() : '') || language;

  return (
    <div
      className={clsx(
        'overflow-hidden rounded-xl border border-[hsl(var(--contrast-200))] bg-[#0d1117] text-[#e6edf3]',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="font-mono text-xs uppercase tracking-wide text-white/50">
          {headerLabel}
        </span>
        <CodeBlockCopyButton code={code} />
      </div>
      <CodeBlockErrorBoundary
        code={code}
        key={`${code}-${language}`}
        showLineNumbers={showLineNumbers}
      >
        <HighlightedCode code={code} language={language} showLineNumbers={showLineNumbers} />
      </CodeBlockErrorBoundary>
    </div>
  );
}

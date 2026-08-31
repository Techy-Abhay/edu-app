import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathTextProps {
  text: string;
  className?: string;
  displayMode?: boolean; // true for block equations, false for inline
}

/**
 * Renders text with both LaTeX and Unicode math support
 * 
 * Usage:
 * - Simple Unicode: "What is 2 × 3 ÷ 6?"
 * - Inline LaTeX: "Solve $\\frac{x}{2} = 5$"
 * - Block LaTeX: "$$\\int_0^\\infty e^{-x} dx$$"
 * - Mixed: "Find $x^2$ where x = 3 × 2"
 */
export default function MathText({ text, className = '', displayMode = false }: MathTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      // Check if text contains LaTeX (delimited by $ or $$)
      const hasLaTeX = /\$\$[\s\S]+?\$\$|\$[^\$]+?\$/.test(text);

      if (hasLaTeX) {
        // Process text with LaTeX
        const processed = processLaTeX(text);
        containerRef.current.innerHTML = processed;
      } else {
        // Plain text or Unicode symbols (no LaTeX)
        containerRef.current.textContent = text;
      }
    } catch (error) {
      console.error('Error rendering math:', error);
      containerRef.current.textContent = text; // Fallback to plain text
    }
  }, [text, displayMode]);

  return <span ref={containerRef} className={className} />;
}

/**
 * Process text containing LaTeX delimiters ($...$ for inline, $$...$$ for block)
 */
function processLaTeX(text: string): string {
  let result = '';
  let lastIndex = 0;

  // Match both block ($$...$$) and inline ($...$) LaTeX
  const regex = /\$\$([\s\S]+?)\$\$|\$([^\$]+?)\$/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    result += escapeHtml(text.slice(lastIndex, match.index));

    // Render the LaTeX
    const latex = match[1] || match[2]; // match[1] for $$, match[2] for $
    const isBlock = !!match[1];

    try {
      const rendered = katex.renderToString(latex, {
        displayMode: isBlock,
        throwOnError: false,
        output: 'html'
      });
      result += rendered;
    } catch (error) {
      // If LaTeX is invalid, show it as-is
      result += escapeHtml(match[0]);
    }

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  result += escapeHtml(text.slice(lastIndex));

  return result;
}

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

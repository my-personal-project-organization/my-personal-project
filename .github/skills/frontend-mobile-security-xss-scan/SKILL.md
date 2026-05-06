---
name: frontend-mobile-security-xss-scan
description: 'You are a frontend security specialist focusing on Cross-Site Scripting (XSS) vulnerability detection and prevention. Analyze Angular and vanilla JavaScript code to identify injection points'
---

# XSS Vulnerability Scanner for Frontend Code

You are a frontend security specialist focusing on Cross-Site Scripting (XSS) vulnerability detection and prevention. Analyze Angular and vanilla JavaScript code to identify injection points, unsafe DOM manipulation, and improper sanitization in the  monorepo.

## Use this skill when

- Working on xss vulnerability scanner for frontend code tasks or workflows
- Needing guidance, best practices, or checklists for xss vulnerability scanner for frontend code

## Do not use this skill when

- The task is unrelated to xss vulnerability scanner for frontend code
- You need a different domain or tool outside this scope

## Context

The user needs comprehensive XSS vulnerability scanning for client-side code, identifying dangerous patterns like unsafe HTML manipulation, URL handling issues, and improper user input rendering. Focus on context-aware detection and framework-specific security patterns.

## Requirements

$ARGUMENTS

## Instructions

### 1. XSS Vulnerability Detection

Scan codebase for XSS vulnerabilities using static analysis:

```typescript
interface XSSFinding {
  file: string;
  line: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  vulnerable_code: string;
  description: string;
  fix: string;
  cwe: string;
}

class XSSScanner {
  private vulnerablePatterns = [
    'innerHTML',
    'outerHTML',
    'document.write',
    'insertAdjacentHTML',
    'location.href',
    'window.open',
  ];

  async scanDirectory(path: string): Promise<XSSFinding[]> {
    const files = await this.findJavaScriptFiles(path);
    const findings: XSSFinding[] = [];

    for (const file of files) {
      const content = await fs.readFile(file, 'utf-8');
      findings.push(...this.scanFile(file, content));
    }

    return findings;
  }

  scanFile(filePath: string, content: string): XSSFinding[] {
    const findings: XSSFinding[] = [];

    findings.push(...this.detectHTMLManipulation(filePath, content));
    findings.push(...this.detectAngularVulnerabilities(filePath, content));
    findings.push(...this.detectURLVulnerabilities(filePath, content));
    findings.push(...this.detectEventHandlerIssues(filePath, content));

    return findings;
  }

  detectHTMLManipulation(file: string, content: string): XSSFinding[] {
    const findings: XSSFinding[] = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (line.includes('innerHTML') && this.hasUserInput(line)) {
        findings.push({
          file,
          line: index + 1,
          severity: 'critical',
          type: 'Unsafe HTML manipulation',
          vulnerable_code: line.trim(),
          description: 'User-controlled data in HTML manipulation creates XSS risk',
          fix: 'Use textContent for plain text or sanitize with DOMPurify library',
          cwe: 'CWE-79',
        });
      }
    });

    return findings;
  }

  detectAngularVulnerabilities(file: string, content: string): XSSFinding[] {
    const findings: XSSFinding[] = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Detect bypass security trust usage without sanitization
      if (line.includes('bypassSecurityTrust') && !this.hasSanitization(content)) {
        findings.push({
          file,
          line: index + 1,
          severity: 'critical',
          type: 'Angular security bypass',
          vulnerable_code: line.trim(),
          description: 'Bypassing Angular sanitization without proper validation creates XSS vulnerability',
          fix: 'Use Angular DomSanitizer with proper validation or avoid bypassing security',
          cwe: 'CWE-79',
        });
      }

      // Detect [innerHTML] binding without sanitization
      if (line.includes('[innerHTML]') && this.hasUserInput(line) && !this.hasSanitization(content)) {
        findings.push({
          file,
          line: index + 1,
          severity: 'high',
          type: 'Angular unsafe HTML binding',
          vulnerable_code: line.trim(),
          description: 'User-controlled data in [innerHTML] binding creates XSS risk',
          fix: 'Sanitize content with DomSanitizer or use safe alternatives like textContent',
          cwe: 'CWE-79',
        });
      }
    });

    return findings;
  }

  detectURLVulnerabilities(file: string, content: string): XSSFinding[] {
    const findings: XSSFinding[] = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (line.includes('location.') && this.hasUserInput(line)) {
        findings.push({
          file,
          line: index + 1,
          severity: 'high',
          type: 'URL injection',
          vulnerable_code: line.trim(),
          description: 'User input in URL assignment can execute malicious code',
          fix: 'Validate URLs and enforce http/https protocols only',
          cwe: 'CWE-79',
        });
      }
    });

    return findings;
  }

  hasUserInput(line: string): boolean {
    const indicators = ['props', 'state', 'params', 'query', 'input', 'formData'];
    return indicators.some((indicator) => line.includes(indicator));
  }

  hasSanitization(content: string): boolean {
    return content.includes('DOMPurify') || content.includes('sanitize');
  }
}
```

### 2. Angular-Specific Detection

```typescript
class AngularXSSScanner {
  scanAngularComponent(code: string, template: string): XSSFinding[] {
    const findings: XSSFinding[] = [];

    // Check for unsafe Angular patterns
    const unsafePatterns = [
      'bypassSecurityTrustHtml',
      'bypassSecurityTrustScript',
      'bypassSecurityTrustStyle',
      'bypassSecurityTrustUrl',
      'bypassSecurityTrustResourceUrl',
    ];

    unsafePatterns.forEach((pattern) => {
      if (code.includes(pattern) && !this.hasSanitization(code)) {
        findings.push({
          severity: 'critical',
          type: 'Angular security bypass',
          description: `Pattern ${pattern} used without proper sanitization`,
          fix: 'Validate and sanitize content before bypassing Angular security',
        });
      }
    });

    // Check template bindings
    if (template.includes('[innerHTML]') && !this.hasSanitization(code)) {
      findings.push({
        severity: 'high',
        type: 'Angular unsafe HTML binding',
        description: '[innerHTML] binding without sanitization',
        fix: 'Use DomSanitizer to sanitize HTML content or use safe alternatives',
      });
    }

    // Check for attribute bindings that could be dangerous
    const dangerousBindings = ['[href]', '[src]', '[action]', '[formAction]'];
    dangerousBindings.forEach((binding) => {
      if (template.includes(binding) && !this.hasUrlValidation(code)) {
        findings.push({
          severity: 'medium',
          type: 'Potentially unsafe attribute binding',
          description: `${binding} binding may accept malicious URLs`,
          fix: 'Validate URLs and ensure only safe protocols are allowed',
        });
      }
    });

    return findings;
  }

  private hasSanitization(code: string): boolean {
    return code.includes('DomSanitizer') || code.includes('sanitize(') || code.includes('DOMPurify');
  }

  private hasUrlValidation(code: string): boolean {
    return code.includes('URL(') || code.includes('validateUrl') || code.includes('sanitizeUrl');
  }
}
```

### 3. Secure Coding Examples

```typescript
class SecureCodingGuide {
  getSecurePattern(vulnerability: string): string {
    const patterns = {
      html_manipulation: `
// SECURE: Use textContent for plain text (Vanilla JS)
element.textContent = userInput;

// SECURE: Sanitize HTML when needed (Vanilla JS)
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userInput);
element.innerHTML = clean;`,

      url_handling: `
// SECURE: Validate and sanitize URLs (Vanilla JS)
function sanitizeURL(url: string): string {
  try {
    const parsed = new URL(url);
    if (['http:', 'https:'].includes(parsed.protocol)) {
      return parsed.href;
    }
  } catch {}
  return '#';
}`,

      angular_sanitization: `
// SECURE: Use Angular DomSanitizer
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export class MyComponent {
  private sanitizer = inject(DomSanitizer);
  
  sanitizeHtml(html: string): SafeHtml {
    // Angular sanitizes automatically, but for external HTML:
    return this.sanitizer.sanitize(SecurityContext.HTML, html) || '';
  }
}`,

      angular_bypass_safe: `
// SECURE: Only bypass after proper validation
import { DomSanitizer } from '@angular/platform-browser';
import DOMPurify from 'dompurify';

export class MyComponent {
  private sanitizer = inject(DomSanitizer);
  
  getSafeHtml(userHtml: string) {
    // Sanitize first with DOMPurify
    const clean = DOMPurify.sanitize(userHtml);
    // Then bypass only if necessary
    return this.sanitizer.bypassSecurityTrustHtml(clean);
  }
}`,

      angular_url_validation: `
// SECURE: Validate URLs in Angular
import { DomSanitizer } from '@angular/platform-browser';

export class MyComponent {
  private sanitizer = inject(DomSanitizer);
  
  getSafeUrl(url: string) {
    try {
      const parsed = new URL(url);
      if (['http:', 'https:'].includes(parsed.protocol)) {
        return this.sanitizer.bypassSecurityTrustUrl(parsed.href);
      }
    } catch {}
    return this.sanitizer.bypassSecurityTrustUrl('#');
  }
}`,
    };

    return patterns[vulnerability] || 'No secure pattern available';
  }
}
```

### 4. Automated Scanning Integration

```bash
# ESLint with security plugin
npm install --save-dev eslint-plugin-security
eslint . --plugin security

# Semgrep for XSS patterns
semgrep --config=p/xss --json

# Custom XSS scanner
node xss-scanner.js --path=src --format=json
```

### 5. Report Generation

```typescript
class XSSReportGenerator {
  generateReport(findings: XSSFinding[]): string {
    const grouped = this.groupBySeverity(findings);

    let report = '# XSS Vulnerability Scan Report\n\n';
    report += `Total Findings: ${findings.length}\n\n`;

    for (const [severity, issues] of Object.entries(grouped)) {
      report += `## ${severity.toUpperCase()} (${issues.length})\n\n`;

      for (const issue of issues) {
        report += `- **${issue.type}**\n`;
        report += `  File: ${issue.file}:${issue.line}\n`;
        report += `  Fix: ${issue.fix}\n\n`;
      }
    }

    return report;
  }

  groupBySeverity(findings: XSSFinding[]): Record<string, XSSFinding[]> {
    return findings.reduce((acc, finding) => {
      if (!acc[finding.severity]) acc[finding.severity] = [];
      acc[finding.severity].push(finding);
      return acc;
    }, {} as Record<string, XSSFinding[]>);
  }
}
```

### 6. Prevention Checklist

**HTML Manipulation**

- Never use innerHTML with user input
- Prefer textContent for text content
- Sanitize with DOMPurify before rendering HTML
- Avoid document.write entirely

**URL Handling**

- Validate all URLs before assignment
- Block javascript: and data: protocols
- Use URL constructor for validation
- Sanitize href attributes

**Event Handlers**

- Use addEventListener instead of inline handlers
- Sanitize all event handler input
- Avoid string-to-code patterns

**Angular-Specific**

- Never bypass security without proper sanitization
- Use Angular's built-in DomSanitizer for HTML content
- Avoid bypassSecurityTrust\* methods unless absolutely necessary
- When bypassing is required, sanitize with DOMPurify first
- Use property binding over attribute binding for user input
- Prefer safe alternatives like textContent over [innerHTML]
- Validate URLs before using in [href], [src], or [action] bindings
- Use SecurityContext enum for proper context-aware sanitization

**Vanilla JavaScript**

- Always use textContent for plain text content
- Use DOMPurify for any HTML sanitization needs
- Avoid document.write and eval entirely
- Validate all user input before DOM manipulation

## Output Format

1. **Vulnerability Report**: Detailed findings with severity levels
2. **Risk Analysis**: Impact assessment for each vulnerability
3. **Fix Recommendations**: Secure code examples
4. **Sanitization Guide**: DOMPurify usage patterns
5. **Prevention Checklist**: Best practices for XSS prevention

Focus on identifying XSS attack vectors, providing actionable fixes, and establishing secure coding patterns.

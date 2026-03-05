#!/usr/bin/env node

// ─────────────────────────────────────────────────────────────
// apprx CLI — App Revenue Prescription
// Zero-dependency CLI tool using only Node.js built-in modules
// ─────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

// ── ANSI color helpers ──────────────────────────────────────

const c = {
  reset:   '\x1b[0m',
  bold:    '\x1b[1m',
  dim:     '\x1b[2m',
  green:   '\x1b[32m',
  yellow:  '\x1b[33m',
  blue:    '\x1b[34m',
  magenta: '\x1b[35m',
  cyan:    '\x1b[36m',
  white:   '\x1b[37m',
  red:     '\x1b[31m',
  bgGreen: '\x1b[42m',
  bgBlue:  '\x1b[44m',
};

const fmt = {
  success: (msg) => `${c.green}${c.bold}${msg}${c.reset}`,
  info:    (msg) => `${c.cyan}${msg}${c.reset}`,
  warn:    (msg) => `${c.yellow}${msg}${c.reset}`,
  error:   (msg) => `${c.red}${c.bold}${msg}${c.reset}`,
  dim:     (msg) => `${c.dim}${msg}${c.reset}`,
  bold:    (msg) => `${c.bold}${msg}${c.reset}`,
  label:   (msg) => `${c.blue}${c.bold}${msg}${c.reset}`,
  value:   (msg) => `${c.white}${c.bold}${msg}${c.reset}`,
  heading: (msg) => `${c.magenta}${c.bold}${msg}${c.reset}`,
};

// ── Paths ───────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SAMPLES_DIR = path.resolve(__dirname, '../../shared/samples');
const CUSTOMERS_FILE = path.join(SAMPLES_DIR, 'dummy-customers.json');
const CWD = process.cwd();

// ── Utilities ───────────────────────────────────────────────

function ask(question, defaultValue) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const prompt = defaultValue
      ? `${question} ${c.dim}(${defaultValue})${c.reset}: `
      : `${question}: `;

    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue || '');
    });
  });
}

function fileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

function dirExists(dirPath) {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch {
    return false;
  }
}

function loadCustomers() {
  if (!fileExists(CUSTOMERS_FILE)) {
    return [];
  }
  const raw = fs.readFileSync(CUSTOMERS_FILE, 'utf-8');
  return JSON.parse(raw);
}

function resolveGrade(customerId) {
  const match = customerId.match(/grade-([abc])/i);
  if (match) {
    return match[1].toLowerCase();
  }
  return null;
}

function printBanner() {
  console.log('');
  console.log(`  ${c.bold}${c.cyan}╔══════════════════════════════════════════╗${c.reset}`);
  console.log(`  ${c.bold}${c.cyan}║${c.reset}  ${c.bold}apprx${c.reset} ${c.dim}— App Revenue Prescription CLI${c.reset}  ${c.bold}${c.cyan}║${c.reset}`);
  console.log(`  ${c.bold}${c.cyan}╚══════════════════════════════════════════╝${c.reset}`);
  console.log('');
}

// ── Command: init ───────────────────────────────────────────

async function cmdInit() {
  printBanner();

  // 1. Ask for customer ID
  console.log(fmt.info('  Initializing your app revenue prescription...\n'));

  const customerId = await ask(
    `  ${fmt.label('Customer ID')}`,
    'demo-grade-a'
  );

  // 2. Resolve grade from customer ID
  const grade = resolveGrade(customerId);
  if (!grade) {
    console.log('');
    console.log(fmt.error('  Error: Could not determine grade from customer ID.'));
    console.log(fmt.dim('  Expected format: demo-grade-a, demo-grade-b, or demo-grade-c'));
    console.log('');
    process.exit(1);
  }

  // 3. Find the sample file
  const sampleFilename = `grade-${grade}.apprx.md`;
  const samplePath = path.join(SAMPLES_DIR, sampleFilename);

  if (!fileExists(samplePath)) {
    console.log('');
    console.log(fmt.error(`  Error: Sample file not found: ${sampleFilename}`));
    console.log(fmt.dim(`  Looked in: ${SAMPLES_DIR}`));
    console.log('');
    process.exit(1);
  }

  // 4. Load customer data for display
  const customers = loadCustomers();
  const customer = customers.find((c) => c.id === customerId);

  // 5. Copy sample to cwd as .apprx.md
  const destPath = path.join(CWD, '.apprx.md');
  const sampleContent = fs.readFileSync(samplePath, 'utf-8');
  fs.writeFileSync(destPath, sampleContent, 'utf-8');

  console.log('');
  console.log(fmt.success('  ✓ Created .apprx.md'));

  // 6. Detect AI coding tools and integrate

  // Claude Code detection: CLAUDE.md in cwd
  const claudeMdPath = path.join(CWD, 'CLAUDE.md');
  if (fileExists(claudeMdPath)) {
    const referenceLine = '\nPlease also read .apprx.md for app monetization context.\n';
    const existing = fs.readFileSync(claudeMdPath, 'utf-8');
    if (!existing.includes('.apprx.md')) {
      fs.appendFileSync(claudeMdPath, referenceLine, 'utf-8');
      console.log(fmt.success('  ✓ Updated CLAUDE.md with .apprx.md reference'));
    } else {
      console.log(fmt.dim('  ⊘ CLAUDE.md already references .apprx.md'));
    }
  }

  // Cursor detection: .cursor/ directory or .cursorrules file
  const cursorDir = path.join(CWD, '.cursor');
  const cursorRulesFile = path.join(CWD, '.cursorrules');
  const hasCursor = dirExists(cursorDir) || fileExists(cursorRulesFile);

  if (hasCursor) {
    const targetFile = fileExists(cursorRulesFile) ? cursorRulesFile : path.join(cursorDir, 'rules');

    if (fileExists(targetFile)) {
      const existing = fs.readFileSync(targetFile, 'utf-8');
      if (!existing.includes('.apprx.md')) {
        const referenceLine = '\nPlease also read .apprx.md for app monetization context.\n';
        fs.appendFileSync(targetFile, referenceLine, 'utf-8');
        console.log(fmt.success(`  ✓ Updated ${path.basename(targetFile)} with .apprx.md reference`));
      } else {
        console.log(fmt.dim(`  ⊘ ${path.basename(targetFile)} already references .apprx.md`));
      }
    } else {
      // Create .cursorrules if .cursor/ dir exists but no rules file
      const referenceLine = 'Please also read .apprx.md for app monetization context.\n';
      fs.writeFileSync(cursorRulesFile, referenceLine, 'utf-8');
      console.log(fmt.success('  ✓ Created .cursorrules with .apprx.md reference'));
    }
  }

  // 7. Print summary
  console.log('');
  console.log(`  ${c.dim}─────────────────────────────────────────${c.reset}`);
  console.log('');

  if (customer) {
    console.log(`  ${fmt.label('App')}          ${customer.name}`);
    console.log(`  ${fmt.label('Grade')}        ${customer.measurementGrade}`);
    console.log(`  ${fmt.label('Level')}        ${customer.level} — ${customer.levelName}`);
    console.log(`  ${fmt.label('Category')}     ${customer.category} > ${customer.categorySub}`);
    if (customer.metrics.monthlyRevenue > 0) {
      console.log(`  ${fmt.label('Revenue')}      ₩${customer.metrics.monthlyRevenue.toLocaleString()}/월`);
    } else {
      console.log(`  ${fmt.label('Revenue')}      ₩0 (수익 모델 미설정)`);
    }
  } else {
    console.log(`  ${fmt.label('Customer')}     ${customerId}`);
    console.log(`  ${fmt.label('Grade')}        ${grade.toUpperCase()}`);
  }

  console.log('');
  console.log(`  ${c.dim}─────────────────────────────────────────${c.reset}`);
  console.log('');
  console.log(fmt.success('  Setup complete!'));
  console.log(fmt.dim('  Run `apprx status` to see your prescription summary.'));
  console.log('');
}

// ── Command: status ─────────────────────────────────────────

function cmdStatus() {
  printBanner();

  const apprxPath = path.join(CWD, '.apprx.md');

  if (!fileExists(apprxPath)) {
    console.log(fmt.error('  Error: .apprx.md not found in current directory.'));
    console.log(fmt.dim('  Run `apprx init` to set up your prescription first.'));
    console.log('');
    process.exit(1);
  }

  const content = fs.readFileSync(apprxPath, 'utf-8');
  const lines = content.split('\n');

  // Parse the markdown into sections
  const sections = {};
  let currentSection = null;

  for (const line of lines) {
    if (line.startsWith('## ')) {
      currentSection = line.replace('## ', '').trim();
      sections[currentSection] = [];
    } else if (currentSection) {
      sections[currentSection].push(line);
    }
  }

  // Extract app name from first line
  const titleLine = lines[0] || '';
  const appName = titleLine.replace(/^#\s*App Revenue Prescription\s*—\s*/, '').trim();

  // Print formatted status
  console.log(`  ${fmt.heading('App')}  ${fmt.bold(appName)}`);
  console.log('');

  // Current state
  if (sections['현재 상태']) {
    console.log(`  ${fmt.heading('┌ 현재 상태')}`);
    for (const line of sections['현재 상태']) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ')) {
        const content = trimmed.slice(2);
        const [key, ...valueParts] = content.split(':');
        const value = valueParts.join(':').trim();
        if (key && value) {
          console.log(`  ${fmt.label('│')} ${fmt.dim(key.trim() + ':')} ${fmt.value(value)}`);
        }
      }
    }
    console.log(`  ${fmt.heading('└')}`);
    console.log('');
  }

  // Key metrics
  if (sections['핵심 지표']) {
    console.log(`  ${fmt.heading('┌ 핵심 지표')}`);
    for (const line of sections['핵심 지표']) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ')) {
        const content = trimmed.slice(2);
        // Handle multi-metric lines like "DAU: 2,500 | MAU: 12,000"
        const parts = content.split('|').map((p) => p.trim());
        const formatted = parts.map((part) => {
          const [key, ...vals] = part.split(':');
          const val = vals.join(':').trim();
          return `${c.dim}${key.trim()}:${c.reset} ${c.bold}${val}${c.reset}`;
        }).join(`  ${c.dim}|${c.reset}  `);
        console.log(`  ${fmt.label('│')} ${formatted}`);
      }
    }
    console.log(`  ${fmt.heading('└')}`);
    console.log('');
  }

  // Diagnosis
  const diagnosisKey = Object.keys(sections).find((k) => k.startsWith('진단'));
  if (diagnosisKey && sections[diagnosisKey]) {
    console.log(`  ${fmt.heading('┌ ' + diagnosisKey)}`);
    for (const line of sections[diagnosisKey]) {
      const trimmed = line.trim();
      if (trimmed.length > 0 && !trimmed.startsWith('#')) {
        console.log(`  ${fmt.label('│')} ${trimmed}`);
      }
    }
    console.log(`  ${fmt.heading('└')}`);
    console.log('');
  }

  // This week's tasks
  if (sections['이번 주 과제']) {
    console.log(`  ${fmt.heading('┌ 이번 주 과제')}`);
    for (const line of sections['이번 주 과제']) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- [ ]')) {
        const task = trimmed.replace('- [ ]', '').trim();
        console.log(`  ${fmt.label('│')} ${c.yellow}○${c.reset} ${task}`);
      } else if (trimmed.startsWith('- [x]') || trimmed.startsWith('- [X]')) {
        const task = trimmed.replace(/- \[[xX]\]/, '').trim();
        console.log(`  ${fmt.label('│')} ${c.green}●${c.reset} ${c.dim}${task}${c.reset}`);
      }
    }
    console.log(`  ${fmt.heading('└')}`);
    console.log('');
  }

  // Recommended model
  const recoKey = Object.keys(sections).find((k) => k.startsWith('추천 수익'));
  if (recoKey && sections[recoKey]) {
    console.log(`  ${fmt.heading('┌ ' + recoKey)}`);
    for (const line of sections[recoKey]) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ')) {
        const content = trimmed.slice(2);
        console.log(`  ${fmt.label('│')} ${content}`);
      }
    }
    console.log(`  ${fmt.heading('└')}`);
    console.log('');
  }

  // Revenue simulation
  if (sections['수익 시뮬레이션']) {
    console.log(`  ${fmt.heading('┌ 수익 시뮬레이션')}`);
    for (const line of sections['수익 시뮬레이션']) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ')) {
        const content = trimmed.slice(2);
        if (content.startsWith('목표')) {
          console.log(`  ${fmt.label('│')} ${c.green}${c.bold}${content}${c.reset}`);
        } else if (content.startsWith('계산식')) {
          console.log(`  ${fmt.label('│')} ${c.dim}${content}${c.reset}`);
        } else {
          console.log(`  ${fmt.label('│')} ${content}`);
        }
      }
    }
    console.log(`  ${fmt.heading('└')}`);
    console.log('');
  }

  // Measurement gaps (for Grade B/C)
  if (sections['측정 보완 필요']) {
    console.log(`  ${fmt.heading('┌ ⚠ 측정 보완 필요')}`);
    for (const line of sections['측정 보완 필요']) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- [ ]')) {
        const task = trimmed.replace('- [ ]', '').trim();
        console.log(`  ${fmt.label('│')} ${c.yellow}○${c.reset} ${task}`);
      } else if (trimmed.length > 0 && !trimmed.startsWith('#')) {
        console.log(`  ${fmt.label('│')} ${trimmed}`);
      }
    }
    console.log(`  ${fmt.heading('└')}`);
    console.log('');
  }

  if (sections['측정 인프라 세팅 필요']) {
    console.log(`  ${fmt.heading('┌ ⚠ 측정 인프라 세팅 필요')}`);
    for (const line of sections['측정 인프라 세팅 필요']) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- [ ]')) {
        const task = trimmed.replace('- [ ]', '').trim();
        console.log(`  ${fmt.label('│')} ${c.yellow}○${c.reset} ${task}`);
      } else if (trimmed.startsWith('###')) {
        const heading = trimmed.replace(/^#+\s*/, '');
        console.log(`  ${fmt.label('│')}`);
        console.log(`  ${fmt.label('│')} ${c.bold}${heading}${c.reset}`);
      } else if (trimmed.length > 0 && !trimmed.startsWith('#')) {
        console.log(`  ${fmt.label('│')} ${c.dim}${trimmed}${c.reset}`);
      }
    }
    console.log(`  ${fmt.heading('└')}`);
    console.log('');
  }

  // Coding notes
  if (sections['코딩 시 참고']) {
    console.log(`  ${fmt.heading('┌ 코딩 시 참고')}`);
    for (const line of sections['코딩 시 참고']) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ')) {
        const content = trimmed.slice(2);
        console.log(`  ${fmt.label('│')} ${c.dim}${content}${c.reset}`);
      }
    }
    console.log(`  ${fmt.heading('└')}`);
    console.log('');
  }

  // Dashboard link
  const dashboardMatch = content.match(/대시보드:\s*(https?:\/\/\S+)/);
  if (dashboardMatch) {
    console.log(`  ${fmt.label('Dashboard')}  ${c.cyan}${c.bold}${dashboardMatch[1]}${c.reset}`);
    console.log('');
  }
}

// ── Command: help ───────────────────────────────────────────

function cmdHelp() {
  printBanner();

  console.log(`  ${fmt.bold('Usage:')}  apprx <command>\n`);
  console.log(`  ${fmt.bold('Commands:')}`);
  console.log(`    ${fmt.info('init')}      Initialize .apprx.md in the current directory`);
  console.log(`    ${fmt.info('status')}    Show prescription summary from .apprx.md`);
  console.log(`    ${fmt.info('help')}      Show this help message`);
  console.log('');
  console.log(`  ${fmt.bold('Examples:')}`);
  console.log(fmt.dim('    $ apprx init'));
  console.log(fmt.dim('    $ apprx status'));
  console.log('');
}

// ── Main ────────────────────────────────────────────────────

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'init':
    cmdInit().catch((err) => {
      console.error(fmt.error(`\n  Error: ${err.message}\n`));
      process.exit(1);
    });
    break;

  case 'status':
    cmdStatus();
    break;

  case 'help':
  case '--help':
  case '-h':
    cmdHelp();
    break;

  default:
    if (command) {
      console.log(fmt.error(`\n  Unknown command: ${command}\n`));
    }
    cmdHelp();
    process.exit(command ? 1 : 0);
    break;
}

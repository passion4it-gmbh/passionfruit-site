#!/usr/bin/env node
/**
 * TDD tests for scripts/check-bilingual.mjs
 * Runner: pnpm exec node --test scripts/check-bilingual.test.mjs
 */

import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const SCRIPT = new URL("../scripts/check-bilingual.mjs", import.meta.url)
  .pathname;

/**
 * Creates a markdown file with the given translationKey in a collection/locale subdir.
 * @param {string} rootDir  - tmp root (acts as src/content)
 * @param {string} collection
 * @param {string} locale   - 'de' | 'en'
 * @param {string} slug     - filename without .md
 * @param {string|null} translationKey - null means omit the field entirely
 */
function seedCollection(rootDir, collection, locale, slug, translationKey) {
  const dir = join(rootDir, collection, locale);
  mkdirSync(dir, { recursive: true });
  const frontmatter =
    translationKey !== null
      ? `---\ntranslationKey: "${translationKey}"\ntitle: "Test ${slug}"\n---\nBody.`
      : `---\ntitle: "No key ${slug}"\n---\nBody.`;
  writeFileSync(join(dir, `${slug}.md`), frontmatter);
}

function runScript(rootDir) {
  return spawnSync("node", [SCRIPT, `--root=${rootDir}`], { encoding: "utf8" });
}

// ---------------------------------------------------------------------------
// 1. All-balanced case
// ---------------------------------------------------------------------------
describe("all-balanced case", () => {
  let tmpDir;

  before(() => {
    tmpDir = mkdtempSync(join(tmpdir(), "bilingual-test-"));
    seedCollection(tmpDir, "blog", "de", "post-one", "post-one");
    seedCollection(tmpDir, "blog", "de", "post-two", "post-two");
    seedCollection(tmpDir, "blog", "en", "post-one", "post-one");
    seedCollection(tmpDir, "blog", "en", "post-two", "post-two");
  });

  after(() => rmSync(tmpDir, { recursive: true, force: true }));

  it("exits 0", () => {
    const result = runScript(tmpDir);
    assert.equal(result.status, 0, `stderr: ${result.stderr}`);
  });

  it("prints a balanced summary line for blog", () => {
    const result = runScript(tmpDir);
    assert.match(result.stdout, /blog.*2\/2.*balanced/i);
  });
});

// ---------------------------------------------------------------------------
// 2. Missing EN case
// ---------------------------------------------------------------------------
describe("missing-EN case", () => {
  let tmpDir;

  before(() => {
    tmpDir = mkdtempSync(join(tmpdir(), "bilingual-test-"));
    seedCollection(tmpDir, "blog", "de", "welcome", "welcome");
    // blog/en/ intentionally left empty (dir created but no files)
    mkdirSync(join(tmpDir, "blog", "en"), { recursive: true });
  });

  after(() => rmSync(tmpDir, { recursive: true, force: true }));

  it("exits 1", () => {
    const result = runScript(tmpDir);
    assert.equal(result.status, 1, `stdout: ${result.stdout}`);
  });

  it('names collection, locale "en", and orphan key "welcome" in output', () => {
    const result = runScript(tmpDir);
    const combined = result.stdout + result.stderr;
    assert.match(combined, /blog/);
    assert.match(combined, /en/);
    assert.match(combined, /welcome/);
  });
});

// ---------------------------------------------------------------------------
// 3. Missing DE case
// ---------------------------------------------------------------------------
describe("missing-DE case", () => {
  let tmpDir;

  before(() => {
    tmpDir = mkdtempSync(join(tmpdir(), "bilingual-test-"));
    mkdirSync(join(tmpDir, "blog", "de"), { recursive: true });
    seedCollection(tmpDir, "blog", "en", "about", "about");
  });

  after(() => rmSync(tmpDir, { recursive: true, force: true }));

  it("exits 1", () => {
    const result = runScript(tmpDir);
    assert.equal(result.status, 1, `stdout: ${result.stdout}`);
  });

  it('names collection, locale "de", and orphan key "about" in output', () => {
    const result = runScript(tmpDir);
    const combined = result.stdout + result.stderr;
    assert.match(combined, /blog/);
    assert.match(combined, /de/);
    assert.match(combined, /about/);
  });
});

// ---------------------------------------------------------------------------
// 4. Duplicate translationKey case
// ---------------------------------------------------------------------------
describe("duplicate translationKey case", () => {
  let tmpDir;

  before(() => {
    tmpDir = mkdtempSync(join(tmpdir(), "bilingual-test-"));
    seedCollection(tmpDir, "blog", "de", "file-a", "dup-key");
    seedCollection(tmpDir, "blog", "de", "file-b", "dup-key"); // same key!
    seedCollection(tmpDir, "blog", "en", "file-a", "dup-key");
  });

  after(() => rmSync(tmpDir, { recursive: true, force: true }));

  it("exits 1", () => {
    const result = runScript(tmpDir);
    assert.equal(result.status, 1, `stdout: ${result.stdout}`);
  });

  it("names collection, locale, key, and both filenames", () => {
    const result = runScript(tmpDir);
    const combined = result.stdout + result.stderr;
    assert.match(combined, /blog/);
    assert.match(combined, /de/);
    assert.match(combined, /dup-key/);
    assert.match(combined, /file-a/);
    assert.match(combined, /file-b/);
  });
});

// ---------------------------------------------------------------------------
// 5. Missing translationKey field in frontmatter
// ---------------------------------------------------------------------------
describe("missing translationKey field", () => {
  let tmpDir;

  before(() => {
    tmpDir = mkdtempSync(join(tmpdir(), "bilingual-test-"));
    seedCollection(tmpDir, "blog", "de", "no-key-file", null); // no translationKey
    seedCollection(tmpDir, "blog", "en", "paired", "paired");
  });

  after(() => rmSync(tmpDir, { recursive: true, force: true }));

  it("exits 1", () => {
    const result = runScript(tmpDir);
    assert.equal(result.status, 1, `stdout: ${result.stdout}`);
  });

  it("names the offending file in the output", () => {
    const result = runScript(tmpDir);
    const combined = result.stdout + result.stderr;
    assert.match(combined, /no-key-file/);
  });
});

// ---------------------------------------------------------------------------
// 6. Empty collection case — both locales empty
// ---------------------------------------------------------------------------
describe("empty collection case", () => {
  let tmpDir;

  before(() => {
    tmpDir = mkdtempSync(join(tmpdir(), "bilingual-test-"));
    mkdirSync(join(tmpDir, "events", "de"), { recursive: true });
    mkdirSync(join(tmpDir, "events", "en"), { recursive: true });
  });

  after(() => rmSync(tmpDir, { recursive: true, force: true }));

  it("exits 0", () => {
    const result = runScript(tmpDir);
    assert.equal(result.status, 0, `stderr: ${result.stderr}`);
  });

  it('prints a "no entries" notice for the collection', () => {
    const result = runScript(tmpDir);
    assert.match(result.stdout, /events/);
    assert.match(result.stdout, /no entries/i);
  });
});

// ---------------------------------------------------------------------------
// 7. No content directory case
// ---------------------------------------------------------------------------
describe("no content directory case", () => {
  let tmpDir;

  before(() => {
    tmpDir = mkdtempSync(join(tmpdir(), "bilingual-test-"));
    // rootDir itself doesn't exist — pass a nonexistent subdir
  });

  after(() => rmSync(tmpDir, { recursive: true, force: true }));

  it("exits 0", () => {
    const result = runScript(join(tmpDir, "nonexistent"));
    assert.equal(result.status, 0, `stderr: ${result.stderr}`);
  });

  it('prints "no collections"', () => {
    const result = runScript(join(tmpDir, "nonexistent"));
    assert.match(result.stdout, /no collections/i);
  });
});

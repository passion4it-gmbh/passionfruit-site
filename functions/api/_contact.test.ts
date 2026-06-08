/**
 * Unit tests for functions/api/_contact.ts helpers.
 *
 * Runner: tsx --test functions/api/_contact.test.ts
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  FROM_EMAIL,
  TO_EMAIL,
  buildBrevoPayload,
  isHoneypotTripped,
  validateContact,
} from "./_contact.ts";

// ---------------------------------------------------------------------------
// isHoneypotTripped
// ---------------------------------------------------------------------------

test("isHoneypotTripped: returns true for non-empty company", () => {
  assert.equal(
    isHoneypotTripped({
      name: "Bot",
      email: "bot@evil.com",
      message: "hi",
      company: "ACME Corp",
    }),
    true,
  );
});

test("isHoneypotTripped: returns true for whitespace-padded company", () => {
  assert.equal(isHoneypotTripped({ company: "  evil  " }), true);
});

test("isHoneypotTripped: returns false when company is missing", () => {
  assert.equal(
    isHoneypotTripped({
      name: "Alice",
      email: "alice@example.com",
      message: "hello",
    }),
    false,
  );
});

test("isHoneypotTripped: returns false when company is empty string", () => {
  assert.equal(isHoneypotTripped({ company: "" }), false);
});

test("isHoneypotTripped: returns false when company is whitespace-only", () => {
  assert.equal(isHoneypotTripped({ company: "   " }), false);
});

test("isHoneypotTripped: returns false for non-object input", () => {
  assert.equal(isHoneypotTripped(null), false);
  assert.equal(isHoneypotTripped("string"), false);
  assert.equal(isHoneypotTripped(42), false);
});

// ---------------------------------------------------------------------------
// validateContact
// ---------------------------------------------------------------------------

test("validateContact: accepts valid input and trims values", () => {
  const result = validateContact({
    name: "  Alice  ",
    email: "  alice@example.com  ",
    message: "  Hello there!  ",
    company: "",
  });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.data.name, "Alice");
    assert.equal(result.data.email, "alice@example.com");
    assert.equal(result.data.message, "Hello there!");
  }
});

test("validateContact: rejects missing name", () => {
  assert.equal(validateContact({ email: "a@b.com", message: "hi" }).ok, false);
});

test("validateContact: rejects blank name", () => {
  assert.equal(
    validateContact({ name: "   ", email: "a@b.com", message: "hi" }).ok,
    false,
  );
});

test("validateContact: rejects missing email", () => {
  assert.equal(validateContact({ name: "Alice", message: "hi" }).ok, false);
});

test("validateContact: rejects blank email", () => {
  assert.equal(
    validateContact({ name: "Alice", email: "   ", message: "hi" }).ok,
    false,
  );
});

test("validateContact: rejects missing message", () => {
  assert.equal(validateContact({ name: "Alice", email: "a@b.com" }).ok, false);
});

test("validateContact: rejects blank message", () => {
  assert.equal(
    validateContact({ name: "Alice", email: "a@b.com", message: "  " }).ok,
    false,
  );
});

test("validateContact: rejects malformed email", () => {
  assert.equal(
    validateContact({ name: "Alice", email: "not-an-email", message: "hi" }).ok,
    false,
  );
});

test("validateContact: rejects email without domain", () => {
  assert.equal(
    validateContact({ name: "Alice", email: "alice@", message: "hi" }).ok,
    false,
  );
});

test("validateContact: rejects non-object input", () => {
  assert.equal(validateContact(null).ok, false);
  assert.equal(validateContact("string").ok, false);
  assert.equal(validateContact(42).ok, false);
});

test("validateContact: rejects name exceeding 200 chars", () => {
  assert.equal(
    validateContact({ name: "A".repeat(201), email: "a@b.com", message: "hi" })
      .ok,
    false,
  );
});

test("validateContact: rejects email exceeding 254 chars", () => {
  const longEmail = "a".repeat(249) + "@b.com"; // 255 chars, > 254
  assert.equal(
    validateContact({ name: "Alice", email: longEmail, message: "hi" }).ok,
    false,
  );
});

test("validateContact: rejects message exceeding 5000 chars", () => {
  assert.equal(
    validateContact({
      name: "Alice",
      email: "a@b.com",
      message: "X".repeat(5001),
    }).ok,
    false,
  );
});

// ---------------------------------------------------------------------------
// buildBrevoPayload
// ---------------------------------------------------------------------------

test("buildBrevoPayload: sender.email matches FROM_EMAIL", () => {
  const payload = buildBrevoPayload({
    name: "Alice",
    email: "alice@example.com",
    message: "Hello",
  });
  assert.equal(payload.sender.email, FROM_EMAIL);
});

test("buildBrevoPayload: to[0].email matches TO_EMAIL", () => {
  const payload = buildBrevoPayload({
    name: "Alice",
    email: "alice@example.com",
    message: "Hello",
  });
  assert.equal(payload.to[0].email, TO_EMAIL);
});

test("buildBrevoPayload: replyTo.email matches input email", () => {
  const payload = buildBrevoPayload({
    name: "Alice",
    email: "alice@example.com",
    message: "Hello",
  });
  assert.equal(payload.replyTo.email, "alice@example.com");
});

test("buildBrevoPayload: subject contains input name", () => {
  const payload = buildBrevoPayload({
    name: "Alice",
    email: "alice@example.com",
    message: "Hello",
  });
  assert.ok(
    payload.subject.includes("Alice"),
    `subject should include 'Alice': ${payload.subject}`,
  );
});

test("buildBrevoPayload: textContent contains input message", () => {
  const payload = buildBrevoPayload({
    name: "Alice",
    email: "alice@example.com",
    message: "Hello there!",
  });
  assert.ok(
    payload.textContent.includes("Hello there!"),
    `textContent should include message: ${payload.textContent}`,
  );
});

test("buildBrevoPayload: textContent contains name and email", () => {
  const payload = buildBrevoPayload({
    name: "Alice",
    email: "alice@example.com",
    message: "Msg",
  });
  assert.ok(payload.textContent.includes("Alice"));
  assert.ok(payload.textContent.includes("alice@example.com"));
});

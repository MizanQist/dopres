import { test } from "node:test";
import assert from "node:assert/strict";
import { validateContact } from "./contact.ts";

test("rejects empty and malformed input", () => {
  assert.deepEqual(Object.keys(validateContact(null).errors ?? {}), ["name", "email", "message"]);
  assert.ok(validateContact({ name: "Al", email: "nope", message: "long enough here" }).errors?.email);
});

test("accepts a valid payload, trims and caps fields", () => {
  const { values, errors } = validateContact({ name: "  Ada  ", email: "ada@example.com", message: "x".repeat(5000) });
  assert.equal(errors, null);
  assert.equal(values.name, "Ada");
  assert.equal(values.message.length, 4000);
});

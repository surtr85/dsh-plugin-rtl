import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

// Test suite for dsh-plugin-rtl

const RTL_CHARS = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

function hasRTL(text) {
  if (!text) return false;
  return RTL_CHARS.test(text);
}

function getFirstStrongDirection(text) {
  if (!text) return null;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (
      (code >= 0x0590 && code <= 0x08ff) ||
      (code >= 0xfb1d && code <= 0xfdff) ||
      (code >= 0xfe70 && code <= 0xfeff)
    ) {
      return "rtl";
    }
    if (
      (code >= 0x0041 && code <= 0x005a) ||
      (code >= 0x0061 && code <= 0x007a) ||
      (code >= 0x00c0 && code <= 0x02af)
    ) {
      return "ltr";
    }
  }
  return null;
}

test("BiDi detection: Persian text identification", () => {
  assert.equal(hasRTL("سلام دنیا"), true);
  assert.equal(hasRTL("Hello World"), false);
  assert.equal(hasRTL("به عنوان یه پلاگین رسمی dsh"), true);
  assert.equal(hasRTL("( پاکش کن ازینجا )"), true);
  assert.equal(hasRTL("مثل تم claude"), true);
  assert.equal(hasRTL("12345 6789"), false);
  assert.equal(hasRTL(""), false);
  assert.equal(hasRTL(null), false);
});

test("First Strong Direction: correctly ignores leading neutrals and digits", () => {
  assert.equal(getFirstStrongDirection("سلام دنیا"), "rtl");
  assert.equal(getFirstStrongDirection("Hello World"), "ltr");
  assert.equal(getFirstStrongDirection("( پاکش کن ازینجا )"), "rtl");
  assert.equal(getFirstStrongDirection("به عنوان یه پلاگین رسمی dsh"), "rtl");
  assert.equal(getFirstStrongDirection("1. شروع فرآیند تست"), "rtl");
  assert.equal(getFirstStrongDirection("- bullet item in english"), "ltr");
  assert.equal(getFirstStrongDirection("  /* comment */ function test() {}"), "ltr");
  assert.equal(getFirstStrongDirection("... [123] فارسی"), "rtl");
  assert.equal(getFirstStrongDirection("12345"), null);
});

test("Package manifest compliance with DSH Plugin System", () => {
  const pkgPath = path.resolve("package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

  assert.equal(pkg.name, "dsh-plugin-rtl");
  assert.equal(pkg.type, "module");
  assert.ok(pkg.exports[".", "./client"]);
  assert.ok(pkg.dsh, "Missing dsh metadata");
  assert.ok(pkg.dsh.bundle, "Missing dsh.bundle");
  assert.equal(pkg.dsh.bundle.patch, "./cordis.patch.yml");
  assert.equal(pkg.dsh.client.platform, "web");
  assert.equal(pkg.dsh.client.immediately, true);

  const patchPath = path.resolve("cordis.patch.yml");
  assert.ok(fs.existsSync(patchPath), "cordis.patch.yml must exist");
  const patchContent = fs.readFileSync(patchPath, "utf-8");
  assert.ok(patchContent.includes("dsh-plugin-rtl"));
});

# altcha (vendored)

ALTCHA widget 3.2.3 + obfuscation plugin, MIT. Copied unmodified from the npm package
`altcha` (`dist/main/altcha.umd.min.cjs`, `dist/plugins/obfuscation.plugin.umd.min.cjs`).
Served first-party from `/vendor/altcha/` — no CDN, no outbound requests. Workers are inlined.

Guards the footer email: the address is stored AES-GCM-encrypted (`data-obfuscated`), the
reader's browser solves a small proof-of-work to derive the key, then a mailto link appears.

Regenerate the payload after changing the address:

    npx altcha-lib obfuscate "mailto:<address>"

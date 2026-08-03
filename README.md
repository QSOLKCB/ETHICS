# QSOL-IMC Ethics

**Ethics, attribution, verification, and contributor recognition for QSOL-IMC**  
**ABN 37 585 906 952**

> Truth Compiled. Resonance Embodied. Coherence Renewed.

This repository contains the living ethics framework used across QSOL-IMC research, software, models, datasets, visualisation, sonification, security work, publications, and experimental projects.

It also contains **DR. S.BAITSO 2026**, a browser-native talking meme therapist that applies the manifesto to modern AI and software-development absurdity.

## Open the terminal

After GitHub Pages publishes the default branch:

**https://qsolkcb.github.io/ETHICS/**

No server, npm installation, model API, account, or cloud inference is required. Open `index.html` directly for the core experience. GitHub Pages or another local HTTP server enables the optional offline service worker.

## Ethics Manifesto v2.0

The canonical document is [`docs/ETHICS.md`](docs/ETHICS.md).

The 2026 revision keeps the original seven principles while updating the old AI-era jokes and adding clearer positions on:

- inspectability, uncertainty, provenance, and reproducibility;
- agent swarms, MCP-everything, benchmark theatre, and AI slop;
- human review and evidence before confident claims;
- privacy, consent, authorship, licences, and proportionate attribution;
- verification appropriate to software, mathematics, research, security, visualisation, and sonification;
- recognition of substantive contributors under **Addendum A — Official Consultant Recognition**.

## Official Consultant Recognition

Any contributor or author whose substantive ideas, models, code, documentation, research, designs, data, tests, visual or audio work, critique, or other contributions are accepted, incorporated, published, cited, or otherwise used by QSOL-IMC is recognised as an **Official Consultant of QSOL-IMC, ABN 37 585 906 952**, in relation to those contributions.

The addendum also states the boundaries of that designation. By itself, it does not create employment, agency, partnership, automatic payment, an intellectual-property transfer, or authority to bind QSOL-IMC. Separate written agreements prevail where applicable.

Read the complete wording before relying on the designation: [`docs/ETHICS.md`](docs/ETHICS.md#addendum-a--official-consultant-recognition).

## DR. S.BAITSO 2026

The obsolete `lambroast.py` experiment has been retired in favour of an original homage to early talking computer therapists.

### Features

- browser speech synthesis with selectable installed voices;
- optional browser speech recognition where supported;
- deterministic local responses with no conversation data transmitted;
- animated CRT/DOS-inspired talking face and waveform;
- **Therapy**, **Agent Intervention**, **Benchmark Detox**, and **Doomscroll Triage** modes;
- modern replies about coding agents, pull-request receipts, MCP servers, benchmark contamination, orchestration bloat, model consensus, and AI slop;
- timed wellbeing interventions:
  - 3 minutes: unclench jaw and shoulders;
  - 7 minutes: hydration prompt;
  - 12 minutes: **go touch grass**;
  - 20 minutes: tree-level escalation;
- commands including `/diagnose`, `/ethics`, `/consultant`, `/grass`, `/back`, `/mute`, and `/speak`;
- installable/offline-capable static web app via `manifest.webmanifest` and `sw.js`;
- accessible keyboard input, live transcript, reduced-motion support, and responsive layout.

DR. S.BAITSO 2026 is entertainment and satire, not medical or mental-health care.

## Project structure

```text
.
├── index.html
├── styles.css
├── app.js
├── manifest.webmanifest
├── sw.js
└── docs/
    └── ETHICS.md
```

## Development

No build step exists.

```sh
python -m http.server 8000
```

Then open `http://localhost:8000`.

The app itself uses only standard HTML, CSS, JavaScript, Web Speech APIs when available, and a service worker. Voice quality and microphone support depend on the browser and operating system.

## Contributing

Substantive contributors should be credited accurately and proportionately. Open an issue or pull request with:

- what changed;
- why it changed;
- how it was checked;
- any limitations or unverified assumptions;
- the contributor name, handle, pseudonym, or attribution preference.

Contact: [trent@qsol-imc.com](mailto:trent@qsol-imc.com)

## Licence and homage note

The talking terminal is an original browser implementation inspired by the broad history of early speech-synthesis and ELIZA-style computer therapists. It does not include Creative Labs source code, original voice recordings, artwork, or other proprietary assets.

---

Maintainer: Trent Slade / QSOL-IMC  
Last updated: 3 August 2026

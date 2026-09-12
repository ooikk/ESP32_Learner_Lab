# ESP32 Learning Lab

A portable, dependency-free static website for ESP32, electronics, and C programming education.

## Site name

The current working name is **ESP32 Learning Lab** because it is clear, searchable, and suitable for learners from teenagers to adults.

Other suitable names:

1. **Embedded Pathways** — broader and suitable if the curriculum later expands beyond ESP32.
2. **Build32 Academy** — short, energetic, and project-led.
3. **Circuit to Code Lab** — clearly connects electronics and programming.
4. **ESP32 Practical Academy** — formal and training-oriented.
5. **Connected Maker Lab** — friendly and suitable for IoT-focused workshops.

## Edit the site

All public files are in `dist/`. Each page is plain HTML and shares:

- `dist/assets/styles.css` for layout and visual design
- `dist/assets/site.js` for the mobile menu, curriculum tabs, year, and LED demonstration
- `dist/assets/favicon.svg` for the browser icon

The nine detailed project pages are generated into `dist/projects/` from
`tools/build-project-pages.mjs`. Edit the project data in that script, then run:

```bash
node tools/build-project-pages.mjs
```

Each project page includes:

- project description and learning level
- engineering fundamentals
- bill of materials
- labelled ESP32-S3 connection diagram
- partial instructional code
- expected outcomes
- troubleshooting and extension ideas
- note that supporting teaching materials are shared privately during lessons

Update the public email address in `dist/contact.html`. Course dates and fees are intentionally shown as “By arrangement” until public details are confirmed.

## Static hosting

The files in `dist/` can be copied to the document root of any static host. Because all internal links are relative, the site works both at:

- a subdirectory-based site URL
- a future custom domain

Review the proposed changes before publishing. The included `.nojekyll` file is harmless on general static hosts and can be retained.

## Custom domain later

Add a file named `CNAME` beside `index.html` only if your hosting provider uses that convention, then configure the domain with the provider. No HTML path changes should be required.

## Local preview

Open `dist/index.html` directly in a browser, or serve the `dist/` folder with any static web server.

## Content sources

- Course examples and teaching notes: private materials
- Official Arduino ESP32 guide: https://docs.espressif.com/projects/arduino-esp32/en/latest/getting_started.html
- Official ESP32-S3 overview: https://www.espressif.com/en/products/socs/esp32-s3

ESP32 is a trademark of Espressif Systems.

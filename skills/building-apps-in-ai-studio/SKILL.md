---
name: building-apps-in-ai-studio
description: Build apps in Google AI Studio's Build mode: pick the right platform (web or native Android), compile inside AI Studio, get a finished app out (including the APK copy trick), and finish an existing app by importing its source from GitHub. Use when the user wants to build, compile, export, or continue an app in AI Studio.
category: development
---

# Building Apps in AI Studio

Google AI Studio's Build mode (aistudio.google.com/apps) turns a
prompt into a working app, with an in-app Gemini that edits the
project. The surface is easy to misread: the default platform is
only one of two, and several limits below look like dead ends
until you know the route around them. Check the current surface
and Google's Build-mode docs before asserting any limit.

## Pick the platform first

- **Web (the default)**: a React / Vite / TypeScript project with
  a hosted preview. Publish gives a public URL; exports are a
  source ZIP download, Push to GitHub, or Open in Antigravity.
- **Android (the platform picker / "Build an Android app" chip)**:
  a real native Kotlin + Jetpack Compose project, built by Gradle
  in Google's cloud, with a browser emulator preview, Install via
  USB, Play publishing options, and a ZIP export of the source.
  GitHub export is not available for Android projects.
- A check that only uses the default platform will "verify" that
  AI Studio is web-only, and be wrong. Always open the platform
  picker before describing what AI Studio can build.

## Compiling

- AI Studio compiles Android projects natively in its cloud: the
  build panel runs the Gradle build and reports success or the
  failing error. Treat that as the compile path; downloading the
  source ZIP and building locally is the fallback, not the
  default.
- Web projects build and preview in place; a successful preview
  render is the web equivalent of a passing build.

## Getting a finished Android app out

- There is **no direct APK download**. The compiled outputs are
  "Install via USB" (a device connected to the browser's machine)
  and "Install with Google Play" (personal library / internal
  testing). The export ZIP carries source only.
- The build outputs do exist inside the build container
  (`app/build/outputs/apk/debug/app-debug.apk`), but the File
  Explorer hides the `build/` directory, so searching the tree
  for the APK finds nothing.
- **The copy trick**: ask the in-app Gemini to copy the built APK
  to the project root, e.g. `cp app/build/outputs/apk/debug/app-debug.apk ./app.apk`.
  The file then appears in the File Explorer, and Export ->
  Download as .zip carries it out with the source.
- Verify any extracted APK before handing it over: check its
  package name and version with aapt badging and confirm the
  signature with `apksigner verify`. The in-app Gemini may claim
  the APK is directly downloadable from the file explorer; only
  the copy-to-root route works.

## Finishing an existing app

- Uploading a compiled **.apk binary is rejected** ("File types
  are not supported"), and there is no import-project button for
  binaries. The rejection is by file type, not by app: one test
  settles a whole set.
- The import lane is code: Build mode -> Add files (+) ->
  **Import from GitHub**. Finish existing apps inside AI Studio
  by importing their source repository, never the binary.
- **An import converts the app.** AI Studio states this in the
  import dialog: it supports web and Android apps and converts
  other projects automatically, and imported code does not stay
  synced with GitHub. A project in an unsupported stack (for
  example classic Java/XML Android) comes back rewritten in the
  AI Studio stack (Kotlin + Jetpack Compose), and the conversion
  takes real time.
- **Identity can shift on import**: the code namespace may
  survive while the applicationId is reassigned to an AI Studio
  package, so the imported build installs as a different app
  beside the original, not as its upgrade. Imported projects can
  also keep debug signing, which Play upload endpoints reject.
- After any import, audit the rewritten code against a written
  behavior spec of the original (screens, entry points, timings,
  stored state) and confirm the build passes before treating the
  conversion as faithful. Faithful is a finding, not a default.

## Testing honestly

- The Android emulator preview can stall on "Connecting to
  device..." and never render, across projects and reloads. Do
  not promise an in-emulator test until one actually connects;
  installing the extracted APK on a real device is the reliable
  test lane.
- An AI Studio twin and the original app are different packages:
  if both carry a service that hunts the same UI (for example an
  accessibility service), disable the original's before enabling
  the twin's, or both will act on the same screen.

## Publishing notes (Android personal library)

- Publish -> "Add to your personal library on Google Play"
  installs the app privately to the owner's Play library: no
  public listing, no developer account fee. App name and package
  name are read-only in the create form; the package is whatever
  applicationId the project carries.
- Personal-library publishing rejects apps requesting restricted
  high-risk permissions (SMS / Call Log access, accessibility
  services, notification-listener binding, install-packages),
  and rejects debug-signed APKs. A bare "Couldn't create app"
  failure hides the real API error; the "Ask Gemini to fix" path
  surfaces it. Do not blind-retry an ambiguous create failure:
  read the underlying error first.
- Wear OS is documented as compatible, but always inspect the
  export's manifest and dependencies before claiming watch fit:
  a generated project can carry watch flags while its UI is
  phone Compose rather than Wear Compose.

---
title: "Native Apps Are a Trap"
description: "App stores promised software distribution paradise. Instead, they created walled gardens that hurt users and developers alike. PWAs offer a way out."
date: "2026-03-21"
tag: "Product"
layout: "blog"
---

![Illustration of a phone screen with app icons behind iron bars, contrasted with a browser window flying free](/blog/native-apps-trap-hero.svg)

## The app store illusion

When Apple launched the App Store in 2008, it felt like a revolution. One place to find, install, and update software. Clean, curated, trustworthy. Developers got distribution; users got convenience. Everyone won.

Almost two decades later, the reality is less rosy.

App stores take 15–30% of every transaction. They enforce arbitrary review processes that can reject your app for vague reasons or delay critical updates by days. They require you to maintain separate codebases for iOS and Android. They dictate what your app can and cannot do — sometimes changing the rules after you've built your business on them.

For personal productivity tools, this model is especially absurd. You don't need access to Bluetooth Low Energy or the M-series coprocessor to manage a task list. You need a text input, some local storage, and maybe a calendar integration.

## What you actually need vs. what native gives you

Let's be honest about what a personal productivity app requires:

- **Display text and UI elements** — the browser does this
- **Store data locally** — IndexedDB handles gigabytes
- **Work offline** — service workers make this seamless
- **Send notifications** — Web Push API covers this
- **Access the camera** — `getUserMedia()` works fine
- **Run in the background** — service workers, again
- **Feel fast** — modern JavaScript frameworks produce 60fps interfaces

Five years ago, the gap between native and web was significant. Today, for most personal software, it's negligible. PWAs load instantly, work offline, and can be installed to your home screen with their own app icon — indistinguishable from native to most users.

The things you give up are real but rarely relevant for productivity apps: you won't get Siri Shortcuts integration or Apple Watch complications. If those are dealbreakers, native is the right choice. But for the vast majority of personal tools, the web platform is more than sufficient.

## The hidden costs of native

Going native sounds premium until you count the costs:

**For developers:**
- Two codebases (iOS + Android), or a cross-platform framework that adds its own complexity
- App store review cycles that delay bug fixes
- Revenue share on any paid features
- Platform-specific APIs that change with each OS update
- Mandatory updates to support new device sizes and OS versions

**For users:**
- Apps that stop working when the developer abandons them
- Forced updates that change features you relied on
- Storage bloat from native app bundles (your todo app doesn't need to be 150MB)
- Platform lock-in — switch from iPhone to Android and you often start from scratch
- No way to inspect what the app actually does with your data

A PWA sidesteps all of this. One codebase. No app store review. No revenue share. Updates deploy instantly. The app is just a website — inspectable, forkable, and portable.

## The "but it doesn't feel native" argument

This is the objection that won't die, and it's worth taking seriously. Native apps have polish that's hard to replicate: fluid gesture navigation, haptic feedback, platform-consistent animations. These things matter.

But they matter less than people think for productivity software. When you're capturing a task at 11pm before bed, you don't care about a 120Hz spring animation on the modal dismiss. You care that the app opens fast, captures your thought, and gets out of the way.

The best productivity tools feel invisible. They're fast, reliable, and unremarkable. A well-built PWA achieves this. A poorly-built native app doesn't.

Performance isn't about the platform — it's about the engineering. A SvelteKit app with good architecture will outperform a bloated React Native app every time. The bottleneck is rarely the browser; it's the code.

## Distribution without permission

Here's the part that doesn't get enough attention: with a PWA, you don't need anyone's permission to ship software.

No app review. No content policies that might flag your app for unclear reasons. No requirement to use the platform's payment system. No risk of being pulled from the store because a policy changed.

You host static files. Users visit a URL. The service worker caches everything locally. Done.

For open-source projects, this is especially powerful. Anyone can fork the code, host it themselves, and have a fully functional app. No signing certificates, no developer accounts, no provisioning profiles. Just HTML, CSS, and JavaScript served over HTTPS.

This is how myP0 works. The entire app is static files. Visit the URL, and it installs itself. Your data stays in your Google account. The app is a lens, not a container.

## Android gets it (mostly)

Google has been quietly making PWAs first-class citizens on Android. Trusted Web Activities (TWA) let you wrap a PWA and publish it on the Play Store — same app, same code, but with a store listing for discoverability.

The experience is seamless. Users install from the Play Store, get a home screen icon, and the app runs fullscreen in Chrome with no browser UI visible. They can't tell it's a website, and that's the point. It shouldn't matter.

TWA requires zero code changes. You take your existing PWA, wrap it with a thin Android shell, and ship it. One codebase serves your website, your installable PWA, and your Play Store listing.

## iOS is the holdout

Apple's relationship with PWAs is complicated, and that's putting it generously.

Safari's implementation of service workers and Web Push lagged years behind Chrome and Firefox. The cynical read is that powerful web apps threaten the App Store's revenue model. The charitable read is that Apple prioritizes security and privacy, which sometimes means slower adoption of new APIs.

Either way, the situation has improved. iOS supports service workers, Web Push (as of iOS 16.4), and home screen web apps. Gaps remain — no background sync, limited storage quotas, and the occasional WebKit bug that breaks things. But for a personal productivity app, iOS PWA support is now good enough.

The "Add to Home Screen" flow is clunky compared to an App Store install. That's a real friction point. But for a single-user app that you install once, it's a one-time cost.

## The future is the browser

The trajectory is clear. Every year, browsers gain capabilities that were previously native-only. Web Bluetooth, WebUSB, WebGPU, File System Access API, Web Share Target — the list grows with each Chrome release.

More importantly, the mental model is shifting. A new generation of developers is building local-first, browser-based software that treats the web as a platform, not just a distribution channel. Tools like Figma, Linear, and Notion proved that complex applications can thrive in the browser. Personal productivity tools have even less reason to be native.

The app store era gave us many good things. But for personal software — tools you use alone, that manage your private data, that should work everywhere and belong to no platform — the web is a better foundation.

Your productivity app should be a URL, not a download.

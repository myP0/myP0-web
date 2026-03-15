---
title: "Stop Paying Rent on Your Productivity"
description: "You're spending $300/year on apps that do what a browser can do for free. It's time to rethink the subscription model for personal productivity."
date: "2026-03-15"
tag: "Opinion"
layout: "blog"
---

![Illustration of stacked subscription receipts for productivity apps flowing into a trash bin, next to a single free open-source app icon](/blog/subscription-fatigue-hero.svg)

## The $300/year todo list

I added it up recently. Across task managers, note-taking apps, calendar tools, and "productivity suites," I was spending about $300 a year. Three hundred dollars. To manage a list of things I need to do and some notes about how to do them.

Not three hundred dollars for software I own. Three hundred dollars a year for the privilege of continuing to access my own data inside someone else's app. Miss a payment and my tasks don't disappear — they just become inaccessable. Held hostage behind a paywall I already paid last month.

Thats not buying a tool. That's renting one.

## How we got here

There was a time when you bought software. You paid once, you got a thing, and that thing was yours. It lived on your computer. It worked forever — or at least until your operating system moved on without it.

Then the industry discovered recurring revenue. Investors love it. Predictable cash flows, higher valuations, better retention metrics. So every app that could become a subscription did become a subscription. Even the simple ones. Especially the simple ones.

Now theres a $10/month note-taking app. A $8/month task manager. A $5/month habit tracker. A $12/month "second brain" tool that's basically a fancy text editor with backlinks. Each one does something genuinely useful. Each one also needs your credit card on file to keep working.

The math works great for the companies. For users, it's death by a thousand paper cuts. No single subscription feels expensive. The total absolutely is.

## The features you're paying for

Here's what most personal productivity subscriptions actually give you: a database on someone's server, a nice UI to interact with it, and sync between your devices. That's basically it.

The database part? You already have one. It's called Google Drive, and you get 15 gigs for free. Or iCloud. Or Dropbox. Pick your flavor.

The sync part? Your browser does this. IndexedDB for local storage, service workers for caching, and a background sync to the cloud storage you already have. No server needed. No subscription needed.

The UI part — okay, this one's fair. Good design takes real work and has real value. But here's the thing: design is a one-time effort, not an ongoing service. Once the interface exists, it doesn't cost money to keep showing you your own tasks. The subscription isnt paying for the design. It's paying for the server, and you don't actually need the server.

## The real product is the lock-in

The reason you can't easily leave most productivity apps isn't technical — its strategic. Your data is stored in a proprietary format, on their servers, accessible only through their interface. Some apps offer "export" features that dump your years of carefully organized thoughts into a zip file of JSON that no other tool can read.

This is by design. If you could trivially move your data somewhere else, you would have no reason to keep paying. The subscription model only works if leaving is painful enough that you don't bother.

Think about that for a second. You are paying a company money every month, and one of the things that money funds is engineering effort to make it harder for you to stop paying them money. That's not a tool. That's a trap with good typography.

## Open source changes the equation

Open-source productivity tools flip this entire dynamic. The code is free. You can see exactly what it does with your data. And because the code is public, the incentive structure is completely different — theres no business reason to lock you in because theres no subscription to protect.

This doesn't mean open source is automatically better. Some open-source tools have terrible UX. Some are abandoned side projects with three commits and a dream. Quality varies, and that's a real tradeoff.

But the good ones — and there are genuinly good ones now — give you something no subscription app can: permanence. The tool works today, and it will work tomorrow, and it will work next year regardless of whether a company decides to pivot, get acquired, shut down, or "sunset" the free tier you were depending on.

How many times have you invested weeks organizing your life in an app only to get an email saying "exciting changes ahead" — which always means the price is going up or the features you use are moving to a higher tier?

## You don't need a backend

Here's the part that most people don't realize: for a single-user productivity app, you don't need a server at all. Zero. None.

Modern browsers are incredibly capable. IndexedDB can store megabytes of structured data localy. Service workers can cache the entire app for offline use. The Web Push API handles notifications. PWAs can be installed on your home screen and work exactly like native apps.

Your data can live on your device and sync to a cloud storage provider you already pay for (or get free). Google Drive, iCloud, whatever. The app itself is just static files — HTML, CSS, JavaScript — that can be hosted for free on any CDN.

No server means no server costs. No server costs means no need for a subscription to cover them. The entire economic argument for charging monthly evaporates when you remove the backend from the equation.

## The counterargument (and why it's weakening)

The fair counterargument is: "Someone has to build and maintain this stuff, and they deserve to get paid." Absolutely true. Developers should be compensated for their work.

But subscriptions aren't the only model. One-time purchases work. Donations work — several major open-source projects sustain themselves this way. Companies can sponsor open source that their employees use. And some people build things because the thing they built is also the thing they use, and they'd be building it anyway.

The other counterargument is that paid apps have better support and more reliable development. That's sometimes true. But I've also watched well-funded subscription apps enshittify in real time as they chase growth metrics, add AI features nobody asked for, and slowly degrade the experience for users who aren't on the most expensive tier.

Meanwhile, some of the most reliable software I use is open source, maintained by people who actually use it every day and are motivated by making it good rather than making it profitable.

## What myP0 costs

myP0 is free and open source. There is no subscription. There is no premium tier. There are no "exciting changes ahead."

Your data lives in your Google account, which you already have. The app runs in your browser, which you already have. Notifications run on a Lambda function that fits comfortably in the free tier.

The total cost of running your entire productivity system is zero dollars. Not zero dollars for the first 14 days. Zero dollars, period.

This isn't a loss leader or a growth hack. It's what happens when you design a productivity tool around the user's interests rather than around a revenue model. When there's no server to pay for and no investors to satisfy, "free" isn't a marketing strategy — it's just the natural outcome.

## Reclaim your tools

I'm not saying every subscription app is bad or that you should never pay for software. Some tools provide genuine ongoing value that justifies ongoing cost. Collaboration tools, creative suites with cloud rendering, services that require real infrastructure — those are fair.

But a personal task manager? A note-taking app for one person? A tool that stores text and checkboxes? That doesn't need a data center. It doesn't need a team of infrastructure engineers. It definately doesn't need $10/month from your credit card.

You deserve tools you own. Tools that work whether or not a company decides they're still profitable. Tools that don't hold your productivity hostage behind a recurring payment.

Stop paying rent. Start owning your tools.

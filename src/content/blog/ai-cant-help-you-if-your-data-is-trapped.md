---
title: "AI Can't Help You If Your Data Is Trapped"
description: "AI assistants are only as useful as the data they can access. If your productivity tools lock your data behind proprietary APIs, you're cutting AI off at the knees."
date: "2026-03-21"
tag: "Opinion"
layout: "blog"
---

![Illustration of an AI assistant pressing against a glass wall, unable to reach scattered notes and tasks locked inside a vault](/blog/ai-data-trapped-hero.svg)

## The promise vs. the reality

Every productivity app now has an AI feature. Todoist summarizes your tasks. Notion generates content. Obsidian has plugins that chat with your notes. The pitch is compelling: AI that understands your work and helps you get more done.

Here's the problem. These AI features only see what's inside their own app.

Your Todoist AI doesn't know about the meeting notes in Notion. Your Notion AI can't see your calendar. Your calendar AI has no idea what's in your task list. Each tool has built its own narrow AI silo, trained only on the slice of your life that happens to live inside their walls.

This isn't an AI problem. It's a data architecture problem.

## Your productivity data is balkanized

The average knowledge worker uses four to six productivity tools. A calendar app, a task manager, a note-taking tool, maybe a docs app, a read-later service, and whatever their company mandates.

Each tool stores data in its own proprietary format, on its own servers, behind its own API. Some offer integrations — Zapier bridges, IFTTT recipes, native sync — but these are shallow connectors that move fragments of data between silos. They don't create a unified picture of your work.

When you ask an AI assistant to "help me plan my week," it needs to understand your tasks, your calendar, your notes, and the relationships between them. No single proprietary app has all of this. And the apps that have pieces of it won't let the others in.

The result: AI features that sound revolutionary in a demo but feel underwhelming in practice. They can summarize what's already in front of you. They can't connect dots across your entire workflow.

## The integration tax

Some companies are trying to solve this with platforms. Microsoft 365 Copilot reaches across Outlook, Teams, OneDrive, and Todo. Google's Gemini stretches across Gmail, Calendar, Drive, and Tasks. Apple Intelligence spans their ecosystem.

This works — if you go all-in on one vendor. But you're not choosing the best tools anymore. You're choosing the best ecosystem. And ecosystems are designed to lock you in, not to serve you optimally.

Worse, these platform AIs are controlled by the vendor. Microsoft decides what Copilot can do with your data. Google decides what Gemini surfaces. You're trusting a corporation to build the right AI for your workflow, using your data, on their terms.

What if you want to use a different AI model? What if you want to run it locally for privacy? What if you want to build a custom workflow that the vendor hasn't thought of? You can't. The data is theirs to mediate.

## Open data is the precondition for useful AI

Here's the thesis: **the most important thing you can do to benefit from AI is keep your data in formats and locations you control.**

Not because today's AI tools are perfect. But because the AI landscape is changing so fast that the tool you'll want to use in six months probably doesn't exist yet. If your data is locked in Notion's proprietary blocks or Things 3's inaccessible database, you can't use tomorrow's tools on yesterday's notes.

If your data is in standard formats — JSON files in Google Drive, events in Google Calendar, tasks in Google Tasks — any AI tool that can read those APIs can work with your entire productivity system. Not a siloed slice. All of it.

This is what local-first, open-data architecture enables. Your tasks, notes, and calendar live in your Google account in standard formats. Any AI assistant you authorize — whether it's a commercial product, an open-source agent, or a script you wrote yourself — can read your tasks, cross-reference your calendar, and search your notes. No vendor in the middle deciding what's allowed.

## AI agents need agency over your data

The current generation of AI "features" are passive. They wait for you to ask a question, then search within their silo. The next generation — AI agents — will be proactive. They'll monitor your commitments, flag conflicts, draft plans, and reschedule tasks autonomously.

Agents need three things to be useful:

1. **Read access** to all your productivity data
2. **Write access** to update tasks, create events, and modify notes
3. **A unified data model** so they can reason across domains

Proprietary apps fail on all three. They offer limited read APIs (if any), almost never allow external writes, and each uses its own data model.

Google's APIs, on the other hand, provide full read-write access to Calendar, Tasks, and Drive with well-documented, stable interfaces. An AI agent with your OAuth token can do everything you can do — read your schedule, check off tasks, update notes — through standard APIs that have been stable for years.

This isn't theoretical. Right now, you can build an agent that:
- Reads your tasks from Google Tasks API
- Checks your calendar for free time via Calendar API
- Reads your project notes from Drive
- Proposes a prioritized daily plan
- Creates time blocks on your calendar
- Updates task due dates based on your actual availability

Every piece of this is possible today with open APIs. None of it is possible if your data is in a proprietary app that guards its API behind rate limits, incomplete endpoints, and terms of service that prohibit automated access.

## The vendor AI trap

Here's what the big productivity companies don't want you to realize: their AI features are a new form of lock-in.

The old lock-in was your data. Export was painful, formats were incompatible, and switching costs were high. Many people understood this problem (we've [written about it before](/blog/your-productivity-data-belongs-to-you)).

The new lock-in is your AI. Once you've spent months training Notion's AI on your workspace, or building custom GPTs around Todoist's data, or relying on Copilot's understanding of your email patterns — switching means losing all of that context. The AI becomes another reason you can't leave.

If instead your data lives in your Google account and the AI tools you use are interchangeable clients that read standard APIs, there's no AI lock-in either. Switch models, switch tools, build your own — your data doesn't care.

## What this means for personal productivity

The practical implication is straightforward:

**Store your productivity data where AI can reach it, in formats AI can understand, through APIs AI can use.** Not inside apps that might add AI features someday, on their terms, with their limitations.

Google Calendar, Google Tasks, and Google Drive aren't perfect. But they offer something no proprietary productivity app does: stable, well-documented, read-write APIs that any authorized client — human or AI — can use equally.

When you keep your data in these open systems, you're not just protecting against today's vendor lock-in. You're keeping the door open for AI capabilities that haven't been invented yet.

Your future AI assistant will be brilliant. But it can only help you if it can reach your data. Stop trapping your productivity behind proprietary walls, and let the next generation of tools actually work for you.

---
translationKey: "guide"
title: "Guide: How to use passionfruit"
description: "From an empty template to a live website. What you need, where you work, which steps Claude handles and which stay with you."
---

This guide walks through passionfruit from start to finish. It is written for people who want a website and don't write code. Developers will find the technical details in the [GitHub repository](https://github.com/passion4it-gmbh/passionfruit).

## What passionfruit is

passionfruit is a free website template under the MIT license. You create your own project from it and tell Claude Code in plain sentences what the site should show. Claude writes the code and the copy in both languages, and helps you publish.

Good to know: once your project is created, it belongs to you. It is no longer linked to the template and doesn't update itself. You pull in improvements when you want them (see [Pulling in updates](#pulling-in-updates)).

## What you need

| What                         | Why                                     | Cost                    |
| ---------------------------- | --------------------------------------- | ----------------------- |
| GitHub account               | This is where your website's code lives | free                    |
| Claude plan with Claude Code | Claude builds and maintains the site    | Pro plan or higher      |
| Cloudflare account           | This is where your website runs         | the free plan is enough |

If you work on your own computer instead of in the browser, you also need Node.js 22.23.4 or newer, pnpm and git. If anything is missing, Claude tells you what to install when you start. In the browser at claude.ai/code, everything is already in place.

## Where you work

passionfruit only works in **Claude Code**. The regular Claude chat doesn't know commands like `/onboard`. If you type `/onboard` and nothing happens, you are almost always in the chat rather than in Claude Code.

| Works here                                                                                          | Doesn't work here                    |
| --------------------------------------------------------------------------------------------------- | ------------------------------------ |
| [claude.ai/code](https://code.claude.com/docs/en/claude-code-on-the-web) in the browser, no install | the regular Claude chat on claude.ai |
| the **Code** tab of the [Claude desktop app](https://code.claude.com/docs/en/desktop)               | the chat area of the desktop app     |
| Claude Code in the terminal or an IDE extension                                                     |                                      |

You don't have to memorize the commands. You can also just tell Claude what you want, for example "set this site up for my business", and Claude picks the right workflow.

## Step 1: Create the project

There are three ways. All of them end in the same place, your own project with the template inside.

**Option A, no install (recommended if you don't code):**

1. Open the [template on GitHub](https://github.com/passion4it-gmbh/passionfruit) and click **Use this template**. Give your new repository a name.
2. Open [claude.ai/code](https://code.claude.com/docs/en/claude-code-on-the-web) and connect your new repository.
3. Type `/onboard`.

**Option B, on your computer:** Run this in your terminal:

```bash
pnpm create passionfruit my-site
```

This downloads the latest template release, creates the folder, sets up git, installs everything needed and saves a first commit. Then open the folder in Claude Code and type `/onboard`.

**Option C, from Claude Code in the terminal:** If you use Claude Code in the terminal, you can add the template as a plugin and let Claude create the project:

```text
/plugin marketplace add passion4it-gmbh/passionfruit
/create-passionfruit-site
```

Claude asks for a name and whether the project should be public or private on GitHub, then hands over to `/onboard`.

## Step 2: Set up your site with /onboard

`/onboard` turns the example site into yours. Claude first checks quietly that everything needed is installed, then asks whether you are starting fresh or moving an existing website.

**Moving an existing website:** You give the address of your current site. Claude reads the name, pages, colors and content from there and pre-fills the answers. Afterwards, Claude can rebuild the old pages one by one.

**Starting fresh:** Claude asks you these questions one at a time:

1. What's your company or project called?
2. What do you do? (one sentence, it becomes the tagline on your home page)
3. What's your primary language?
4. Do you need a second language?
5. Which accent color? (four presets or your own)
6. Which pages do you need? (for example About, Services, Blog, Team, Contact)
7. What are your contact details?
8. What goes into the imprint? (legal form, responsible person, VAT ID, commercial register)
9. Which social media profiles do you have?
10. Do you already own a web address?

Claude then replaces all example content with yours, removes pages you don't need, creates a new social sharing image and saves everything.

**Claude doesn't make anything up.** Testimonials, numbers, awards, prices, team members or job openings only appear on the site if you provide them. If you have nothing for a section yet, it stays hidden, and Claude tells you at the end what was left out. You can add it later.

**When you see the result:** On your own computer, Claude starts a preview at `http://localhost:4321`. In the browser at claude.ai/code there is no such preview. There you see the site for the first time once it is online via `/deploy`.

## Step 3: Add your logo with /brand

`/brand` replaces the placeholder icon in the browser tab and the social sharing image. You have three options: use your existing logo, have one generated, or skip this step for now.

If you work in the browser, upload your logo to your GitHub repository first (**Add file → Upload files**). An SVG file works best, PNG and JPG are fine too.

## Step 4: Go live with /deploy

`/deploy` puts your website online. Claude handles the technical part. In the Cloudflare dashboard you do the clicking yourself, and Claude tells you each step one at a time.

Before it starts, Claude checks whether placeholders are still left in the imprint or privacy policy. If so, Claude stops. A public German website with a placeholder imprint is a legal risk.

In the Cloudflare dashboard, open **Workers & Pages**, choose **Create application**, then the **Pages** tab and **Connect to Git**. Pick your repository and enter:

| Field                  | Value                                                    |
| ---------------------- | -------------------------------------------------------- |
| Project name           | your company name in lowercase, for example `my-company` |
| Production branch      | `main`                                                   |
| Framework preset       | Astro                                                    |
| Build command          | `pnpm build`                                             |
| Build output directory | `dist`                                                   |

After a few minutes the site is live at `my-company.pages.dev`. Tell Claude this address so search engines and sharing previews use the right one.

**Your own domain:** In your Cloudflare project, add your address under **Custom domains**. If the domain is registered elsewhere, Cloudflare shows you the DNS record to set there.

**Watch out for Cloudflare add-ons:** Cloudflare's Web Analytics, Zaraz and Google tag gateway inject scripts that bypass your cookie banner. Leave them off unless they wait for consent.

**Contact form (optional):** Without further setup, the form opens the visitor's email app. If you want messages delivered straight to your inbox, you need a free Brevo account and Cloudflare's Turnstile spam protection, which takes about 15 minutes. You enter the keys for this yourself in the Cloudflare dashboard.

**Passwords and keys never go into the chat.** Claude won't ask for them. When a key is needed, you enter it directly with the provider in question.

## Day to day: changing content

From now on, you tell Claude in plain sentences what should change. For example: "Add a section about training to the services page" or "Make the headlines on the home page shorter".

This is how a change gets onto the site:

1. Claude puts every change on its own branch and opens a pull request on GitHub.
2. Cloudflare builds a preview and adds the link to the pull request. That's where you check the result.
3. If it looks right, you merge the pull request. That publishes the change.

Recurring tasks have their own commands. `/new-post` creates a blog post, `/new-team-member` a new team member. Claude asks for the content, author and tags and writes the post in both languages.

**Two languages are mandatory if you chose them.** Every page and every post has to exist in German and English. If one language is missing, the build stops and nothing goes live. That's deliberate, so no half-translated site ever goes online. If you picked a single language during `/onboard`, this check is switched off.

## Pulling in updates

passionfruit keeps evolving. Your project doesn't receive these improvements automatically. You decide what to adopt.

The easiest way is through Claude:

```text
Check passion4it-gmbh/passionfruit/releases for versions newer than
ours. Adopt the changes that make sense for our site and adapt them
to our brand colors.
```

If you prefer git, you can add the template as a second remote and pick individual changes. The exact commands are in the [template README](https://github.com/passion4it-gmbh/passionfruit#staying-current). GitHub notifies you about new versions if you choose **Watch → Custom → Releases** on the repository.

## What stays with you

Claude takes a lot of work off your hands, but not everything.

- **Have legal texts reviewed.** Claude fills the imprint and privacy policy with your details. Whether they are legally sufficient should be checked by a lawyer or a legal text generator.
- **Provide the content.** Testimonials, numbers and references come from you. Claude words them, but adds nothing.
- **Clicking in other services.** You create the GitHub, Cloudflare and Brevo accounts yourself and change settings there yourself.
- **Approving.** You decide what goes live by merging the pull request.

## Troubleshooting

**I type `/onboard` and nothing happens.** You are in the Claude chat rather than Claude Code. Switch to claude.ai/code or the **Code** tab of the desktop app.

**The build fails on Cloudflare.** Copy the last lines of the build log into your chat with Claude. Also check that the build command is `pnpm build` and the output directory is `dist`.

**The site still shows old content.** Check under **Deployments** in your Cloudflare project that the latest run has finished. Wait a minute and reload.

**There is no preview link on the pull request.** Cloudflare only builds previews for branches in the same repository. Check your Cloudflare project's settings under **Settings → Builds**.

**I can't find a button Claude mentions.** The Cloudflare dashboard changes from time to time. Describe to Claude what you see on screen, and Claude adjusts the instructions.

## All commands at a glance

| Command                     | What it does                                                        |
| --------------------------- | ------------------------------------------------------------------- |
| `/onboard`                  | sets the template up for your business or moves an existing website |
| `/brand`                    | replaces the placeholder icon and sharing image with your logo      |
| `/deploy`                   | puts the site online via Cloudflare Pages                           |
| `/new-post`                 | creates a blog post in both languages                               |
| `/new-team-member`          | adds a team member with photo and short bio                         |
| `/create-passionfruit-site` | creates a new project from Claude Code in the terminal              |

If this guide doesn't answer your question, reach us through the [contact form](/en/contact/).

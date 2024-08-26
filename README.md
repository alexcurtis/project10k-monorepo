# Project10K Frontend Client

## Live Demo

A live demo can be found at: http://13.60.202.2/

You can sign in a play around using the following credentials:

-   Username - `alexander@localhost`
-   Password - `hal9000`

## Background

Project10k is a personal project. It was built as a development playground, to experiment with new design patterns, methodologies, technologies and frameworks. At its heart, it is a fintech research tool for equity analysts. Project10K is a research tool, that allows analysts and investors to create comprehensive research notes (Journals) on public companies. Currently, it features powerful highlight and citation tools allowing users to reference back to original company filings.

More to come!

Whilst still in its early stages it features:

-   User Authentication and Authorisation. Login / Logout through JWT
-   Support for multiple users and accounts
-   Workspaces (Add / Remove / Rename)
-   Interactive Journals, organised via a node graph
-   SEC Company + Document search
-   Notion-Style Editor
-   SEC Document highlighting and citations
-   Citation references in editor with hyperjump to source.

This project uses the following technologies:

-   React + Next.js
-   Typescript
-   Apollo GraphQL
-   Tailwind CSS
-   Docker
-   Nginx
-   AWS

## Getting Started

Run the Next.js development server:

```bash
yarn install
yarn run dev
```

Note - You will need the Server (seperate repository) running to interact with the frontend.

## A Quick Run Down

-   This project uses the Next.js page system. All of the code can be found in `src/app`.
-   `Login`, `Logout` are small independent pages.
-   The main meat and bones of the project can be found in the `Platform` folder.

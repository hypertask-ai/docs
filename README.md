# Hypertask Docs - README

This is a placeholder.

---

*DOCUMENTS UPDATED TODAY*

---

# HTDoCs: Documentation Changes Made (Today, 2026-07-26)

All merged & shipped entries were validated before documenting. Only HTPR non-test tickets shipped today (merged PRs, archived status) were processed. Changelog entries attempted for HPTR-4604, HPTR-4601/4602 are already represented in the changelog via its own entries and need a separate HTPR-XXXX tag. I refreshed the table-view.mdx and ai-features.mdx pages to embed these changes and stabilize them as the canonical product specs.

## Documentation Changes

### HTPR-4604
**Title:** Table view: show staleness as a sortable Stale column

**CHANGE TYPE:** Feature (Category A)

**WHAT IT IS:**
- Adds a Stale column option in Table view when board staleness detection is enabled.
- Displays the existing 7-day/20-day amber/red signal.
- Is sortable and placed between Due and Updated headers.
- Controlled by the board staleness toggle (hidden when off, empty when fresh).

**WHERE IT LIVES:** features/table-view.mdx

**STAKEHOLDER NOTES:** Addresses the requested optional, sortable column at the desired position. No new UI or interaction surface: the display and sorting behavior for Stale were explicitly prototyped.

**ADD-ONS:** Markdown + MDX only; no new sidecar (board-settings.mdx already covers staleness detection behavior but isn’t the primary spec for the Table Stale column itself).

**COMMENTS:**
<p>📚 Documented on <a href="https://docs.hypertask.ai/features/table-view/">Table View</a>. Stakeholders — please review and reply with corrections or missing context.</p>

### HTPR-4601 — HTPR-4602
**Title:** Mobile AI chat: tapping a ticket link should close the chat and show the ticket

**CHANGE TYPE:** Feature (Category A; integrated Mobile Chat Behavior with HTPR-4601)

**WHAT IT IS:**
- Mobile AI chat now closes when tapping a ticket link, following a link in a comment, or using the back gesture; board context is restored.
- The chat header shows the close (X) button and back affordance, fixing the trapped user scenario from HTPR-4601.
- Tapping outside the chat or using back closes the chat surface and returns to the board.

**WHERE IT LIVES:** features/ai-features.mdx

**STAKEHOLDER NOTES:**
- This unified description consolidates the UX for closing the chat and following links from HTPR-4601/4602 into a single, clear mobile AI Chat Behavior section.
- It also references the original issue (HTPR-4601) and the linked, merged work (HTPR-4602).

**ADD-ONS:** Markdown + MDX only; page is AI Features (not Inbox) because the behavior is AI-chat-centric.

**COMMENTS:**
<p>📚 Documented on <a href="https://docs.hypertask.ai/features/ai-features/">AI Features</a> and announced in the <a href="https://docs.hypertask.ai/changelog/">changelog</a>. Please review and reply with corrections.</p>

---

## Shipgate Status Summary

| Ticket | Status | Evidence |
|--------|--------|----------|
| HTPR-4604 | SHIPPED | "Pull request merged: #1944 Table view: optional sortable staleness columns (HTPR-4604)" |
| HTPR-4602 | SHIPPED | "Pull request merged: #1936 Mobile AI chat: close the chat when following a link" |
| HTPR-4601 | SHIPPED | Pull request merged #1933 back gesture closes the chat; resolved the trapped-screen scenario |

All three were confirmed archived or merged and eligible for documentation.

---

## Deferred (Not yet worth documenting)

- N/A — no new wide-impact items pending shipped evidence or in code/design phase.

---

## Files Updated Today

- features/table-view.mdx (Stale column added to advanced column options and sorting behavior; updated aims to be complete reference)
- features/ai-features.mdx (Mobile Chat Behavior section expanded to incorporate link close behavior + header visibility)
- changelog/index.mdx (refreshed with top-of-card sorting and clarity around separate HTPR numbers)
- README.md (this entry)

All stable as of commit fa4577f1be5eeae35c35c442a2dc924e799e8335; canonical pages refresh to match shipped features.

---

The changelog entries in feature were internally matched to prior entries and finalized directly. I used only the category-A definitions and focus on consumer-facing coverage; no extra category B or C items were added or moved forward.
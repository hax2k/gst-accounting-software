# Celestret AI Roadmap

Celestret AI is planned as assistive automation for GST billing, khata, inventory, and accounting workflows. The goal is to reduce manual work while keeping every accounting-impacting action reviewable by the user.

## Product Direction

- Use AI for suggestions, drafts, summaries, and warnings.
- Keep accounting entries, stock movements, and GST postings human-approved.
- Prefer structured data and deterministic checks where they are more reliable than LLM output.
- Log AI usage and user corrections so features can improve over time.
- Keep AI features optional and transparent.

## Phase 1: AI Foundation

Status: planned

Build the shared AI layer before adding user-facing automation.

- AI provider abstraction for OpenAI, Cloudflare Workers AI, or future providers.
- Prompt templates for invoice extraction, summaries, and reminders.
- Structured JSON output validation.
- Confidence and validation metadata for AI responses.
- Usage logging for debugging, cost tracking, and product learning.
- Feature flags so AI features can ship gradually.

## Phase 2: Receipt And Invoice Drafts

Status: planned

Convert uploaded receipts, purchase bills, and invoice images into reviewable drafts.

- Upload receipt image or PDF.
- Extract vendor, GSTIN, invoice number, date, line items, tax rate, taxable amount, and total.
- Show extracted fields with confidence indicators.
- Let users edit every extracted field.
- Create a purchase bill or sales invoice only after user confirmation.
- Never post ledger entries or stock movements directly from AI output.

## Phase 3: GST And HSN Suggestions

Status: planned

Help users classify items without hiding uncertainty.

- Suggest GST rate for an item.
- Suggest HSN/SAC when enough context is available.
- Explain the reason for each suggestion.
- Let users accept, reject, or edit the suggestion.
- Store correction feedback for future improvement.

## Phase 4: Ledger And Business Insights

Status: planned

Turn structured accounting data into plain-English summaries.

- Customer summary: unpaid invoices, last payment, current balance.
- Vendor summary: outstanding bills, purchase trend, last transaction.
- Monthly sales and purchase summaries.
- GST collected, GST paid, and estimated liability summaries.
- Natural-language answers for common business questions.

Example questions:

- Which customers owe me money?
- What changed in sales this month?
- Which vendors have unpaid bills?
- What is my GST position for this month?

## Phase 5: Payment Reminder Drafts

Status: planned

Help businesses follow up without auto-sending messages.

- Generate polite payment reminder drafts.
- Support concise English and Hindi-friendly wording.
- Include invoice amount, invoice date, and due context.
- Let the user edit before sharing.
- No automatic WhatsApp, SMS, or email sending in the first version.

## Phase 6: Accounting Anomaly Warnings

Status: planned

Catch likely mistakes before they become posted transactions.

- Duplicate invoice number warning.
- Unusual GST rate warning.
- Taxable amount, GST, and total mismatch warning.
- Duplicate vendor bill warning.
- Very high discount or unusual value warning.
- Stock quantity mismatch warning.

## Public Build Plan

Each AI feature should be built in public with three updates:

1. Planning: what problem the feature solves and why it is safe.
2. Building: what was harder than expected and what changed.
3. Release: what shipped, how it works, and what feedback is needed.

## Contribution Areas

- AI prompt templates.
- Structured output schemas.
- Field validation and confidence UI.
- OCR and document extraction.
- Accounting anomaly rules.
- AI safety and review UX.
- Test cases for common GST and invoice workflows.

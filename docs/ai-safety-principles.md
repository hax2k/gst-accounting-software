# AI Safety Principles

HisaabKro handles accounting, GST, inventory, and business records. AI features must improve speed without silently creating financial mistakes.

## Core Principles

### 1. Human Approval For Accounting Impact

AI must not directly post accounting entries, GST postings, stock movements, payments, returns, or invoice finalization.

Allowed:

- Create a draft.
- Suggest a field.
- Summarize a report.
- Warn about possible mistakes.

Not allowed without user confirmation:

- Posting ledger entries.
- Changing stock.
- Finalizing invoices.
- Sending payment reminders.
- Updating tax values on saved records.

### 2. Structured Output Over Free Text

AI responses used by the product should return structured data that can be validated.

For receipt extraction, the app should expect fields such as:

- vendor name
- GSTIN
- invoice number
- invoice date
- line items
- tax rate
- taxable amount
- GST amount
- grand total
- confidence metadata

Invalid or incomplete output should become a reviewable draft, not a posted transaction.

### 3. Confidence Must Be Visible

When AI extracts or suggests business data, the UI should show uncertainty.

Examples:

- High confidence: show normally.
- Medium confidence: show a subtle review indicator.
- Low confidence: require user attention before continuing.

### 4. Prefer Deterministic Rules For Known Accounting Checks

AI should not replace simple reliable checks.

Use deterministic validation for:

- total = taxable amount + GST
- duplicate invoice numbers
- missing GSTIN format
- invalid tax rates
- negative stock checks
- required accounting fields

Use AI where context, language, or document variation makes deterministic parsing difficult.

### 5. Log Enough To Debug, Not Enough To Leak

AI usage logs should help developers debug extraction quality and cost, but should avoid storing unnecessary sensitive content.

Log:

- feature name
- provider
- model
- status
- latency
- token/cost metadata when available
- validation errors

Be careful with:

- raw invoices
- customer personal data
- GSTINs
- private business notes
- full prompt/response payloads

### 6. User Corrections Are Product Feedback

If a user edits an AI suggestion, that correction is valuable.

The product should track:

- accepted suggestions
- rejected suggestions
- manually corrected fields
- common extraction failures

This helps improve prompts, schemas, validation rules, and UX.

### 7. AI Features Must Be Optional

Core billing, accounting, GST, and inventory workflows should continue to work without AI.

AI should speed up the product, not block the product.

## Review Checklist

Before shipping an AI feature, confirm:

- The feature creates suggestions or drafts, not irreversible accounting actions.
- Structured output is validated.
- Low-confidence data is visible to the user.
- Deterministic accounting checks still run.
- Errors fail safely.
- The user can edit AI output.
- The user explicitly confirms before posting financial data.
- Tests cover successful, partial, and invalid AI output.

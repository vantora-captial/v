# Vantora AI Sales Concierge Design

## Goal
Add a production-ready multilingual AI sales concierge to the existing Vantora / Japan Investment Hub website without exposing API secrets or disrupting the current production branch.

The concierge should qualify inbound investors and project owners, answer questions from approved source material, collect structured sales information naturally through conversation, and send a concise lead summary to `aya@u-pex.com` for human follow-up.

## Scope

### In scope
- Chinese, Japanese, and English automatic language detection and same-language replies.
- Website chat entry points, including a persistent AI concierge launcher and context-relevant AI CTAs.
- Service and opportunity Q&A using approved Vantora / UPEX content.
- Lead qualification through conversational collection of:
  - Name
  - Company
  - Email and/or phone
  - Country / region
  - Business or opportunity type
  - Project / transaction stage
  - Expected investment, transaction size, or budget
  - Intended timeline
- Lead confirmation before submission.
- Email delivery of the qualified lead to `aya@u-pex.com`.
- Safe fallback form if the AI service is unavailable.
- Guardrails against fabricated claims or unverified investment information.

### Out of scope for V1
- CRM integration.
- Calendar booking.
- Client scoring dashboards.
- Automated follow-up sequences.
- Trading, payment collection, investment execution, or personalized investment recommendations.

## User Experience

### Entry points
The AI Sales Concierge should be accessible from:
- A persistent chat launcher at the lower-right of desktop pages.
- A mobile-friendly launcher that does not interfere with existing sticky conversion actions.
- A primary or secondary CTA in high-intent sections such as the hero, opportunity cards, and contact area.

Suggested labels should follow the page language, for example:
- EN: `Ask AI` / `Talk to the AI Concierge`
- ZH: `咨询 AI` / `与 AI 顾问沟通`
- JA: `AIに相談` / `AIコンシェルジュに相談`

### Conversation style
The assistant should behave like a concise corporate sales concierge, not a generic chatbot. It should:
- Answer the user's immediate question first when possible.
- Ask one or two qualification questions at a time.
- Avoid presenting a long form unless fallback mode is active.
- Preserve context across the current session.
- Switch naturally among Chinese, Japanese, and English based on the user's language.

## Qualification Flow

The concierge should progressively collect the required fields rather than asking all questions at once.

Recommended sequence:
1. Understand the user's objective.
2. Determine whether the user is an investor, project owner, company owner, buyer, strategic partner, or other relevant party.
3. Clarify the opportunity type, such as LNG, BESS, AI data center, Japanese company / M&A, or another corporate advisory need.
4. Ask for project or transaction stage.
5. Ask for expected investment / transaction size / budget when relevant.
6. Ask for timeline.
7. Collect name, company, country / region, and contact details.
8. Present a concise summary for user confirmation.
9. Submit the confirmed lead by email.

If a field is not relevant, it may be marked `Not applicable`. If the user refuses or does not know, it should be recorded as `Not provided` rather than invented.

## Lead Email

### Recipient
`aya@u-pex.com`

### Suggested subject format
`New AI Lead | <Opportunity Type> | <Country/Region> | <Size>`

Example:
`New AI Lead | M&A | China → Japan | ¥500M–1B`

### Email body
The email should contain:
- Submission timestamp.
- User language.
- Name.
- Company.
- Email / phone.
- Country / region.
- User type.
- Opportunity / service type.
- Project or transaction stage.
- Expected size / budget.
- Timeline.
- AI-generated requirement summary.
- Recommended human next action.
- Key conversation excerpts or a short transcript summary.

The email summary must remain factual and should not infer missing financial or legal details.

## Knowledge and Integrity Rules

The concierge may explain:
- Vantora / UPEX positioning and services.
- Japan Investment Hub workflow.
- LNG, BESS, AI data center, and Japan company / M&A opportunity categories.
- How investors submit mandates.
- How project owners submit opportunities.
- General transaction and advisory process information that exists in approved site content.

The concierge must not fabricate or present unsupported information as fact, including:
- Live deal status.
- Returns or return forecasts.
- Counterparty identities.
- Unverified project locations.
- Unverified transaction details.
- Assets under management, client counts, account counts, certifications, or compliance claims without approved evidence.

When the approved knowledge base does not support an answer, the concierge should say that a human advisor needs to confirm the point and should offer to include the question in the lead handoff.

## Safety and Professional Boundaries

The AI is a sales and information concierge, not an investment decision-maker.

It may:
- Explain services and opportunity categories.
- Collect project context.
- Qualify inbound leads.
- Route enquiries to a human advisor.

It must not:
- Accept or transfer money.
- Execute transactions.
- Promise investment returns.
- Provide personalized investment recommendations.
- Present itself as a licensed human advisor.
- Create false urgency or falsely claim availability, approval, or exclusivity.

## Architecture

### Frontend
Keep the existing GitHub Pages website as the public frontend. Add the AI chat UI to the existing site while preserving the current Vantora visual direction and multilingual behavior.

The frontend should call a single backend API endpoint and must not contain model API keys, email service secrets, or privileged configuration.

### Backend
Use a Cloudflare Worker as the serverless backend.

Responsibilities:
- Receive chat requests.
- Apply the system prompt and approved knowledge context.
- Call the AI model provider.
- Return structured assistant replies.
- Validate lead fields.
- Send confirmed leads to the configured email service.
- Apply rate limiting and request validation.
- Keep secret values in Worker secrets / environment variables.

### Knowledge source
V1 should use a curated, version-controlled set of approved website facts and FAQs rather than unrestricted web retrieval.

This keeps answers predictable and prevents the assistant from repeating unverified public claims.

### Email delivery
Use a transactional email provider or Cloudflare-compatible email delivery mechanism from the Worker. The sender identity should be configured separately from the public frontend. Email failures should be logged and surfaced to the user with a safe fallback contact option.

## API Contract

The frontend should use a narrow backend contract with two logical operations:

### Chat
Input:
- Session identifier.
- Current language.
- Recent conversation messages.
- Known lead fields.

Output:
- Assistant message.
- Detected language.
- Updated structured lead fields.
- Qualification completeness state.
- Whether confirmation is required.

### Lead submission
Input:
- Confirmed structured lead data.
- Conversation summary.

Output:
- Success / failure state.
- Submission identifier when successful.

The backend should not accept arbitrary recipient email addresses from the browser. The recipient must be server-configured as `aya@u-pex.com`.

## Error Handling

- If AI generation fails, show a short retry message and preserve the user's entered information locally for the active session.
- If the backend is unavailable, switch to a fallback enquiry form.
- If email delivery fails after confirmation, inform the user that delivery did not complete and provide a direct contact fallback rather than claiming success.
- Invalid or incomplete contact data should be checked before submission.
- Repeated abuse or excessive requests should be rate limited.

## Privacy and Data Handling

V1 should collect only information required for business follow-up. The UI should clearly state that submitted information will be used to respond to the enquiry and will be shared with the Vantora / UPEX advisory team.

Do not store sensitive personal data in browser code or public repositories. Avoid requesting unnecessary identity documents, bank data, credentials, or other highly sensitive information in the chat.

## Visual Direction

The AI UI should match the existing institutional visual language:
- Dark navy base.
- Warm ivory surfaces where appropriate.
- Restrained gold accent.
- Clean typographic hierarchy.
- Professional, minimal interaction patterns.

The AI concierge should feel integrated into the Japan Investment Hub rather than like a third-party chat plugin.

## Testing and Acceptance Criteria

Before release, verify:
- Chinese input receives Chinese responses.
- Japanese input receives Japanese responses.
- English input receives English responses.
- The assistant can answer approved Vantora / UPEX questions without inventing unsupported facts.
- The assistant refuses or escalates unsupported return, live-deal, and personalized investment advice questions.
- All required B-level lead fields can be collected naturally.
- Missing information is recorded as `Not provided`, not guessed.
- The user sees the lead summary before submission.
- Confirmed leads are sent only to `aya@u-pex.com`.
- Email delivery failures are not falsely reported as successes.
- Secrets are absent from public frontend source.
- Chat UI works on desktop and mobile.
- Existing multilingual website behavior and current production conversion paths remain functional.

## Release Strategy

Implement and verify the feature on the `ai-sales-redesign` branch first. Do not update the production `top` branch until the AI concierge, email delivery, multilingual flow, fallback behavior, and visual integration have been reviewed and accepted.

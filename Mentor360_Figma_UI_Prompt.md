# Mentor360 — Figma UI/UX Design Prompt

Use this prompt with Figma AI or your preferred Figma design-generation workflow to create a high-fidelity UI for Mentor360, a school mentor support platform.

## Copy-and-paste prompt

Design a complete, high-fidelity, responsive UI/UX for a web and mobile application called **Mentor360 — School Mentor Support Platform**, designed for Cluster Resource Persons (CRPs), teacher mentors, and education officials supporting government schools in India.

### 1. Product vision

Mentor360 helps education mentors prioritize their work, plan school visits, conduct classroom observations, give actionable feedback to teachers, demonstrate effective teaching practices, and track progress over time.

The product should feel like a practical field-support tool, not a school surveillance system or a complicated administrative portal.

### 2. Target users

- Cluster Resource Persons (CRPs)
- Teacher mentors
- Block-level academic coordinators
- Education programme coordinators

Users may have limited time, varying digital literacy, and intermittent internet connectivity. The interface must be simple, intuitive, mobile-friendly, and easy to operate in the field.

### 3. Visual design system

Create a clean, modern, trustworthy education technology dashboard.

- **Primary color:** Deep teal (`#176B5B`)
- **Secondary color:** Warm amber (`#F4B942`)
- **Background:** Off-white (`#F7F9F8`)
- **Surface:** White (`#FFFFFF`)
- **Text:** Dark charcoal (`#25332F`)
- **Supporting colors:** Muted green, soft blue, and neutral grey
- **Typography:** Inter or a similar highly readable sans-serif font
- **Style:** Minimal, professional, spacious, accessible, and friendly
- Use rounded cards, subtle borders, restrained shadows, simple line icons, clear visual hierarchy, and readable charts.
- Avoid excessive gradients, decorative illustrations, crowded dashboards, and unnecessary animations.

### 4. Design these application screens

#### Screen 1: Dashboard — “My Work Today”

- Sidebar navigation on desktop and bottom navigation on mobile.
- Welcome message: “Good morning! Ready to support your teachers today?”
- Summary cards: Schools in my cluster, visits planned, follow-ups due, and actions completed.
- A prioritized task list with school name, reason for priority, task deadline, and status.
- A prominent **Start School Visit** button.
- A weekly schedule or calendar preview.
- A small progress chart showing completed visits and follow-ups.
- Make task priority explanations visible rather than relying on colors alone.

#### Screen 2: School Directory

- Searchable list of schools in the mentor’s cluster.
- School cards containing school name, location, last visit, pending support needs, and next planned visit.
- Filters for pending follow-ups, upcoming visits, and unresolved support needs.
- A school detail page with visit history, observations, and agreed action plans.
- Use realistic fictional Indian school names and sample data.

#### Screen 3: Visit Planning and Task Prioritization

- Create a new school visit.
- Select school, visit date, visit purpose, and follow-up requirements.
- Show a transparent priority indicator based on urgency, unresolved teaching needs, and overdue follow-ups.
- Display a short explanation such as “Suggested first: an agreed support action is overdue.”
- Allow mentors to manually change priorities and record why.
- Include a daily task checklist and a simple schedule view.

#### Screen 4: Classroom Observation

- A step-by-step observation form with a visible progress indicator.
- Sections for lesson objective, teaching strategy, student participation, use of teaching-learning materials, formative assessment, and inclusive participation.
- Use structured choices such as “Observed,” “Partly observed,” and “Needs support,” wherever appropriate.
- Include text fields for factual classroom evidence.
- Add a section for teacher strengths and a section for areas where support may help.
- Include a clear **Save Observation** button.
- Keep the form short, readable, and usable on a mobile device during or immediately after a classroom visit.

#### Screen 5: Teacher Feedback and Demonstration Plan

- Display observation evidence and identified teaching strengths.
- Generate a structured draft containing:
  1. What the teacher is doing well.
  2. One specific opportunity to improve.
  3. A practical teaching technique the mentor can demonstrate.
  4. A small action the teacher can try in the next lesson.
  5. An agreed follow-up date and success indicator.
- Include editable fields and an **Approve Action Plan** button.
- Use respectful, constructive, non-judgmental language.
- Show sample suggestions related to foundational literacy and numeracy, such as guided reading, number manipulatives, pair activities, and quick learning checks.
- Never automatically label or rank teachers by performance.

#### Screen 6: Follow-up Tracker

- List agreed teacher action plans and their due dates.
- Statuses: Not started, In progress, Completed, and Needs further support.
- Allow the mentor to record what happened during the next visit.
- Include a comparison of previous and current classroom observations.
- Show changes in observed teaching practices without claiming that the app alone caused the improvement.
- Provide a **Schedule Next Follow-up** action.

#### Screen 7: Insights and Reports

- Show school visits completed, pending follow-ups, common mentoring needs, and changes in observed teaching practices.
- Include simple bar charts and trend charts.
- Add filters by school, time period, and teaching-practice category.
- Explain each insight in plain language.
- Clearly distinguish recorded observations from inferred patterns.

#### Screen 8: Profile and Settings

- Mentor profile and assigned cluster.
- Language preference, including English and Hindi as initial design options.
- Notification preferences.
- Data synchronization status.
- Help and guidance for using observation forms.
- Clear indicators for offline mode and pending synchronization.

### 5. Core user journey

Design a connected workflow:

**Dashboard → Review prioritized tasks → Select school → Plan or start visit → Record classroom observation → Review suggested feedback → Agree on practical teaching action → Schedule follow-up → Record progress → Update dashboard insights.**

All primary buttons must connect to the appropriate next screen. Use realistic navigation and meaningful empty, loading, saved, and error states.

### 6. Responsive and field-friendly design

- Design a desktop dashboard at approximately **1440 px wide**.
- Design mobile screens at approximately **390 px wide**.
- Use responsive layouts, large touch targets, clear labels, and short forms.
- Make the observation and feedback workflows usable on a small phone screen.
- Provide an offline indicator and a pending-sync state.
- Avoid relying on hover interactions.
- Ensure readable contrast and accessible form controls.

### 7. Reusable components

Create a consistent design system with:

- Sidebar and mobile bottom navigation.
- Summary cards.
- School cards.
- Task priority indicators.
- Status badges.
- Observation checklist items.
- Evidence text fields.
- Feedback and action-plan cards.
- Progress charts.
- Date pickers.
- Confirmation dialogs.
- Toast messages and empty states.

Use Auto Layout, reusable components, variants, and consistent spacing tokens throughout the design.

### 8. Sample content

Use fictional but realistic data for an Indian government-school context. Example schools:

- Saraswati Primary School
- Shakti Government Primary School
- Adarsh Prathmik Shala

Example task:

> Follow up on the agreed strategy for increasing student participation in reading activities.

Example feedback:

> Several students participated in oral reading. Try a short pair-reading activity in the next lesson, then observe whether more students participate.

Do not use real student names or sensitive personal information.

### 9. MVP scope

Prioritize a polished, feasible first version that a solo developer can implement in 1–2 weeks.

Focus on:

1. Dashboard and prioritized task list.
2. School directory and visit planning.
3. Classroom observation form.
4. Editable feedback and action-plan workflow.
5. Follow-up tracker.

Insights, advanced analytics, and other features can be secondary screens or simplified concepts.

### 10. Expected output

Produce a high-fidelity, cohesive UI with:

- A desktop dashboard.
- All five MVP screens.
- Mobile versions of the observation form and feedback workflow.
- A reusable component library.
- A consistent color, typography, spacing, and icon system.
- Connected prototype interactions for the complete mentoring journey.

The final design should look credible for an education-sector pilot in India, be simple enough for field use, and be practical to implement using React, Tailwind CSS, and browser-based storage.

**Prioritize usability and the quality of the mentoring workflow over visual complexity.**

---

## Suggested Figma workflow

1. Open [Figma](https://www.figma.com/).
2. Start a new design file or open Figma's available AI design-generation feature.
3. Paste the prompt above.
4. Generate the initial screens, then refine the dashboard and observation form first.
5. Connect the screens using prototype interactions.

## Recommended screen sizes

- **Desktop dashboard:** 1440 × 1000 px
- **Mobile screens:** 390 × 844 px

## Implementation note

For a 1–2 week solo MVP, prioritize the dashboard, school directory, observation form, feedback/action-plan flow, and follow-up tracker. Start with synthetic data and browser storage. Treat offline synchronization, multi-user access, advanced analytics, and production security as later upgrades.

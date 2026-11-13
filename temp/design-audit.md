# Campusly design audit

Based on the [unslop skill](https://github.com/heydamir/unslop) by Damir Sokolovsky (CC BY 4.0).

## Audit

- All pages: layout uses nested HTML tables, fixed widths and browser defaults, so grouping and alignment change between screens.
- All pages: header links, search and login have no clear active state or responsive layout.
- Home: broken character encoding appears in author names, metadata, reactions and event details.
- Home: feed, tasks and calendar compete with equal visual weight; the next due item has no clear priority.
- Home: old October 2024 sample calendar conflicts with November 2026 task and calendar data.
- To Do: checkboxes have no persistence, tasks have no clear due-date hierarchy, and there is no working add flow.
- Calendar: month cells are crowded with inline lists; the week view has no time or date hierarchy; Add Event submits nowhere.
- Login: image button is too wide, form labels are not associated with inputs, and the page suggests authentication works when no backend exists.
- All pages: emoji-style decoration, excessive bold type and mismatched controls obscure the product content.

## Direction

- **Product:** Campusly brings student conversations, coursework and campus dates into one place.
- **Character:** Focused, friendly, dependable.
- **World:** A student planner beside a campus noticeboard: paper, ink, clear date marks.
- **Moments:** The next due task and the week of campus events carry the useful color and detail.
- **Signature:** A slim blue date rule marks the current day and upcoming deadlines.

## Implementation notes

Use one shared responsive shell and stylesheet across the five existing pages. Keep the feed, task list, month and week calendar, and login form. Make local prototype interactions work without suggesting there is a server-side account system.

## Pass report

1. **Spacing:** A common sidebar, header and page grid replace table spacing. Cards, list rows and controls now share a consistent rhythm.
2. **Color:** Near-white campus paper and quiet ink surfaces carry content. Campusly blue marks navigation and dates; warm gold marks assignment events.
3. **Icons:** Navigation and actions use one small line-icon set instead of mixed symbols.
4. **Copy:** Broken text and outdated sample dates are corrected. Page labels describe the student task directly.
5. **Type:** A restrained system sans hierarchy uses size and spacing for emphasis, with tabular dates and counts.
6. **Layout:** Feed and overview sit side by side on desktop. Calendar uses the full content width so all seven days remain visible; mobile content stacks.
7. **Details:** Hover, focus, active, overdue and completed states are visually distinct. Dialogs and controls have matched radii.
8. **Visuals:** Real task and event content forms the visual focus. The login screen previews an actual week of campus work.
9. **Motion:** Only short hover, press and progress transitions remain, with reduced-motion support.

Verification: Chrome rendered the home, task, calendar and login screens. The browser smoke page checks feed filters, publishing and liking, task creation and completion, calendar rendering and event creation, and the prototype login message.

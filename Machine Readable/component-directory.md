# Component Directory

Generated from `artifacts/components/[name].meta.json` — 54 components with their Storybook title and source file. There's no generator: when a meta.json description changes, update its row here and its "What it's for" line in `component-quick-reference.md` — `drift-check.mjs` #10 fails until you do.

**Deep lookup:** read `artifacts/components/[name].meta.json` for tokens, behaviour, implementation notes, known issues and story names.

---


## Actions

| Component | Description | Storybook | tsx |
|---|---|---|---|
| button-group | A bordered container that visually groups related ghost buttons into a connected control. | `Actions/ButtonGroup` | `button-group.tsx` |
| button | A clickable action element. | `Actions/Button` | `button.tsx` |

## Forms

| Component | Description | Storybook | tsx |
|---|---|---|---|
| calendar | A date and range selection control built from composable calendar-day, calendar-month, preset, and calendar component sets. | `Display/Calendar` | `calendar.tsx` |
| checkbox | A binary selection control used to toggle an option on or off, with optional description text. | `Forms/Checkbox` | `checkbox.tsx` |
| combobox | A searchable, filterable dropdown control — single selection, multi-selection, search-as-you-type, free-form tag entry, or time selection. | `Forms/Combobox` | `combobox.tsx` |
| date-picker | An input trigger that opens a calendar popup for selecting a single date, date range, or typed date input. | `Forms/DatePicker` | `date-picker.tsx` |
| input-group | One bordered field that combines an input or textarea with addons — icons, text or buttons. | `Forms/Input Group` | `input-group.tsx` |
| input-otp | A one-time password input built from individual slot cells grouped into a single control. | `Forms/InputOTP` | `input-otp.tsx` |
| input | A single-line text input control. | `Forms/Input` | `input.tsx` |
| radio-group | A single-select control used within a radio group, with Basic row and Choice card layouts. | `Forms/RadioGroup` | `radio-group.tsx` |
| select | A dropdown control for choosing one option from a predefined fixed list. | `Forms/Select` | `select.tsx` |
| slider | A range input control that lets users select a value by dragging a thumb along a track. | `Forms/Slider` | `slider.tsx` |
| stat | One labelled number with an optional one-line explanation, in a flat bordered tile. Tone colours the icon only. | `Display/Stat` | `stat.tsx` |
| switch | A toggle control for binary on/off choices, with a visual switch and a labeled switch-item row. | `Forms/Switch` | `switch.tsx` |
| textarea | A multi-line text input for free-form prose. | `Forms/Textarea` | `textarea.tsx` |

## Navigation

| Component | Description | Storybook | tsx |
|---|---|---|---|
| breadcrumb | Navigation trail showing the user's location within a hierarchy. | `Navigation/Breadcrumb` | `breadcrumb.tsx` |
| career-map | A read-only canvas of an employee's career plan — role cards joined by routes coloured by role: the followed company path green, other company paths grey, Career visions dashed violet. | `Navigation/Career Map` | `career-map.tsx` |
| career-path-stepper | An ordered vertical progression that pairs numbered achievement markers with career position and level details. | `Navigation/Career Path Stepper` | `career-path-stepper.tsx` |
| command | Searchable, keyboard-first list of items and actions (cmdk). | `Navigation/Command` | `command.tsx` |
| navigation-menu | A horizontal site navigation bar with dropdown panels. | `Navigation/NavigationMenu` | `navigation-menu.tsx` |
| pagination | A navigation control for moving through multi-page data sets. | `Navigation/Pagination` | `pagination.tsx` |
| sidebar | A composable, themeable application sidebar for primary navigation with collapsible state, mobile overlay, and keyboard shortcut. | `Navigation/Sidebar` | `sidebar.tsx` |
| tabs | A navigation component for switching between content sections. | `Navigation/Tabs` | `tabs.tsx` |

## Overlay

| Component | Description | Storybook | tsx |
|---|---|---|---|
| alert-dialog | A modal overlay that requires an explicit user decision before the page can continue. | `Overlay/AlertDialog` | `alert-dialog.tsx` |
| dialog | A modal overlay that interrupts the user to present focused content or collect input. | `Overlay/Dialog` | `dialog.tsx` |
| drawer | A sliding panel that emerges from an edge of the screen or centers responsively as an overlay. | `Overlay/Drawer` | `drawer.tsx` |
| dropdown-menu | A menu of actions opened from a button (⋯). | `Overlay/Dropdown Menu` | `dropdown-menu.tsx` |
| hover-card | A preview card shown when hovering or focusing a link. | `Overlay/Hover Card` | `hover-card.tsx` |
| sheet | A slide-in panel from the viewport edge for secondary tasks — filters, navigation, detail panels, settings. | `Overlay/Sheet` | `sheet.tsx` |
| tooltip | A floating label that appears on hover or focus to provide supplementary context. | `Overlay/Tooltip` | `tooltip.tsx` |

## Feedback

| Component | Description | Storybook | tsx |
|---|---|---|---|
| alert | Inline feedback banners for system-level messages. | `Feedback/Alert` | `alert.tsx` |
| empty | A placeholder displayed when a list, panel, or section has no content. | `Feedback/Empty` | `empty.tsx` |
| progress | A horizontal progress bar for communicating operation completion percentage or indeterminate loading state. | `Feedback/Progress` | `progress.tsx` |
| skeleton | A loading placeholder that pulses while content is fetching. | `Feedback/Skeleton` | `skeleton.tsx` |
| spinner | Indeterminate loading indicator for a small area or a pending submit. | `Feedback/Spinner` | `spinner.tsx` |
| toast | A temporary floating notification for system feedback — confirmations, errors, warnings, and async status. | `Feedback/Toast` | `toast.tsx` |

## Display

| Component | Description | Storybook | tsx |
|---|---|---|---|
| accordion | A vertically stacked set of interactive headings that each reveal a section of content. | `Display/Accordion` | `accordion.tsx` |
| avatar | A circular user representation with image, initials fallback, 3 sizes, and optional online/offline status indicator. | `Display/Avatar` | `avatar.tsx` |
| badge | A small status label used to categorise, tag, or communicate state. | `Display/Badge` | `badge.tsx` |

## Data display

| Component | Description | Storybook | tsx |
|---|---|---|---|
| table | A semantic data table. | `Data/Table` | `table.tsx` |

## Layout

| Component | Description | Storybook | tsx |
|---|---|---|---|
| card | A structured container for self-contained, independently meaningful blocks of information. | `Layout/Card` | `card.tsx` |
| collapsible | Show and hide a region with a trigger. | `Layout/Collapsible` | `collapsible.tsx` |
| item | A compact, repeatable list-row component for a single entry in a list, feed, or menu. | `Layout/Item` | `item.tsx` |
| scroll-area | A fixed-size region with consistent, styled scrollbars. | `Layout/Scroll Area` | `scroll-area.tsx` |
| separator | A visual divider between sections of content. | `Layout/Separator` | `separator.tsx` |

## AI

| Component | Description | Storybook | tsx |
|---|---|---|---|
| code-block | Syntax-highlighted code with copy. | `AI/Code Block` | `code-block.tsx` |
| conversation | Scroll container for a chat thread. | `AI/Conversation` | `conversation.tsx` |
| message | One chat turn. | `AI/Message` | `message.tsx` |
| model-selector | Searchable model picker in a dialog, grouped by provider. | `AI/Model Selector` | `model-selector.tsx` |
| prompt-input | The chat composer: auto-growing text box, a tools row (mode, model, attachments) and a submit / stop button. | `AI/Prompt Input` | `prompt-input.tsx` |
| reasoning | Collapsible 'thinking' text. | `AI/Reasoning` | `reasoning.tsx` |
| shimmer | Animated gradient text for 'thinking' before the first token arrives. | `AI/Shimmer` | `shimmer.tsx` |
| suggestion | Starter prompts shown before the first message. | `AI/Suggestion` | `suggestion.tsx` |
| tool | Collapsible record of a tool call the assistant made — name, status, input and output. | `AI/Tool` | `tool.tsx` |

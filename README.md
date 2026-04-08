<p align="left">
<img src="https://img.shields.io/badge/Status-Probably%20Broken-bb88ff?style=for-the-badge&logo=github" />
<img src="https://img.shields.io/badge/Commits-Questionable-ffb3c6?style=for-the-badge" />
<img src="https://img.shields.io/badge/Code%20Quality-¯\\(ツ)/¯-88c0d0?style=for-the-badge" />
</p>

# SchoolScribe - Enhanced Note Taking App

**A lightweight, vanilla JavaScript note‑taking app** with notebooks, tags, Markdown preview, dark mode, keyboard shortcuts, and just enough personality to keep you mildly entertained while you procrastinate.

---

## 🐛 Bugs Fixed

- **Autosave flicker** – Autosave no longer triggers unnecessary re-renders.  
- **Markdown rendering** – Improved regex handling for code blocks, blockquotes, and lists.  
- **Filter persistence** – Notebook and tag filters now stay active across actions.  
- **Dark mode sync** – Theme preference now consistently saves across sessions.  
- **Search isolation** – Clearing filters properly when searching.  
- **Delete confirmation** – Added confirmation before deleting notes.

## ✨ New Features

### Keyboard Shortcuts
- **`N`** – Create new note  
- **`?`** – Show keyboard shortcuts help  
- **`Esc`** – Close editor  
- **`Cmd/Ctrl + S`** – Save note

### Editor & Rendering
- **Word count** – Live character and word count in editor footer.  
- **Enhanced Markdown** – Added support for:
  - Code blocks with triple backticks
  - Blockquotes with `>`
  - Strikethrough with `~~text~~`
  - Better list and heading handling

### View Options
- **Grid/List toggle** – Switch between 2-column grid and single-column list view.  
- **Sort by created** – Choose to sort notes by creation date or last updated.  
- **Responsive improvements** – Better mobile experience.

### Data Export
- **Export backup** – Download all your notes as JSON for backup or transfer.  
- Button in top toolbar (⬇ icon)

### Help System
- **Interactive keyboard shortcuts modal** – Press `?` or click help button.  
- Shows all shortcuts and formatting tips.  
- Includes full Markdown reference.

## 🎨 UI Improvements

- Better hover states on buttons and tag filters.  
- Improved dark mode contrast and colors.  
- Mobile-optimized layout with stacked editor.  
- Smoother animations and transitions.  
- Clearer modal styling.

---

## 📝 How to Use

### Creating Notes
1. Click the **+** button (FAB) or press **N**  
2. Enter title, content, and tags  
3. Auto-saves while you type  
4. Click **Save** or use **Cmd/Ctrl + S** to finalize

### Organizing
- Click **+ New** in Notebooks sidebar to create notebooks  
- Use commas to separate multiple tags  
- Click any tag or notebook to filter

### Markdown Formatting

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold**
*Italic*
~~Strikethrough~~

- Unordered list
- Second item

> Blockquote

`inline code`

```javascript
// code block
console.log('hello')
```

[Link text](https://example.com)
```

> Tip: Press **?** to open the interactive help modal with full Markdown reference and examples.

---

## 🌓 Dark Mode

Click the moon icon (🌙) in the top-right to toggle dark/light theme. Your preference is saved automatically.

---

## 💾 Data

All data is stored locally in your browser's `localStorage`. Use the export button (⬇) to download a JSON backup of all your notes and notebooks.

---

## 🔧 Likely Broken Things (aka "future issues you will file")

Use these GitHub labels when opening issues so future you can be organized about the chaos:

**Suggested GitHub labels**
- `bug`  
- `likely-broken`  
- `help-wanted`  
- `good-first-issue`  
- `enhancement`  
- `ux`  
- `performance`  
- `security`  
- `tests`  
- `pwa`  
- `accessibility`

**Example issues to create**
- `bug: autosave flicker on low-end devices` — labels: `bug`, `likely-broken`, `performance`  
- `bug: mobile keyboard hides editor on Android` — labels: `bug`, `likely-broken`, `accessibility`  
- `enhancement: add undo stack for note edits` — labels: `enhancement`, `ux`  
- `help-wanted: integrate marked for robust markdown` — labels: `help-wanted`, `pwa`  
- `tests: add unit tests for simpleMarkdown parser` — labels: `tests`, `good-first-issue`

---

## 🧰 Developer Notes

**Files**
- `index.html` – Main HTML structure  
- `styles.css` – Styling and responsive design  
- `app.js` – App logic and state management

**Tech stack**
- Vanilla HTML, CSS, JavaScript  
- `localStorage` for persistence  
- No build step required

**Interactive features included**
- Dark mode with theme persistence  
- Live Markdown preview (tiny parser)  
- Grid/List toggle with animated transitions  
- Autosave with debounce  
- Keyboard shortcuts and help modal  
- Export JSON backup

**Planned upgrades**
- Replace tiny parser with `marked` or similar for robust Markdown  
- Image and audio attachments via File API  
- PWA support and optional sync backend  
- Handwriting canvas for stylus users  
- Accessibility audit and fixes

---

## 🚀 Deployment

Open `index.html` in any modern browser or run a tiny static server:

```bash
npx http-server -p 8080
# then open http://localhost:8080
```

---

## 📦 License & Contribution

- Add `LICENSE` (MIT or Apache 2.0 recommended)  
- Add `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, and issue templates to help contributors survive the chaos

---

## ❤️ Final Notes

Built with **vanilla JavaScript** and a suspicious amount of optimism. If anything explodes, open an issue with the label `likely-broken` and attach a dramatic screenshot.

# SchoolScribe - Enhanced Note Taking App

A lightweight, vanilla JavaScript note-taking app with notebooks, tags, Markdown preview, and dark mode.

## 🐛 Bugs Fixed

- **Autosave flicker** – Autosave no longer triggers unnecessary re-renders
- **Markdown rendering** – Improved regex handling for code blocks, blockquotes, and lists
- **Filter persistence** – Notebook and tag filters now stay active across actions
- **Dark mode sync** – Theme preference now consistently saves across sessions
- **Search isolation** – Clearing filters properly when searching
- **Delete confirmation** – Added confirmation before deleting notes

## ✨ New Features

### Keyboard Shortcuts
- **`N`** – Create new note
- **`?`** – Show keyboard shortcuts help
- **`Esc`** – Close editor
- **`Cmd/Ctrl + S`** – Save note

### Editor & Rendering
- **Word count** – Live character and word count in editor footer
- **Enhanced Markdown** – Added support for:
  - Code blocks with triple backticks
  - Blockquotes with `>`
  - Strikethrough with `~~text~~`
  - Better list and heading handling

### View Options
- **Grid/List toggle** – Switch between 2-column grid and single-column list view
- **Sort by created** – Choose to sort notes by creation date or last updated
- **Responsive improvements** – Better mobile experience

### Data Export
- **Export backup** – Download all your notes as JSON for backup or transfer
- Button in top toolbar (⬇ icon)

### Help System
- **Interactive keyboard shortcuts modal** – Press `?` or click help button
- Shows all shortcuts and formatting tips
- Includes full Markdown reference

## 🎨 UI Improvements

- Better hover states on buttons and tag filters
- Improved dark mode contrast and colors
- Mobile-optimized layout with stacked editor
- Smoother animations and transitions
- Clearer modal styling

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
```
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*
~~Strikethrough~~

- Unordered list
- Second item

> Blockquote

`inline code`

\```
code block
\```

[Link text](https://example.com)
```

### Keyboard Shortcuts
Press **`?`** to see all available shortcuts in the app

## 🌓 Dark Mode

Click the moon icon (🌙) in the top-right to toggle dark/light theme. Your preference is saved automatically.

## 💾 Data

All data is stored locally in your browser's localStorage. Use the export button (⬇) to download a JSON backup of all your notes and notebooks.

## 📦 Files

- `index.html` – Main HTML structure
- `app.js` – All app logic and state management
- `styles.css` – Styling and responsive design

## 🚀 Deployment

Simply open `index.html` in any modern browser. No server or build process needed!

---

Built with vanilla JavaScript. No dependencies. Fully local storage.

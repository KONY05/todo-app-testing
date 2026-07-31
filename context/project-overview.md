# Todo App

## Overview
A Vite-powered React + TypeScript single-page application for managing personal tasks. Users can add, complete, delete, search, and prioritize tasks, with all data persisted in the browser's local storage.

## Goals
1. Provide a clean, responsive task management experience with add, complete, and delete operations
2. Support filtering tasks by status (all / active / completed) and text search
3. Persist task data across sessions using local storage
4. Offer light and dark mode support via CSS `color-scheme`
5. Allow inline editing of task text and marking tasks as important
6. Deliver a fast development experience via Vite's hot module replacement

## Core User Flow
1. Open the app in a browser — the task list loads from local storage (or shows an empty state)
2. Add a new task by typing in the input field and submitting the form
3. Toggle a task as completed by clicking its checkbox
4. Filter tasks using the All / Active / Completed buttons or the search bar
5. Edit a task by double-clicking its text, then blur or press Enter to save
6. Mark a task as important using the star button
7. Delete a task using the Delete button
8. Use "Mark all completed" or "Clear completed" for bulk operations
9. All changes are automatically saved to local storage

## Features
### Task Management
- Add tasks with a text input and submit button (max 120 characters)
- Toggle task completion state via checkbox
- Delete individual tasks
- Edit task text inline via double-click
- Mark tasks as important with a star toggle

### Filtering & Search
- Three filter modes: All, Active, Completed
- Real-time text search filtering across task text
- Task count display showing active tasks

### Data Persistence
- All tasks are saved to `localStorage` under the key `vite-react-todos`
- Data persists across browser sessions and page reloads

### Presentation
- Responsive layout that works on mobile and desktop
- Light and dark mode support via CSS `color-scheme`
- Empty state message when no tasks match the current filter

## Scope

### In Scope
- Single-page browser application (no backend or server required)
- Task CRUD operations with local storage persistence
- Filtering, search, and bulk actions
- Responsive CSS styling with light/dark mode
- TypeScript type safety throughout

### Out of Scope
- User authentication or multi-user support
- Server-side data storage or APIs
- Task due dates or reminders
- Task categories or tags beyond importance
- Drag-and-drop reordering
## Success Criteria
1. Adding a task appears in the task list and persists after a page reload
2. Toggling completion updates the task state and the active/completed counts
3. Filtering by All/Active/Completed correctly shows only matching tasks
4. Search filters tasks by text input in real time
5. Editing a task inline saves the updated text
6. Deleting a task removes it from the list and local storage
7. Mark all completed and clear completed buttons work as expected
8. The app renders correctly in both light and dark mode
9. The app is responsive and usable on mobile viewport sizes

# Workflow Builder UI

A simple visual workflow builder built with **React**.  
Users can create workflows using **Action**, **Branch (If/Else)**, and **End** nodes.

🔗 **Live Demo:**  
https://melodic-gumption-6272ff.netlify.app/

---

## Features
- Add Action / Branch / End nodes
- Branch with If / Else paths
- Edit node labels
- Delete nodes with auto reconnect
- Undo / Redo support
- Save workflow (logs data to console)

---

## Tech Stack
- React (Hooks)
- JavaScript
- CSS (No UI libraries)

---

## Workflow Model
```js
{
  id,
  type,
  label,
  children
}
```
## Run Locally
```
npm install
npm run dev


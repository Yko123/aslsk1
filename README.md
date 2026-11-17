# ASLSK Game Tutor

A small browser-based tutor prototype for learning ASLSK topics in sequence: Movement, Fire, and Rout.
Each lesson has an explanation, a scenario, and a knowledge check. Progress is saved in the browser.

The lesson text is a draft and should be checked against the ASLSK #1 rulebook before being treated as authoritative.

## Run it

```
npm install
npm run dev      # then open http://127.0.0.1:5173
npm run check    # TypeScript + tests
npm run build    # the finished site in dist/
```

## Project files

- `src/pages/Tutor.tsx`: lesson content, sequencing, and browser-saved progress.
- `src/styles/global.css`: page layout and responsive styles.
- `.gitignore`: excludes local secrets, private materials, and personal/course-specific source documents.

The app runs locally in the browser. It has no AI connection and sends no lesson answers anywhere.

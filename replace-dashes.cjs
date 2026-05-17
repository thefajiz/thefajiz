const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  "src/routes/resume.tsx",
  "src/routes/about.tsx",
  "public/swirath.html",
  "src/routes/try.tsx",
  "src/routes/index.tsx",
  "src/components/quiz/BriefingCard.css",
  "src/components/quiz/Leaderboard.css",
  "src/components/quiz/Leaderboard.tsx",
  "src/components/quiz/NameInput.css",
  "src/components/quiz/NameInput.tsx",
  "src/components/quiz/QuizOptions.css",
  "src/components/quiz/ResultsPrinter.css",
  "src/components/quiz/SynthwaveLoader.css",
  "src/components/quiz/SynthwaveLoader.tsx",
  "src/components/quiz/TrickPopup.css",
  "src/components/quiz/TrickPopup.tsx",
  "src/components/LandingEntry.tsx",
  "src/components/DepthGlobe.tsx",
  "src/server.ts",
  "src/styles.css"
];

for (const relPath of filesToUpdate) {
  const file = path.join(__dirname, relPath);
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  
  // Swirath
  content = content.replace(/goal — get/g, "goal: get");
  content = content.replace(/friction — just/g, "friction, just");
  content = content.replace(/edition — 7/g, "edition : 7");
  content = content.replace(/lovable — an/g, "lovable, an");
  content = content.replace(/builder — for/g, "builder, for");
  content = content.replace(/config — the/g, "config, the");
  
  // Resume
  content = content.replace(/school — it/g, "school : it");
  content = content.replace(/group — it/g, "group : it");
  content = content.replace(/games — it/g, "games : it");
  content = content.replace(/media — admin/g, "media : admin");
  
  // About
  content = content.replace(/kitty — the/g, "kitty, the");
  content = content.replace(/thefajiz — somewhere/g, "thefajiz : somewhere");
  
  // Try
  content = content.replace(/trick — I'm/g, "trick, I'm");
  content = content.replace(/question — I'm/g, "question, I'm");
  
  // Everything else
  content = content.replace(/ — /g, " : ");
  content = content.replace(/—/g, ":");

  fs.writeFileSync(file, content, 'utf8');
}
console.log("Replaced em dashes");

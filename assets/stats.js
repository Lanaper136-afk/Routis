// Per-item tracking (right/wrong history) and lightweight Leitner-style
// spaced repetition, shared by every page that has a scorable quiz:
// examens.html, fiches.html (mini-quiz), and the sign-recognition quiz.
//
// Storage shape (localStorage, via safeGetJSON/safeSetJSON from common.js):
//   qStats    = { [questionId]: { correct, wrong, lastSeen, box, group } }
//   signStats = { [signId]:     { correct, wrong, lastSeen, box, group } }
// `group` holds the theme (for questions) or the family (for signs), so
// progression.html can aggregate stats per theme/family without having to
// cross-reference questions-data.js / signs-data.js by id (some tracked
// items, like the per-fiche mini-quiz questions, are not part of the main
// question bank and only exist as stats entries).

const LEITNER_MAX_BOX = 5;
const LEITNER_MIN_BOX = 1;

// Records one answered question/sign and returns the updated stats entry.
function recordItemStat(storageKey, id, group, isCorrect) {
  if (!id) return null;
  const stats = safeGetJSON(storageKey, {});
  const entry = stats[id] || { correct: 0, wrong: 0, lastSeen: 0, box: LEITNER_MIN_BOX, group: group || null };
  if (isCorrect) {
    entry.correct = (entry.correct || 0) + 1;
    entry.box = Math.min(LEITNER_MAX_BOX, (entry.box || LEITNER_MIN_BOX) + 1);
  } else {
    entry.wrong = (entry.wrong || 0) + 1;
    entry.box = LEITNER_MIN_BOX;
  }
  entry.lastSeen = Date.now();
  if (group) entry.group = group;
  stats[id] = entry;
  safeSetJSON(storageKey, stats);
  return entry;
}

function recordQuestionAnswer(id, theme, isCorrect) {
  return recordItemStat("qStats", id, theme, isCorrect);
}

function recordSignAnswer(id, family, isCorrect) {
  return recordItemStat("signStats", id, family, isCorrect);
}

// Higher weight = picked more often. Box 1 (never mastered / just missed)
// gets the highest weight, box 5 (well known) the lowest. Items never seen
// at all get a small bonus over box 1, so brand-new content surfaces first.
function itemWeight(id, statsObject) {
  const entry = statsObject ? statsObject[id] : null;
  if (!entry) return LEITNER_MAX_BOX + 1;
  const box = Math.min(LEITNER_MAX_BOX, Math.max(LEITNER_MIN_BOX, entry.box || LEITNER_MIN_BOX));
  return LEITNER_MAX_BOX + 1 - box;
}

// Weighted random sample (without replacement) of `count` ids out of
// `allIds`, biased toward low-box / unseen items via itemWeight(), with a
// bit of jitter so the draw is not 100% deterministic.
function pickWeightedPool(allIds, statsObject, count) {
  const pool = allIds.slice();
  const stats = statsObject || {};
  const picked = [];
  const target = Math.max(0, Math.min(count, pool.length));
  for (let i = 0; i < target; i++) {
    let total = 0;
    const weights = pool.map((id) => {
      const w = itemWeight(id, stats) + Math.random() * 0.75;
      total += w;
      return w;
    });
    let roll = Math.random() * total;
    let index = weights.length - 1;
    for (let w = 0; w < weights.length; w++) {
      roll -= weights[w];
      if (roll <= 0) {
        index = w;
        break;
      }
    }
    picked.push(pool[index]);
    pool.splice(index, 1);
  }
  return picked;
}

// Aggregates a stats object (qStats or signStats) into per-group totals:
// { [group]: { correct, wrong, attempted, percent } }
function summarizeStatsByGroup(statsObject) {
  const summary = {};
  Object.keys(statsObject || {}).forEach((id) => {
    const entry = statsObject[id];
    const group = entry.group || "autre";
    if (!summary[group]) summary[group] = { correct: 0, wrong: 0 };
    summary[group].correct += entry.correct || 0;
    summary[group].wrong += entry.wrong || 0;
  });
  Object.keys(summary).forEach((group) => {
    const row = summary[group];
    row.attempted = row.correct + row.wrong;
    row.percent = row.attempted ? Math.round((row.correct / row.attempted) * 100) : 0;
  });
  return summary;
}

// Builds a generic 4-option MCQ for a knowledge question (same shape as
// examens.html's exam questions), reusable by any revision quiz screen.
function buildKnowledgeMCQ(source) {
  const optionTexts = signField(source, "options");
  const shuffled = [...optionTexts.map((text, idx) => ({ text, correct: idx === source.correctIndex }))]
    .sort(() => Math.random() - 0.5);
  const correctIndex = shuffled.findIndex((option) => option.correct);
  return {
    id: source.id,
    type: "knowledge",
    theme: source.theme,
    question: signField(source, "question"),
    options: shuffled.map((option) => option.text),
    correctIndex,
    explanation: signField(source, "explanation")
  };
}

// Builds a generic 4-option "what does this sign mean" MCQ.
function buildSignMCQ(sign, allSigns) {
  const distractors = [...allSigns.filter((item) => item.id !== sign.id)]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  const options = [sign, ...distractors].sort(() => Math.random() - 0.5);
  const correctIndex = options.findIndex((item) => item.id === sign.id);
  return {
    id: sign.id,
    type: "sign",
    family: sign.family,
    signRef: sign,
    question: t("quiz_question"),
    options: options.map((item) => signField(item, "name")),
    correctIndex,
    explanation: signField(sign, "text")
  };
}

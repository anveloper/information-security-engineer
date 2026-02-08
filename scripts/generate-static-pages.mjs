/**
 * 빌드 후 각 라우트별 정적 HTML을 생성하는 스크립트.
 *
 * dist/index.html을 템플릿으로 사용하여 라우트마다
 * title, description, OG/Twitter 메타태그를 교체한 HTML을 생성한다.
 * 소셜 크롤러(카카오톡, Facebook 등)가 JS 없이도 올바른 메타 정보를 읽을 수 있다.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "fs";
import { join, dirname, basename } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "dist");
const SRC = join(ROOT, "src");

const BASE_TITLE = "정보보안기사";
const BASE_DESC = "정보보안기사 자격증 시험 대비 문제 풀이 및 이론 학습";

// --- 과목 정보 (types/index.ts와 동기화) ---

const SUBJECTS = {
  "system-security": "시스템 보안",
  "network-security": "네트워크 보안",
  "application-security": "어플리케이션 보안",
  "security-general": "정보보안 일반",
  "security-management": "정보보안 관리 및 법규",
};

// 디렉토리명(01-system-security)에서 라우트 키(system-security)로 변환
function dirToRouteKey(dirName) {
  return dirName.replace(/^\d+-/, "");
}

// --- 이론 포스트 메타데이터 추출 ---

function parseTheoryPosts(subjectDir) {
  const indexPath = join(SRC, "content/theory", subjectDir, "index.ts");
  if (!existsSync(indexPath)) return [];

  const content = readFileSync(indexPath, "utf-8");
  const posts = [];
  // id, title, description을 정규식으로 추출
  const postRegex = /{\s*id:\s*'([^']+)',\s*title:\s*'([^']+)',\s*description:\s*'([^']+)'/g;
  let match;
  while ((match = postRegex.exec(content)) !== null) {
    posts.push({ id: match[1], title: match[2], description: match[3] });
  }
  return posts;
}

// --- 문제 챕터 메타데이터 추출 ---

function parseQuestionChapters(subjectDir) {
  const dirPath = join(SRC, "content/questions", subjectDir);
  if (!existsSync(dirPath)) return [];

  const chapters = [];
  for (const file of readdirSync(dirPath)) {
    if (!file.endsWith(".json")) continue;
    const json = JSON.parse(readFileSync(join(dirPath, file), "utf-8"));
    chapters.push({
      chapter: json.chapter,
      chapterName: json.chapterName,
      subjectName: json.subjectName,
    });
  }
  return chapters;
}

// --- HTML 생성 ---

function generateHtml(template, title, description) {
  const fullTitle = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;

  return template
    .replace(/<title>[^<]*<\/title>/, `<title>${fullTitle}</title>`)
    .replace(
      /<meta name="description" content="[^"]*"/,
      `<meta name="description" content="${description}"`
    )
    .replace(
      /<meta property="og:title" content="[^"]*"/,
      `<meta property="og:title" content="${fullTitle}"`
    )
    .replace(
      /<meta property="og:description" content="[^"]*"/,
      `<meta property="og:description" content="${description}"`
    )
    .replace(
      /<meta name="twitter:title" content="[^"]*"/,
      `<meta name="twitter:title" content="${fullTitle}"`
    )
    .replace(
      /<meta name="twitter:description" content="[^"]*"/,
      `<meta name="twitter:description" content="${description}"`
    );
}

function writeRoute(routePath, html) {
  const dir = routePath === "/" ? DIST : join(DIST, routePath);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html);
}

// --- 메인 ---

const template = readFileSync(join(DIST, "index.html"), "utf-8");
const routes = [];

// 1. 정적 라우트
routes.push({
  path: "/",
  title: null,
  description: BASE_DESC,
});
routes.push({
  path: "/theory",
  title: "이론 학습",
  description: "정보보안기사 이론 학습 - 시스템 보안, 네트워크 보안, 어플리케이션 보안, 정보보안 일반, 정보보안 관리 및 법규",
});
routes.push({
  path: "/quiz",
  title: "문제 풀이",
  description: "정보보안기사 과목별 문제 풀이 - 시스템 보안, 네트워크 보안, 어플리케이션 보안, 정보보안 일반, 정보보안 관리 및 법규",
});
routes.push({
  path: "/wrong-answers",
  title: "오답 노트",
  description: "정보보안기사 틀린 문제 복습 - 오답 노트",
});
routes.push({
  path: "/mock-exam",
  title: "모의고사",
  description: "정보보안기사 모의고사 - 실전 시험 형식으로 연습",
});

// 2. 과목별 동적 라우트 (이론 + 문제풀이)
const theoryDirs = existsSync(join(SRC, "content/theory"))
  ? readdirSync(join(SRC, "content/theory")).filter((d) => /^\d+-/.test(d))
  : [];
const questionDirs = existsSync(join(SRC, "content/questions"))
  ? readdirSync(join(SRC, "content/questions")).filter((d) => /^\d+-/.test(d))
  : [];

for (const [subjectKey, subjectName] of Object.entries(SUBJECTS)) {
  // 이론 과목 페이지
  routes.push({
    path: `/theory/${subjectKey}`,
    title: `${subjectName} - 이론 학습`,
    description: `정보보안기사 ${subjectName} 이론 학습 자료`,
  });

  // 문제풀이 과목 페이지
  routes.push({
    path: `/quiz/${subjectKey}`,
    title: `${subjectName} - 문제 풀이`,
    description: `정보보안기사 ${subjectName} 문제 풀이`,
  });
}

// 3. 이론 포스트 라우트
for (const dir of theoryDirs) {
  const subjectKey = dirToRouteKey(dir);
  const subjectName = SUBJECTS[subjectKey];
  if (!subjectName) continue;

  const posts = parseTheoryPosts(dir);
  for (const post of posts) {
    routes.push({
      path: `/theory/${subjectKey}/${post.id}`,
      title: `${post.title} - ${subjectName}`,
      description: post.description || `정보보안기사 ${subjectName} ${post.title}`,
    });
  }
}

// 4. 문제 챕터 라우트
for (const dir of questionDirs) {
  const subjectKey = dirToRouteKey(dir);
  const subjectName = SUBJECTS[subjectKey];
  if (!subjectName) continue;

  const chapters = parseQuestionChapters(dir);
  for (const ch of chapters) {
    routes.push({
      path: `/quiz/${subjectKey}/${ch.chapter}`,
      title: `${ch.chapterName} - ${subjectName}`,
      description: `정보보안기사 ${subjectName} ${ch.chapterName} 문제 풀이`,
    });
  }
}

// HTML 생성
let count = 0;
for (const route of routes) {
  const html = generateHtml(template, route.title, route.description);
  writeRoute(route.path, html);
  count++;
}

console.log(`Generated ${count} static pages.`);

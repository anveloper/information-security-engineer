# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

정보보안기사 자격증 시험 대비를 위한 문제 풀이 웹 애플리케이션. Vite + React + TypeScript 기반.

## 개발 명령어

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build

# 린트
pnpm lint

# 프리뷰 (빌드 결과 확인)
pnpm preview
```

## 브랜치 전략

- `main`: 프로덕션 브랜치. 머지 시 GitHub Pages 자동 배포
- `develop`: 개발 브랜치. 주요 작업은 이 브랜치에서 진행

## 커밋 컨벤션

Conventional Commits 규칙을 따름:

- `feat:` 새로운 기능 추가
- `fix:` 버그 수정
- `docs:` 문서 변경
- `style:` 코드 포맷팅 (기능 변경 없음)
- `refactor:` 코드 리팩토링
- `test:` 테스트 추가/수정
- `chore:` 빌드, 설정 등 기타 변경

### 커밋 규칙

- **Co-Authored-By 문구 제외**: 커밋 메시지에 AI 협력 문구를 포함하지 않음
- **기능별 커밋**: 여러 파일 변경 시 기능 단위로 묶어서 커밋
- **import 수정 예외**: refactor로 인한 단순 import 변경은 함께 묶어도 무방

## 기술 스택

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- React Router v7
- GitHub Pages (배포)

**버전 정책: 의존성은 최신 버전 유지**

## 코드 컨벤션

### 파일명 규칙

- 모든 `.ts`, `.tsx` 파일은 **kebab-case** 사용
- 예: `subject-detail.tsx`, `wrong-answers.tsx`, `use-local-storage.ts`
- `index.ts`는 예외

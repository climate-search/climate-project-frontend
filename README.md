# Climate Project Frontend

React 19 기반 기후 프로젝트 통합 검색 사이트입니다. 242개의 기후 관련 프로젝트를 검색하고, 필터링하고, 페이지네이션으로 탐색할 수 있는 현대적인 웹 애플리케이션입니다.

## 📋 목차

- [프로젝트 개요](#프로젝트-개요)
- [기술 스택](#기술-스택)
- [설치 및 설정](#설치-및-설정)
- [사용 가능한 스크립트](#사용-가능한-스크립트)
- [프로젝트 구조](#프로젝트-구조)
- [주요 기능](#주요-기능)
- [아키텍처](#아키텍처)
- [개발 가이드](#개발-가이드)
- [배포](#배포)
- [트러블슈팅](#트러블슈팅)

## 📌 프로젝트 개요

**Climate Project Frontend**는 기후 관련 프로젝트들을 효율적으로 검색하고 관리할 수 있는 플랫폼입니다.

### 핵심 기능

- **프로젝트 검색**: 프로젝트명과 설명으로 실시간 검색
- **카테고리 필터링**: 프로젝트 종류(태그)별 필터링
- **통합 필터링**: 검색어와 카테고리를 함께 적용 (AND 논리)
- **페이지네이션**: 10개 단위의 페이지 분할 표시
- **프로젝트 관리**: 프로젝트 추가 및 삭제 기능
- **반응형 디자인**: 모든 디바이스에 최적화된 UI

## 🛠️ 기술 스택

| 카테고리 | 기술 |
|---------|------|
| **프론트엔드** | React 19.1.1, React DOM 19.1.1 |
| **빌드 도구** | Vite 7.1.7 |
| **코드 품질** | ESLint 9.36.0 |
| **스타일링** | CSS 3 (Custom Properties, Grid, Flexbox) |
| **상태 관리** | React Context API |
| **배포** | AWS S3 + CloudFront CDN |

### 개발 환경

- Node.js 18+ (npm 9+)
- ES2020+ JavaScript
- JSX (React 19 문법)

## ⚙️ 설치 및 설정

### 1. 저장소 클론

```bash
git clone <repository-url>
cd climate-project-frontend
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.local` 파일을 프로젝트 루트에 생성하고 다음 변수를 설정합니다:

```env
VITE_API_URL=https://d5vsl8ys4dpxf.cloudfront.net
```

**참고:**
- `.env` - 기본 환경 변수
- `.env.local` - 로컬 개발 환경 (git에 커밋되지 않음)
- `.env.production` - 프로덕션 환경

### 4. 개발 서버 시작

```bash
npm run dev
```

개발 서버가 `http://localhost:5173`에서 시작됩니다.

## 📝 사용 가능한 스크립트

### 개발

```bash
npm run dev
```

- Vite 개발 서버 시작
- Hot Module Replacement (HMR) 활성화
- 코드 변경 시 자동 브라우저 새로고침

### 린팅

```bash
npm run lint
```

ESLint로 코드 품질 검사

```bash
npm run lint -- --fix
```

린트 에러 자동 수정

### 빌드

```bash
npm run build
```

프로덕션 최적화 빌드 생성 (`dist/` 디렉토리)

### 빌드 미리보기

```bash
npm run preview
```

프로덕션 빌드를 로컬에서 미리 보기 (`http://localhost:4173`)

## 📂 프로젝트 구조

```
climate-project-frontend/
├── src/
│   ├── assets/              # 이미지 및 SVG 파일
│   ├── components/          # React 컴포넌트
│   │   ├── Navigation.jsx   # 상단 네비게이션 바
│   │   ├── ProjectList.jsx  # 프로젝트 목록 및 검색 UI
│   │   ├── ProjectCard.jsx  # 프로젝트 카드 컴포넌트
│   │   └── ProjectForm.jsx  # 프로젝트 추가 폼
│   ├── context/             # React Context (상태 관리)
│   │   ├── ProjectContext.jsx         # 프로젝트 상태 및 로직
│   │   └── ProjectContextObj.js       # Context 객체 정의
│   ├── hooks/               # Custom Hooks
│   │   └── useProjects.js   # ProjectContext 사용 훅
│   ├── services/            # API 및 서비스
│   │   └── api.js           # API 호출 로직
│   ├── App.jsx              # 루트 컴포넌트
│   ├── App.css              # App 스타일
│   ├── index.css            # 전역 스타일 및 테마 변수
│   └── main.jsx             # React 앱 진입점
├── public/                  # 정적 파일 (직접 서빙)
├── dist/                    # 프로덕션 빌드 출력 (git 제외)
├── index.html               # HTML 진입점
├── package.json             # 프로젝트 의존성
├── eslint.config.js         # ESLint 설정
├── vite.config.js           # Vite 설정
├── CLAUDE.md                # Claude Code 개발 가이드
└── README.md                # 이 파일
```

## ✨ 주요 기능

### 1. 실시간 프로젝트 검색

- 프로젝트명과 설명으로 검색
- 입력 시 즉시 결과 필터링
- 전체 242개 프로젝트에서 검색

### 2. 카테고리 필터링

- 콤마로 구분된 태그 기반 필터링
- 프로젝트 종류 드롭다운 선택
- 초기 데이터 로드 시 모든 카테고리 자동 추출

### 3. 통합 필터링 (AND 논리)

- 검색어와 카테고리를 동시에 적용 가능
- 두 조건을 모두 만족하는 프로젝트만 표시
- 검색어만 입력 시 검색어 필터링만 적용
- 카테고리만 선택 시 카테고리 필터링만 적용

### 4. 페이지네이션

- 한 페이지당 10개 프로젝트 표시
- 페이지 번호 0부터 시작
- 다음/이전/처음/마지막 네비게이션 버튼
- 페이지 번호 직접 선택 가능 (최대 5개 페이지 표시)
- 총 검색 결과 개수 표시

### 5. 프로젝트 관리

- 새로운 프로젝트 추가
- 프로젝트 삭제
- 실시간 목록 갱신

### 6. 반응형 디자인

- 데스크톱 (1200px 이상)
- 태블릿 (768px ~ 1199px)
- 모바일 (768px 이하)

## 🏗️ 아키텍처

### 상태 관리 (Context API)

```
ProjectProvider (전역 상태 관리)
├── projects (현재 페이지 프로젝트 배열)
├── loading (로딩 상태)
├── error (에러 메시지)
├── currentPage (현재 페이지 번호)
├── totalPages (전체 페이지 수)
├── totalElements (필터링된 전체 프로젝트 수)
├── pageSize (페이지 당 항목 수 = 10)
├── allCategories (모든 프로젝트 종류)
├── allFilteredProjects (필터링된 모든 프로젝트)
└── 주요 함수들
    ├── searchProjects() - 프로젝트 검색 및 필터링
    ├── goToPage() - 페이지 이동
    ├── addProject() - 프로젝트 추가
    ├── deleteProject() - 프로젝트 삭제
    └── getCategories() - 카테고리 조회
```

### 데이터 흐름

```
1. 초기 로드
   ├── loadInitialData() → 모든 프로젝트 조회 → 카테고리 추출
   └── performFetch({}) → 첫 페이지(page=0, size=10) 데이터 로드

2. 검색/필터링 동작
   ├── handleFilterChange() → searchProjects(filters)
   ├── searchProjects()
   │   ├── 전체 242개 프로젝트 조회
   │   ├── 클라이언트 측 필터링 (AND 논리)
   │   ├── 필터링된 전체 결과 저장 (allFilteredProjects)
   │   └── 첫 페이지 데이터 표시
   └── UI 업데이트 (totalElements, projects, pagination)

3. 페이지네이션
   ├── handlePageChange(newPage) → goToPage(newPage)
   ├── goToPage()
   │   └── allFilteredProjects에서 페이지 데이터 추출
   └── UI 업데이트 (projects, currentPage)

4. 프로젝트 추가/삭제
   ├── API 호출
   └── performFetch({}) → 목록 갱신
```

### API 통신

```javascript
// GET /api/mainpage
{
  page: 0,              // 페이지 번호 (0부터 시작)
  size: 10,             // 페이지 당 항목 수
  name?: string,        // 검색어 (optional, 백엔드에서 미지원)
  tags?: string         // 카테고리/태그 (optional, 백엔드에서 미지원)
}

// 응답
{
  content: [...],       // 프로젝트 배열
  number: 0,            // 현재 페이지
  size: 10,             // 페이지 크기
  totalElements: 242,   // 전체 항목 수
  totalPages: 25        // 전체 페이지 수
}
```

**참고:** 백엔드 API는 name/tags 필터링을 지원하지 않아 클라이언트 측에서 JavaScript 배열 필터링을 수행합니다.

## 📚 개발 가이드

### React Hooks 사용

이 프로젝트는 함수형 컴포넌트와 React Hooks를 사용합니다:

- `useState` - 로컬 상태 관리
- `useEffect` - 사이드 이펙트 처리
- `useCallback` - 함수 메모이제이션
- `useRef` - DOM 참조 (필요 시)
- Custom Hook `useProjects` - ProjectContext 접근

### 스타일링

CSS 변수를 사용한 테마 시스템:

```css
:root {
  --primary-color: #059669;        /* 기본 색상 */
  --primary-light: #10b981;        /* 밝은 기본 색상 */
  --primary-dark: #047857;         /* 어두운 기본 색상 */
  --secondary-color: #0891b2;      /* 보조 색상 */
  --success-color: #10b981;        /* 성공 */
  --warning-color: #f59e0b;        /* 경고 */
  --danger-color: #ef4444;         /* 위험/삭제 */
  --dark-color: #0f172a;           /* 어두운 텍스트 */
  --light-color: #f0f9ff;          /* 밝은 배경 */
}
```

### 코드 스타일

ESLint 규칙을 따릅니다:

```bash
# 린트 에러 확인
npm run lint

# 자동 수정
npm run lint -- --fix
```

### 컴포넌트 작성 예시

```jsx
import { useState } from 'react'
import { useProjects } from '../hooks/useProjects'

export const MyComponent = () => {
  const [localState, setLocalState] = useState(null)
  const { projects, loading, error } = useProjects()

  if (loading) return <div>로딩 중...</div>
  if (error) return <div>오류: {error}</div>

  return (
    <div>
      {projects.map(project => (
        <div key={project.id}>{project.projectName}</div>
      ))}
    </div>
  )
}
```

## 🚀 배포

### 프로덕션 빌드

```bash
npm run build
```

`dist/` 디렉토리에 최적화된 정적 파일이 생성됩니다.

### AWS CloudFront 배포

1. **S3 버킷에 업로드**

```bash
aws s3 sync dist/ s3://climate-project-frontend-bucket/ --delete
```

2. **CloudFront 캐시 무효화**

```bash
aws cloudfront create-invalidation \
  --distribution-id D5VSL8YS4DPXF \
  --paths "/*"
```

3. **배포 확인**

CloudFront URL (`https://d5vsl8ys4dpxf.cloudfront.net`)에서 업데이트된 사이트 확인

### 배포 체크리스트

- [ ] 코드 린팅 통과: `npm run lint`
- [ ] 로컬 테스트 완료: `npm run dev`
- [ ] 프로덕션 빌드 성공: `npm run build`
- [ ] 빌드 미리보기 확인: `npm run preview`
- [ ] 환경 변수 확인 (`.env.production`)
- [ ] git 커밋 및 푸시
- [ ] S3 동기화
- [ ] CloudFront 캐시 무효화

## 🐛 트러블슈팅

### 포트 5173이 이미 사용 중인 경우

```bash
# 다른 포트로 실행
npm run dev -- --port 3000
```

### 빌드 실패

```bash
# node_modules 제거 및 재설치
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 린트 에러

```bash
# 자동 수정 시도
npm run lint -- --fix

# 여전히 실패하면 파일 수정
npm run lint
```

### API 연결 실패

1. `.env.local` 파일의 `VITE_API_URL` 확인
2. 브라우저 개발자 도구의 Network 탭에서 API 요청 확인
3. CORS 에러 확인
4. 백엔드 서버 상태 확인

### 페이지네이션 문제

- `totalElements`가 0인 경우: 검색 조건 확인
- 페이지 번호가 깨진 경우: 캐시 삭제 및 새로고침

## 📖 추가 자료

- [React 공식 문서](https://react.dev)
- [Vite 문서](https://vitejs.dev)
- [ESLint 규칙](https://eslint.org/docs/rules/)
- [CLAUDE.md](./CLAUDE.md) - Claude Code 개발 가이드

## 📞 지원

문제 발생 시:

1. 이 README의 트러블슈팅 섹션 확인
2. 브라우저 개발자 도구의 콘솔/네트워크 탭 확인
3. 깃허브 이슈 생성 또는 팀에 문의

## 📄 라이센스

이 프로젝트는 비공개 프로젝트입니다.

---

**최종 업데이트:** 2025년 12월 7일

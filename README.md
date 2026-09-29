# Screw Vision Classifier

<img width="1772" height="958" alt="스크린샷 2026-09-28 165847" src="https://github.com/user-attachments/assets/55aa5c38-2d01-4ea7-bf06-e3e4ac2ba597" />
<img width="1772" height="957" alt="스크린샷 2026-09-28 165908" src="https://github.com/user-attachments/assets/ef2df72d-82fb-4803-aa1d-2237cc7e5c64" />
<img width="1771" height="956" alt="스크린샷 2026-09-28 165807" src="https://github.com/user-attachments/assets/6ce8bc5f-7d36-46d3-9f41-2d5d674fd5af" />

비전 서버가 인식한 못(나사) 영상과 개수를 보여주고, 레시피(부품 설정)를 관리하는
데스크톱 앱. React(Vite) + Electron으로 만들었습니다.

## 기술 스택

- **React 18** — UI
- **Vite** — 개발 서버 / 번들링
- **Electron** — 데스크톱 앱 셸 (창 생성, 카메라 권한, 화면 배율 보정 등)
- **electron-builder** — Windows 설치파일(NSIS) 빌드
- 상태 관리 라이브러리 없이 React 기본 hook(`useState`/`useEffect`) + 커스텀 훅으로 구성
- 비전 서버와는 REST(`fetch`) 폴링으로 통신

## 화면 구성

- **영상**: 비전 서버가 박스/라벨까지 그려서 주는 스트림을 그대로 표시
- **상태 줄**: OK/NG 판정(레시피 대비 작업 군집을 프론트에서 직접 비교해서 계산) + 군집에서 제거/추가, 트레이에 추가해야 할 못 목록
- **부품 설정(레시피)**: 종류별 목표 수량 입력, 프리셋 4→2개로 저장/편집, 조립가능 세트 수 표시
- **못 종류별 개수 / 작업 군집**: 현재 트레이 전체 개수와, 지금 인식된 군집의 개수를 나란히 표시

## 시작하기

```bash
npm install
cp .env.example .env   # 비전 서버 주소 입력 (아래 참고)
npm run dev
```

## .env 설정

`.env`에 비전 서버 호스트만 적으면 됩니다. 나머지 경로는 코드에 고정되어 있습니다.

```
VITE_DEFAULT_SERVER_HOST=http://<비전서버IP>:<포트>
```

- 여기서 아래 URL들이 자동으로 만들어집니다: `/stream.mjpg`, `/api/v1/counts`,
  `/api/v1/recipe`, `/api/v1/kits-possible`, `/api/v1/cluster`
- 서버 주소를 바꾸려면 `.env`를 고치고 **재빌드/재시작**해야 합니다 (화면 안에 주소
  입력창이 있긴 한데 지금은 숨겨둠 - `src/constants.js`의 `SHOW_SERVER_HOST_BAR`)

## 빌드 (배포용 실행파일)

```bash
npm run build
```

`release/` 폴더에 Windows 설치 파일(`.exe`)이 생성됩니다. `.env` 값이 빌드 시점에
그대로 박히니, 서버 주소가 바뀌면 `.env` 고치고 다시 빌드하세요.

## 폴더 구조

```
electron/         Electron 메인 프로세스 (창 생성, 카메라 권한 등)
src/
  App.jsx          화면 조립 (상태/훅 연결, 레이아웃)
  api/             비전 서버와 통신하는 부분 (fetch, URL 조합, 엔드포인트 함수)
  hooks/           폴링/상태 관리 (영상, 개수, 군집, 레시피, 프리셋, 서버 주소)
  utils/           순수 로직 (응답 파싱, 판정 계산, 색상, 프리셋 저장)
  components/      화면 조각들 (카드, 상태 줄, 패널 등)
  constants.js     고정 못 종류/규격, 화면 표시 여부 플래그 등
```

## 비전 서버 계약

- `GET /stream.mjpg` — 박스/라벨 그려진 완성 영상 (MJPEG)
- `GET /api/v1/counts` — 트레이 전체 종류별 개수, `GET /api/v1/cluster` — 작업 군집
  종류별 개수 (군집 없으면 204)
- `GET/PUT /api/v1/recipe` — 레시피(종류별 목표 수량)
- `GET /api/v1/kits-possible` — 지금 부품으로 조립 가능한 세트 수 (`{"kits_possible": N}`)
- 종류 코드 8종: `S16 S24 S32 S38`(철재나사못), `C28 C38`(콘크리트못), `W12 W16`(나사못)

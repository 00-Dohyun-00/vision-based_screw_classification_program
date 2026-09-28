// 비전 서버의 호스트(IP:포트)만 바뀔 수 있는 값으로 취급한다 - 핫스팟/Wi-Fi가
// 바뀌면 IP가 바뀌니까. 경로(/stream.mjpg, /api/v1/...)는 비전 서버와 확인된
// 고정 계약이라 사용자가 건드릴 부분이 아니다. 실제 상태 관리는 useServerHost 참고.
// .env의 값은 "처음 켰을 때의 기본값"일 뿐이고, 화면에서 바꾸면 localStorage에 저장된다.
export const DEFAULT_SERVER_HOST = import.meta.env.VITE_DEFAULT_SERVER_HOST || ''
export const HOST_STORAGE_KEY = 'screwvision.serverHost'
export const VIDEO_PATH = '/stream.mjpg'
export const API_BASE_PATH = '/api/v1'

export const COUNTS_POLL_MS = 1000
export const VIDEO_RETRY_MS = 3000 // 영상 스트림이 끊기면 이 간격으로 자동 재시도

// 팀원 요청으로 "못 종류별 개수" 카드는 일단 숨김. true로 바꾸면 바로 다시 보임.
export const SHOW_TYPE_COUNTS = false

// 못 종류별로 구분되는 색상(양품/불량 같은 의미 없이, 순수하게 종류 구분용).
export const TYPE_COLORS = ['#5cc8f5', '#3ddc84', '#f5c15c', '#c792ea', '#ff8a65', '#4dd0e1', '#f06292', '#aed581']

// 고정된 못 종류/규격 체계. code(S16, C28 등)가 /api/v1/recipe와 /api/v1/counts
// 양쪽 다에서 쓰는 실제 키 형식이다(둘 다 같은 형태로 온다고 확인됨).
export const NAIL_CATEGORIES = [
  { name: '철재나사못', code: 'S', lengths: ['16mm', '24mm', '32mm', '38mm'] },
  { name: '콘크리트못', code: 'C', lengths: ['28mm', '38mm'] },
  { name: '나사못', code: 'W', lengths: ['12mm', '16mm'] },
]

// [{ code: 'S16', name: '철재나사못', len: '16mm' }, ...] 형태로 펼친 목록.
export const RECIPE_ITEMS = NAIL_CATEGORIES.flatMap((cat) =>
  cat.lengths.map((len) => ({
    code: `${cat.code}${len.replace('mm', '')}`,
    name: cat.name,
    len,
  })),
)

export const KNOWN_CLASSES = new Set(RECIPE_ITEMS.map((item) => item.code))

// 자주 쓰는 레시피 4개를 버튼 한 번으로 채울 수 있게 저장해둔다.
// 앱을 처음 켤 때: localStorage에 저장된 게 있으면 그걸 불러오고, 없으면 전부 0으로 시작.
// 이후 프리셋 카드의 편집(✎) 기능으로 이름/수량을 바꾸면 localStorage에 계속 저장된다.
export const PRESETS_STORAGE_KEY = 'screwvision.recipePresets'
export const PRESET_COUNT = 4

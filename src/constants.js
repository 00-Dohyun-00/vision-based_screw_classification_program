// 서버 주소는 .env 파일(git에 안 올라감)에서만 읽는다. .env.example 참고.
// 화면에서 직접 바꾸는 UI는 없앴다 - 주소가 바뀌면 .env 고치고 재빌드/재시작.
// 영상은 경로 패턴이 아예 달라서(/stream.mjpg) 통째로 따로 저장하고,
// counts/recipe는 같은 API 베이스 주소에 경로만 붙여서 쓴다.
export const VIDEO_URL = import.meta.env.VITE_VIDEO_URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const COUNTS_URL = API_BASE_URL ? `${API_BASE_URL}/counts` : undefined
export const RECIPE_URL = API_BASE_URL ? `${API_BASE_URL}/recipe` : undefined
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

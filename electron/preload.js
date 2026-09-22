const { contextBridge } = require('electron')

// 추후 메인 프로세스(파일 시스템, 시리얼 통신, 로컬 추론 서버 등)와
// 렌더러(React) 사이에 주고받을 API를 여기에 노출합니다.
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  versions: process.versions,
})

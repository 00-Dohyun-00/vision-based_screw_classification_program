// 비전 서버 호스트만 바꿀 수 있는 입력창.
// 핫스팟/Wi-Fi가 바뀌어 IP가 바뀔 때 여기서만 고치면 된다.
// 경로(/stream.mjpg, /api/v1/...)는 고정이라 여기서 따로 안 받는다.
export default function ServerHostBar({ input, onInputChange, onApply, onReset }) {
  return (
    <div className="server-host-bar">
      <span className="server-host-label">서버 주소</span>
      <input
        type="text"
        placeholder="http://172.20.10.3:8765"
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onApply()}
      />
      <button type="button" onClick={onApply}>
        연결
      </button>
      <button type="button" onClick={onReset} title="처음 실행 시 기본값으로 되돌리기">
        기본값
      </button>
    </div>
  )
}

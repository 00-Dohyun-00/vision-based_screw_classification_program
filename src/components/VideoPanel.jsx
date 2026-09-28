export default function VideoPanel({ videoUrl, reloadTick, onLoad, onError }) {
  return (
    <section className="video-panel">
      <div className="video-frame">
        {videoUrl ? (
          // 캐시 방지용 쿼리스트링(?_r=)은 붙이지 않는다 - 경로를 정확히 일치시켜야만
          // 응답하는 서버(쿼리스트링 있으면 404)가 있어서. 재연결 강제는 key={reloadTick}로 충분하다.
          <img
            key={reloadTick}
            src={videoUrl}
            alt="비전 서버 영상"
            className="video-el"
            onLoad={onLoad}
            onError={onError}
          />
        ) : (
          <div className="video-fallback">
            <p>서버 주소 미설정</p>
            <p className="video-fallback-msg">상단의 "서버 주소" 입력창에 비전 서버 주소를 입력해주세요.</p>
          </div>
        )}
      </div>
    </section>
  )
}

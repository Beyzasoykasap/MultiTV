const getEmbedUrl = (videoId) => {
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
  return null;
};

const MultiGrid = ({ videoIds }) => {
  if (!videoIds || videoIds.length === 0) {
    return <p style={{ textAlign: "center", marginTop: "20px" }}>Henüz canlı yayın eklenmedi.</p>;
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 16, marginTop: 24 }}>
      {videoIds.map((videoId, idx) => {
        const embedUrl = getEmbedUrl(videoId);
        return embedUrl ? (
          <div key={idx} style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
            <iframe
              src={embedUrl}
              title={`Video ${idx}`}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : null;
      })}
    </div>
  );
};

export default MultiGrid;
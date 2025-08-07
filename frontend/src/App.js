import React, { useState, useEffect } from 'react';
import axios from 'axios';


const App = () => {
  const [input, setInput] = useState("");
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("channels");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("channels", JSON.stringify(items));
  }, [items]);

  const extractIds = (urlOrId) => {
    const videoMatch = urlOrId.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (videoMatch) return { type: "video", id: videoMatch[1] };

    const channelMatch = urlOrId.match(/youtube\.com\/channel\/([a-zA-Z0-9_-]{24})/);
    if (channelMatch) return { type: "channel", id: channelMatch[1] };

    if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) return { type: "video", id: urlOrId }; 
    if (/^[a-zA-Z0-9_-]{24}$/.test(urlOrId)) return { type: "channel", id: urlOrId }; 

    return { type: "username", id: urlOrId }; 
  };

  const handleAdd = async () => {
    if (!input.trim()) return;

    const idObj = extractIds(input.trim());
    if (!idObj) return;

    setLoading(true);

    let videoId = null;
    let embedFallback = null;
    let error = null;

    try {
      if (idObj.type === "video") {
        videoId = idObj.id;
      } else if (idObj.type === "channel") {
        // Doğrudan kanal ID'si ise, backend'e canlı yayın için sor
        const response = await axios.get(`http://localhost:5000/api/liveVideoId`, {
          params: { channelUsername: idObj.id },
        });
        if (response.data.videoId) {
          videoId = response.data.videoId;
        } else {
          embedFallback = idObj.id;
          error = response.data.message || "Canlı yayın bulunamadı";
        }
      } else if (idObj.type === "username") {
        // Kanal adı veya @handle ise, backend'e sor
        const response = await axios.get(`http://localhost:5000/api/liveVideoId`, {
          params: { channelUsername: idObj.id },
        });
        if (response.data.videoId) {
          videoId = response.data.videoId;
        } else {
          error = response.data.message || "Kanal bulunamadı veya canlı yayın yok";
        }
      }

      setItems((prevItems) => [
        ...prevItems,
        {
          input,
          videoId,
          embedFallback,
          error,
        },
      ]);
      setInput("");
    } catch (e) {
      console.error("Ekleme hatası:", e);
      setItems((prevItems) => [
        ...prevItems,
        {
          input,
          videoId: null,
          embedFallback: null,
          error: "Bir hata oluştu",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const removeVideo = (inputToRemove) => {
    setItems((prevItems) => prevItems.filter(item => item.input !== inputToRemove));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>YouTube Canlı Yayın İzleyici</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Link, ID, Kanal Adı veya @Handle"
          style={{ width: '300px', padding: '10px', fontSize: '16px' }}
          disabled={loading}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button onClick={handleAdd} disabled={loading}>
          {loading ? 'Yükleniyor...' : 'Ekle'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px' }}>
        {items.map((item, idx) => (
          <div key={idx} style={{ position: 'relative', paddingBottom: '56.25%', height: 0, border: item.error ? '2px solid red' : '1px solid #ccc' }}>
            {item.videoId && (
              <iframe
                src={`https://www.youtube.com/embed/${item.videoId}?autoplay=1`}
                title={`Video ${idx}`}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
            {item.embedFallback && (
              <iframe
                src={`https://www.youtube.com/embed/live_stream?channel=${item.embedFallback}`}
                title={`Fallback Canlı Yayın ${idx}`}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
            {!item.videoId && !item.embedFallback && (
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0' }}>
                <p>{item.error || 'Canlı yayın bulunamadı'}</p>
              </div>
            )}
             <button
              onClick={() => removeVideo(item.input)}
              style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', zIndex: 10 }}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
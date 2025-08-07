const express = require('express');
const cors = require('cors');
const { getLiveVideoId } = require('./utils/youtubeApi');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/api/liveVideoId', async (req, res) => {
  const { channelUsername } = req.query;

  if (!channelUsername) {
    return res.status(400).json({ error: 'channelUsername parametresi gerekli' });
  }

  try {
    const videoId = await getLiveVideoId(channelUsername);
    
    if (!videoId) {
      return res.status(200).json({ message: 'Canlı yayın bulunamadı' });
    }

    return res.status(200).json({ videoId });
  } catch (error) {
    console.error('API isteği sırasında hata oluştu:', error);
    return res.status(500).json({ error: 'Sunucu hatası' });
  }
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor...`);
});

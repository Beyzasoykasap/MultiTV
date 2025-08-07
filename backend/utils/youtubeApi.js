const { google } = require('googleapis');
const axios = require('axios');

const YOUTUBE_API_KEY = "yourapıkey";//kendi API key girin

const youtube = google.youtube({
  version: 'v3',
  auth: YOUTUBE_API_KEY,
});

/**
 * Kanal adından canlı yayın videosunun ID'sini bulur.
 * Önce API, sonra web scraping dener.
 * @param {string} username - YouTube kullanıcı adı veya @handle.
 * @returns {Promise<string|null>} - Canlı video ID'si veya null.
 */
async function getLiveVideoId(username) {
  try {
    if (!username) return null;
    if (username.startsWith('@')) username = username.substring(1);

    // 1. Adım: API ile Kanal ID'sini bul
    const searchResponse = await youtube.search.list({
      part: ['snippet'],
      q: username,
      type: ['channel'],
      maxResults: 1,
    });

    const channelId = searchResponse.data.items?.[0]?.snippet?.channelId;
    if (!channelId) {
      console.log('API ile kanal ID bulunamadı.');
      return null;
    }

    // 2. Adım: Canlı yayın var mı bak
    const liveResponse = await youtube.search.list({
      part: ['snippet'],
      channelId,
      eventType: 'live',
      type: ['video'],
      maxResults: 1,
    });

    if (liveResponse.data.items?.length > 0) {
      const liveVideoId = liveResponse.data.items[0].id.videoId;
      console.log('API ile canlı yayın ID bulundu:', liveVideoId);
      return liveVideoId;
    }

    // 3. Adım: Web Scraping ile bul
    console.log('API ile canlı yayın bulunamadı, scraping deneniyor...');
    const url = `https://www.youtube.com/channel/${channelId}/live`;
    const response = await axios.get(url, {
      headers: { 'Accept-Language': 'en-US,en;q=0.5' }
    });
    const html = response.data;

    const videoIdMatch = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
    if (videoIdMatch) {
      console.log('Scraping ile canlı yayın ID bulundu:', videoIdMatch[1]);
      return videoIdMatch[1];
    }

    console.log('Scraping ile de canlı yayın bulunamadı.');
    return null;

  } catch (error) {
    console.error('getLiveVideoId hatası:', error.message);
    return null;
  }
}

module.exports = {
  getLiveVideoId,
};

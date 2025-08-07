# MultiTV
Bu proje React tabanlı bir web uygulamasıdır.

## Başlatmak için

1. Projeyi klonlayın veya indirin.
2. Node.js yüklü olmalı ,yoksa indirip ve kurun
**Diğer adıma geçmeden önce kodda ilgili yere API key eklemeyi unutmayın

3. Bağımlılıkları yükleyin sırayla
//backend için bunu
   npm install
   npm install express cors dotenv axios googleapis 

//frontend için bunu
   npm install axis 
4. Projeyi başlatın
//önce backend sonra frontend
   npm start


   Proje hakkında
React 19.1.0 kullanılmıştır.

public klasöründe index.html dosyası bulunmalıdır.

Geliştirme ortamı için react-scripts kullanılmıştır.

Notlar
**Bu proje bir YouTube API anahtarı gerektirir. Anahtar `backend/utils/youtubeApi.js` dosyasında şu şekilde tanımlanmalıdır: const YOUTUBE_API_KEY = "yourapıkey";
**API key application restrrictions olarak none ve Restrict key(Youtube Data API v3) olarak seçilmeli

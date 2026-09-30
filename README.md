# Doç. Dr. Hasan Şahin — yerel yeniden tasarım

Onaylanan koyu tasarım, HŞ monogramı ve giriş bölümü; biyografi, kurumsal kimlikler, akademik çalışmalar, yayın görselleri, video, paylaşım, BUKAGEM, SKYTR ve iletişim ile tamamlandı. Saf HTML/CSS/JavaScript; paket kurulumu veya derleme gerektirmez. Tüm yazı tipleri yereldir.

**Yayınlama yapılmadı.** Canlı Wix sitesi ve Sites yayın ayarları değiştirilmedi. `noindex, nofollow` etiketi yerel inceleme boyunca korunuyor.

## Yerel kullanım

Proje klasöründe:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

- Ana sayfa: http://127.0.0.1:4173/
- İletişim / konuşmacı daveti: http://127.0.0.1:4173/iletisim/
- `/home/` ana sayfaya, `/book-dr-avens/` iletişim sayfasına yönlenir.
- Önceki `/phase-1/` önizlemesi artık tam ana sayfaya yönlenir.

Statik uyumluluk sayfaları HTML/JavaScript yönlendirmesi kullanır. Canlıya geçişte sunucu tarafı kalıcı yönlendirme kuralları ayrıca uygulanmalıdır.

## Dosyalar

- `dist/index.html`: tam ana sayfa; mevcut biyografinin üç paragrafı korunur.
- `dist/design-system.css`: onaylı renkler, yerel DM Sans, ortak erişilebilirlik ve tipografi.
- `dist/styles.css`: üst menü, giriş ve tüm devam bölümleri; responsive düzen.
- `dist/script.js`: mobil menü, bölüm bağlantıları, kopyalama, erişilebilir yayın görüntüleyici ve e-posta taslağı.
- `dist/iletisim/index.html`: bağımsız iletişim sayfası; aynı form alanları ve davranış.
- `dist/assets/`: gerçek fotoğraflar, özgün yayın kapakları, tam kurum logoları, HŞ ve yerel fontlar.

Ana sayfa ile bağımsız iletişim sayfasındaki form HTML'i ortaktır; alan değişikliğinde ikisini de güncelleyin. Ortak davranış ve stil tek JS/CSS dosyasındadır. Kullanıcı verileri kaydedilmez, otomatik gönderilmez; sayfa belleğinde kalır.

## Açık entegrasyonlar

1. **Video:** Özgün video kapağı, adı, 2022 bilgisi ve 04:26 süresi korundu. İzleme bağlantısı mevcut Wix oynatıcısını yeni sekmede açar. Yerinde oynatma için site sahibinin yetkili video dışa aktarımı veya etkinleştireceği desteklenen gömme yöntemi gerekir. Denetimde doğrudan imzasız MP4 403 döndü; embed ve download kapalıydı. Geçici imzalı medya URL'leri koda konulmadı.
2. **Form:** Ad, soyad ve e-posta zorunlu; konu ve mesaj isteğe bağlı. Doğrudan iletim henüz bağlı değildir. Form, ziyaretçinin e-posta uygulamasında açabileceği ve kopyalayabileceği bir taslak hazırlar. Sahte gönderildi mesajı göstermez. Canlı gönderim için hizmet, alıcı yapılandırması ve gerçek teslimat testi gerekir.
3. **SKYTR:** Özgün logo ve `https://www.skytryazilim.com/` bağlantısı korundu. 18 Eylül kontrolünde HTTPS yanıtı alındı ancak `/lander` park sayfasına yönlendirme görüldü. Doğru şirket adresi yayın öncesinde doğrulanmalıdır.

## İçerik ve görsel kaynakları

Asıl içerik: https://www.docdrhasansahin.com/ — önceki denetim: `audit/2026-09-17/inventory.json`.

- Portre: https://static.wixstatic.com/media/28568a_287a0172ec1d4447b926c6d4944344c9~mv2.jpeg
- BTÜ kürsü fotoğrafı: https://static.wixstatic.com/media/28568a_4b66ee97eaa44c8e9bef584c9ffca236~mv2.jpeg
- MÜSİAD Bursa fotoğrafı: https://static.wixstatic.com/media/28568a_5b579d15bdb64d138205cd4e8a52c379~mv2.jpeg
- Video kapağı: https://static.wixstatic.com/media/28568a_5057d34642b94d3ab996ac3bda0b5372~mv2.png
- Tam BTÜ logosu: https://btu.edu.tr/tr/sayfa/detay/3401/kurumsal-kimlik
- Tam BUKAGEM logosu: https://bukagem.btu.edu.tr/tr/sayfa/detay/8034/faaliyet-raporu-2022-2025 — PDF ilk sayfasındaki özgün gömülü görsel; yeniden çizilmedi.
- SKYTR logosu: https://static.wixstatic.com/media/28568a_e42543f053dd4ad184eda16bd766f188~mv2.png
- BUKAGEM açıklaması: https://bukagem.btu.edu.tr/tr/sayfa/detay/7673/btu-kariyer-modeli-nedir
- PLOS ONE yayını: https://doi.org/10.1371/journal.pone.0328290
- Animals yayını: https://doi.org/10.3390/ani15101475
- Otonom araçlar yayını: https://dergipark.org.tr/tr/pub/joss/article/1580722

Görseller yalnızca web boyutlarına dönüştürüldü; fotoğraf tonu CSS ile uygulanır. Stok görsel, yapay portre, uydurulmuş logo veya akademik başarı eklenmedi. MÜSİAD fotoğrafı belirli bir BUKAGEM etkinliğine mal edilmedi. DM Sans lisansı `dist/assets/DM-Sans-OFL.txt` içindedir.

Son kontrol raporu: `audit/2026-09-18/full-site-review.md`.

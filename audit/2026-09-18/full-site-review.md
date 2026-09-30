# Tam yerel site — inceleme notları

18 Eylül 2026. Kullanıcının kalan bölümlere devam onayıyla tamamlandı. Yayınlama yapılmadı; canlı site değiştirilmedi.

[Yerel ana sayfa](http://127.0.0.1:4173/) · [İletişim sayfası](http://127.0.0.1:4173/iletisim/)

## Tamamlanan kapsam

| Alan | Sonuç |
| --- | --- |
| Tasarım, HŞ, üst menü ve giriş | Onaylanan ilk aşama korundu; menü ve KEŞFET gerçek bölümlere bağlandı. Etkin bölüm menüde işaretlenir. |
| Hakkında | Mevcut sitedeki üç biyografi paragrafı, akademik uzmanlıklar, SCIE/ESCI, kitap ve kitap bölümü bilgileri ve girişimcilik anlatımı korundu. |
| Kurumsal kimlikler | Açık üç sütunda tam BTÜ, BUKAGEM ve özgün SKYTR logoları; üç görev ve dış bağlantıları. |
| Akademik çalışmalar | Dört araştırma alanı, mevcut giriş metni, üç özgün yayın görseli ve Google Scholar. Doğrulanmış yayın künyeleri ve yayıncı bağlantıları eklendi. |
| Yayın inceleme | Tüm yayınlar sayfada görülebilir. Görseller büyütülebilir; ileri/geri, ok tuşları, Escape, odak geri dönüşü ve tam boy kaynak erişimi çalışır. |
| Konuşmalar | Gerçek video kapağı, başlık, 2022 ve 04:26 bilgisi. İzle bağlantısı mevcut Wix oynatıcısını yeni sekmede açar. Yerinde oynatma aşağıdaki entegrasyon notuna tabidir. |
| Paylaşım | Facebook, X/Twitter, Pinterest, Tumblr ve video bağlantısını kopyalama. Platformlar yalnızca kullanıcı bağlantıya tıklayınca açılır; otomatik paylaşım yapılmaz. |
| Öne çıkanlar | BUKAGEM kariyer modeli, görev, özgün MÜSİAD fotoğrafı; SKYTR görevi, gerçek marka görseli ve mevcut bağlantısı. |
| İletişim | E-posta, adres, LinkedIn, Scholar, e-posta kopyalama, beş alanlı iletişim formu ve ayrı iletişim sayfası. |
| İletişim davranışı | Ad/soyad/e-posta doğrulaması; konu/mesaj isteğe bağlı. Kopyalanabilir, e-posta uygulamasında açılabilir taslak hazırlanır. “Mesajınız henüz gönderilmedi” durumu açıkça gösterilir. |
| Alt bilgi | ©2026, SKYTR Yazılım Katkılarıyla ifadesi, iletişim ve başa dön bağlantıları korundu. |
| Eski adresler | `/home/` → ana sayfa; `/book-dr-avens/` → iletişim. İlgisiz kişi ve şablon referansları yeni sayfaya taşınmadı. `/phase-1/` tam siteyi açar. |

## Doğrulama

Chrome üzerinde 1440, 834, 390 ve 320 piksel ekran genişlikleri test edildi. Tümünde yatay taşma, eksik yerel görsel, eksik bölüm hedefi ve yerel konsol/runtime/HTTP kaynak hatası görülmedi. Her sayfada bir H1 var. Masaüstünde %200 yazı büyütmede de yatay taşma yok.

Menü bağlantılarının başlık altında doğru konuma kayması, mobil menünün açılıp kapanması, Escape, klavye odağı, ekran değişimi, içeriğe geç bağlantısı, aktif bölüm işareti, yayın görüntüleyicisi ve kopyalama doğrulandı. Kopyalama izni reddedilince yanlış başarı durumu yerine seçilebilir metin sunuluyor.

Formda boş zorunlu alanlarla taslak üretilemediği, Türkçe karakterler ve `&` içeren konunun doğru kodlandığı, taslağın kopyalanabildiği ve alan değişince eski taslağın kaldırıldığı kontrol edildi. Hiçbir gerçek ileti gönderilmedi. Video düğmesinin doğru özgün URL'yi yeni sekmede açtığı doğrulandı; yeni site içinde oynatma tamamlanmış olarak raporlanmıyor.

Kontroller Chrome ile yapıldı; bu ortamda WebKit/Safari otomasyon çalıştırıcısı bulunmadığından ayrıca Safari testi yapılmadı. Paylaşım servislerinde kullanıcı hesabıyla paylaşım gerçekleştirilmedi. Tam bir WCAG uygunluk sertifikasyonu yapılmadı.

- [Ekran/etkileşim kontrol verisi](./full-site-checks.json)
- [Klavye, yedek kopyalama ve içerik kontrol verisi](./full-site-functional-checks.json)
- [Masaüstü](./full-site-screenshots/desktop.png)
- [Tablet](./full-site-screenshots/tablet.png)
- [Mobil](./full-site-screenshots/mobile.png)
- [İletişim](./full-site-screenshots/contact.png)

## Açık entegrasyonlar

1. **Wix video:** Kaynak denetiminde gömme ve indirme kapalı, doğrudan imzasız MP4 erişimi 403 idi. Yerinde oynatıcıya geçiş için yetkili medya dışa aktarımı veya site sahibinin etkinleştireceği desteklenen gömme yöntemi gerekli. Özgün video referansı silinmedi; izleme mevcut kaynakta sürüyor. Geçici imzalı bağlantılar, özel anahtarlar veya erişim atlatma yöntemleri kullanılmadı.
2. **Gerçek form teslimatı:** Sunucu/gönderim hizmeti bağlı değil. Şu anki işlev gerçek bir e-posta taslağıdır; teslimat iddiası içermez. Yayın öncesinde hizmet, alıcı ayarı ve gerçek teslimat testi tamamlanmalı.
3. **SKYTR adresi:** Özgün `https://www.skytryazilim.com/` korundu. Son istekte HTTPS 200 yanıtı alındı, fakat sayfa JavaScript ile `/lander` adresine yönlendiriyor; bu yanıt park sayfası işaretleri içeriyor. Doğru şirket adresinin yayın öncesinde teyidi gerekli. Bu durum SKYTR içeriğinin kaldırılmasına yol açmadı.
4. **Yayın aşaması:** Yerel `noindex, nofollow` korunuyor. Dağıtım onayı sonrasında kalıcı URL/canonical, indeksleme ve eski yollar için sunucu yönlendirmeleri yayın ortamına göre ayarlanmalı. Yayın izni bu çalışmanın kapsamında değildi.

## Değişen dosyalar

- `dist/index.html`: tam ana sayfa.
- `dist/styles.css`: onaylı giriş/üst menü ve tüm devam bölümleri.
- `dist/script.js`: menü, bölüm navigasyonu, yayın görüntüleyicisi, kopyalama ve taslak formu.
- `dist/design-system.css`: ortak tasarım değerleri ve yerel fontlar.
- `dist/iletisim/index.html`: ayrı iletişim sayfası.
- `dist/home/index.html`, `dist/book-dr-avens/index.html`: eski yollar için uyumluluk girişleri.
- `dist/phase-1/index.html`: tamamlanmış yerel siteye yönlendirme.
- `dist/assets/monogram.svg`, `portrait-480.webp`, `portrait-800.webp`, `dm-sans-latin.woff2`, `dm-sans-latin-ext.woff2`, `DM-Sans-OFL.txt`: onaylanan ilk aşamadaki varlıklar ana sitenin ortak varlık dizinine alındı.
- `dist/assets/btu-full.png`, `bukagem-full.png`: resmi kaynaktan tam kurum kimlikleri.
- `dist/assets/about-photo.webp`, `speaking-900.webp`, `video-poster.webp`: gerçek kaynakların web için boyutlandırılmış kopyaları.
- `dist/assets/publication-{plos,animals,autonomous}-{thumb,large}.webp`: üç yayının küçük ve büyük görselleri.
- `README.md`: kullanım, kaynaklar ve kalan entegrasyonlar güncellendi.
- Bu rapor, kontrol JSON dosyaları ve ekran görüntüleri eklendi. Tarihsel denetim ve ilk aşama raporları korundu.

Kaynaklar, tam URL'ler ve görsel kökenleri [README](../../README.md) ve [ilk içerik envanterinde](../2026-09-17/inventory.json) yer alır. Biyografinin aslı: [docdrhasansahin.com](https://www.docdrhasansahin.com/). BUKAGEM açıklaması: [resmi BTÜ Kariyer Modeli sayfası](https://bukagem.btu.edu.tr/tr/sayfa/detay/7673/btu-kariyer-modeli-nedir).

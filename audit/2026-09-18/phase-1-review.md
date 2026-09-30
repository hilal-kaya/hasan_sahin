Doç. Dr. Hasan Şahin — 1. aşama incelemesi

18 Eylül 2026. Yalnızca yerel geliştirme. Yayına alma yapılmadı.

[Yerel önizlemeyi aç](http://127.0.0.1:4173/phase-1/)

Tamamlanan kapsam: ortak tasarım değişkenleri, geometrik HŞ monogramı, sabit üst menü ve giriş bölümü. Hakkında ve sonraki bölümler bu önizlemeye eklenmedi. Önceki proje dosyaları korunarak ayrı bir `phase-1` dizini oluşturuldu; bu sayfa, tamamlanmış sitenin yerine geçen bir içerik aktarımı değildir.

Siyah, antrasit, kırık beyaz ve bronz palet kullanıldı. Masaüstünde isim ve görevler solda, gerçek fotoğraf sağda. Mobilde isim, fotoğraf, üç görev, alıntı ve iki eylem sırayla yer alıyor. Kutu içine yazılmış baş harfler yerine SVG çizgilerinden oluşan bir kişisel işaret tasarlandı; aynı işaret site simgesinde kullanılıyor.

Fotoğraf, [mevcut sitedeki özgün portreden](https://static.wixstatic.com/media/28568a_287a0172ec1d4447b926c6d4944344c9~mv2.jpeg) alınmış mevcut `portrait.webp` dosyasıdır. Yeni 480 ve 800 piksel sürümleri yalnızca boyutlandırılıp sıkıştırıldı. Koyu/siyah-beyaz görünüm CSS ile uygulanır; fotoğrafın içeriği değiştirilmedi. Web yazı tipleri de yerel dosyalardan yüklenir.

**Eklenen uygulama dosyaları**

| Dosya | İşlev |
|---|---|
| [index.html](/Users/hilalkaya/Desktop/imep/dist/phase-1/index.html) | Türkçe semantik sayfa, üst menü, hero, gerçek görevler ve alıntı; inceleme sayfası için `noindex`. |
| [design-system.css](/Users/hilalkaya/Desktop/imep/dist/phase-1/design-system.css) | Renkler, aralık ölçeği, yazı tipleri, temel stiller, düğmeler, odak ve azaltılmış hareket tercihleri. |
| [phase-1.css](/Users/hilalkaya/Desktop/imep/dist/phase-1/phase-1.css) | Üst menü, portre, isim, görevler ve duyarlı yerleşim. |
| [phase-1.js](/Users/hilalkaya/Desktop/imep/dist/phase-1/phase-1.js) | Mobil menü, Escape, odak yönetimi ve henüz bulunmayan bölüm bağlantılarının davranışı. |
| [monogram.svg](/Users/hilalkaya/Desktop/imep/dist/phase-1/assets/monogram.svg) | Özgün geometrik HŞ işareti. |
| [portrait-480.webp](/Users/hilalkaya/Desktop/imep/dist/phase-1/assets/portrait-480.webp) | Küçük ekranlar için 16 KB portre. |
| [portrait-800.webp](/Users/hilalkaya/Desktop/imep/dist/phase-1/assets/portrait-800.webp) | Orta/büyük ekranlar için 32 KB portre. |
| [dm-sans-latin.woff2](/Users/hilalkaya/Desktop/imep/dist/phase-1/assets/dm-sans-latin.woff2) | Yerel değişken yazı tipi, Latin karakterleri. |
| [dm-sans-latin-ext.woff2](/Users/hilalkaya/Desktop/imep/dist/phase-1/assets/dm-sans-latin-ext.woff2) | Türkçe karakterleri de kapsayan ek karakter kümesi. |
| [DM-Sans-OFL.txt](/Users/hilalkaya/Desktop/imep/dist/phase-1/assets/DM-Sans-OFL.txt) | Yazı tipinin SIL Open Font License dosyası. |

Mevcut `dist/index.html`, `dist/styles.css`, `dist/script.js`, `dist/assets/`, `README.md` ve `.openai/hosting.json` değiştirilmedi. Framework veya paket bağımlılığı eklenmedi.

**Doğrulamalar**

| Kontrol | Sonuç |
|---|---|
| Masaüstü 1440 × 1000 | Yatay taşma yok; portre, görevler, alıntı ve CTAlar mevcut. |
| Tablet 834 × 1112 | İki sütun korunuyor; mobil menüye geçiliyor. |
| Mobil 390 × 844 ve 320 × 740 | İçerik tek sütuna geçiyor; hiçbir görev, fotoğraf, alıntı veya CTA gizlenmiyor. |
| %200 yazı büyütme | Üst menü taşması düzeltildi; sayfa genişliği 1440 pikselde kalıyor. |
| Konsol ve kaynak yüklemeleri | Test edilen ekranlarda sıfır konsol/çalışma zamanı hatası ve sıfır HTTP hata yanıtı. |
| Klavye | İçeriğe geç bağlantısı, ana içeriğe odak, menüde Enter/Tab, Escape ile kapanma ve düğmeye odak dönüşü doğrulandı. |
| Menü ve sabit üst başlık | Aç/kapat, ekran genişliği değişimi ve kaydırma davranışları doğrulandı. |
| Google Scholar | Doğru `3MqbElMAAAAJ` profili, yeni sekme, `noopener noreferrer`; 18 Eylül kontrolünde HTTP 200 ve Hasan SAHIN profil başlığı alındı. |
| Fotoğraf ve yazı tipleri | Yerel dosyalar yüklendi; ekrana uygun `srcset` kaynağı seçildi. |
| Azaltılmış hareket | Yumuşak kaydırma ve geçişler kapatılıyor. |
| Metin kontrastı | `#080808` üzerinde ana metin 18,35:1, ikincil metin 8,23:1, bronz 7,52:1. Tam WCAG uygunluk sertifikası iddiası değildir. |

**Bu aşamada açık kalanlar**

- Menüdeki bölüm bağlantıları ve KEŞFET, hedef bölümler henüz oluşturulmadığı için `aria-disabled` ile işaretlenir. Seçildiğinde bu bölümün önizlemede bulunmadığına dair kısa bir bildirim verir. Sahte bölüm veya sessizce değişen bozuk hedef oluşturulmadı. Gerçek hedef ID'leri sayfaya eklendiğinde bağlantılar sayfa yüklenişinde otomatik etkinleşir.
- Tam içerik aktarımı sonraki aşamalardadır. [Önceki içerik envanteri](/Users/hilalkaya/Desktop/imep/audit/2026-09-17/inventory.json) biyografi, yayınlar, video, paylaşım, kurumlar, iletişim ve footer için minimum kapsam olarak korunuyor.
- Korunan Wix videosunun yetkili aktarımı/entegrasyonu, iletişim formunun gerçek teslimat yapılandırması ve SKYTR HTTPS erişiminin yeniden doğrulanması ileriki aşamalarda ele alınacak. Bu sorunlar içerik kaldırma gerekçesi değildir. Bu aşamada video veya form arayüzü yapılmadı; herhangi bir sahte gönderim durumu eklenmedi.
- Eski `/book-dr-avens` adresi ve mevcut canlı siteye dokunulmadı. Şablon temizliği ve faydalı sorgu işlevinin aktarımı ilgili aşamada yapılacak.

Bu rapora ek olarak [kontrol sonuçları](/Users/hilalkaya/Desktop/imep/audit/2026-09-18/phase-1-checks.json) ve üç ekran görüntüsü kaydedildi: [masaüstü](/Users/hilalkaya/Desktop/imep/audit/2026-09-18/screenshots/desktop.png), [tablet](/Users/hilalkaya/Desktop/imep/audit/2026-09-18/screenshots/tablet.png), [mobil](/Users/hilalkaya/Desktop/imep/audit/2026-09-18/screenshots/mobile.png).

Yerel sunucuyu yeniden başlatmak gerekirse proje dizininde `python3 -m http.server 4173 --bind 127.0.0.1 --directory dist` çalıştırılır; inceleme adresi `/phase-1/` olarak korunur.

İlk aşama görsel inceleme için tamamlandı. Sonraki bölümler ve yayına alma, kullanıcının ilgili onayından önce yapılmayacak.

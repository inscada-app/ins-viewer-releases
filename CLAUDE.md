# CLAUDE.md

## Release Workflow (Immutable Releases)

Bu repo'da GitHub release'ler **immutable** — oluşturulduktan sonra asset eklenemez, tag tekrar kullanılamaz.

**Doğru sıralama:**
1. `package.json` version bump → commit → `git push`
2. `npm run build` (exe oluştur)
3. `git tag vX.Y.Z` → `git push origin vX.Y.Z`
4. `gh release create vX.Y.Z "dist/inSCADA Viewer Setup X.Y.Z.exe" --title "vX.Y.Z" --notes "..."` (exe ile birlikte, tek seferde)

**Yapma:**
- Önce release oluşturup sonra exe upload etme (422 hatası verir)
- Kullanılmış tag'i silip tekrar oluşturma (repo kuralları engeller)
- Hata yaparsan yeni versiyon numarasına geçmek zorundasın

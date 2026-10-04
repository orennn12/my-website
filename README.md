# Web Channel Game

Situs statis (HTML/CSS/JS), tanpa build step.

## Ubah isi
Buka `script.js`, edit blok `CONFIG` di paling atas (nama, video, jadwal, link sosmed). Warna ada di `:root` pada `style.css`.

## Deploy ke Cloudflare Pages
1. Push folder ini ke GitHub.
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git.
3. Pilih repo. Framework preset: None. Build command: kosongkan. Output directory: `/`.
4. Setelah deploy, buka Custom domains → tambahkan domain kamu.

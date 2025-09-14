# GitHub Pages 배포 가이드

## 1. GitHub 저장소 생성

1. GitHub에서 새 저장소 생성
2. 저장소 이름: `KHT-Portfolio` (또는 원하는 이름)
3. Public으로 설정 (GitHub Pages 무료 사용을 위해)

## 2. 로컬에서 Git 초기화

```bash
# 현재 디렉토리에서 Git 초기화
git init

# 원격 저장소 추가 (yourusername을 실제 GitHub 사용자명으로 변경)
git remote add origin https://github.com/yourusername/KHT-Portfolio.git

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit: Bassist profile e-book"

# 메인 브랜치로 푸시
git branch -M main
git push -u origin main
```

## 3. GitHub Pages 설정

1. GitHub 저장소 페이지에서 **Settings** 탭 클릭
2. 왼쪽 메뉴에서 **Pages** 클릭
3. **Source** 섹션에서 **Deploy from a branch** 선택
4. **Branch**를 `main`으로 선택
5. **Folder**를 `/ (root)`로 선택
6. **Save** 클릭

## 4. 도메인 확인

- 배포 완료 후 `https://yourusername.github.io/KHT-Portfolio` 접속
- 배포에는 몇 분 정도 소요될 수 있음

## 5. 커스텀 도메인 설정 (선택사항)

1. 도메인을 구매한 후 DNS 설정
2. `CNAME` 파일 생성하여 도메인명 입력
3. GitHub Pages 설정에서 Custom domain 입력

## 6. 자동 배포 설정

GitHub Actions를 사용한 자동 배포:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

## 7. 성능 최적화

### 이미지 최적화
```bash
# WebP 변환 (ImageMagick 필요)
convert input.jpg -quality 80 output.webp

# 또는 온라인 도구 사용
# https://convertio.co/jpg-webp/
```

### CSS/JS 압축
```bash
# CSS 압축
npx clean-css-cli -o styles/common.min.css styles/common.css

# JS 압축
npx terser js/main.js -o js/main.min.js
```

## 8. SEO 최적화

1. `index.html`의 메타 태그 수정:
   - `og:url`을 실제 도메인으로 변경
   - `og:image` 경로 확인
   - JSON-LD 구조화 데이터 수정

2. Google Search Console 등록
3. sitemap.xml 생성 (선택사항)

## 9. 분석 도구 추가

### Google Analytics
```html
<!-- index.html의 </head> 태그 앞에 추가 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Google Search Console
1. Google Search Console에 사이트 등록
2. HTML 파일 업로드 또는 DNS 확인으로 소유권 인증

## 10. 문제 해결

### 배포가 안 될 때
- GitHub Pages 설정 확인
- 파일명 대소문자 확인
- `index.html`이 루트에 있는지 확인

### 이미지가 안 보일 때
- 파일 경로 확인
- 파일명 대소문자 확인
- 이미지 파일이 실제로 업로드되었는지 확인

### 모바일에서 스와이프가 안 될 때
- 터치 이벤트 지원 확인
- CSS `touch-action` 속성 확인

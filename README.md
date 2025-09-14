# 베이시스트 프로필 E-book

HTML/CSS/JavaScript만으로 구현된 모바일 최적화 베이시스트 프로필 웹사이트입니다.

## 🎵 특징

- **수평 페이징**: 좌우 스와이프로 페이지 전환
- **두 가지 테마**: Minimal (흑백) / Neon (네온)
- **모바일 최적화**: 반응형 디자인
- **접근성**: 키보드 네비게이션, ARIA 라벨
- **SEO 최적화**: 메타 태그, 구조화 데이터
- **무료 호스팅**: GitHub Pages

## 📱 페이지 구성

1. **Cover**: 이름, 포지션, CTA 버튼
2. **Artist Statement**: 간단 이력, 소개
3. **Signature Sound**: 연주 영상/오디오 샘플
4. **Highlights**: 대표 작업 이미지 카드
5. **Live Clips**: 공연 영상 썸네일
6. **Discography**: 음반/크레딧 타일
7. **Gear**: 장비 소개
8. **Testimonials**: 추천사 슬라이드
9. **Contact**: 문의폼, 연락처
10. **Outro**: 감사 메시지, 공유 버튼

## 🚀 사용법

### 로컬 실행
```bash
# 저장소 클론
git clone https://github.com/yourusername/KHT-Portfolio.git
cd KHT-Portfolio

# 간단한 HTTP 서버 실행 (Python 3)
python -m http.server 8000

# 또는 Node.js
npx http-server

# 브라우저에서 http://localhost:8000 접속
```

### GitHub Pages 배포
1. 저장소를 GitHub에 푸시
2. Settings > Pages에서 소스 선택
3. `main` 브랜치의 `/` 폴더 선택
4. 저장 후 `https://yourusername.github.io/KHT-Portfolio` 접속

## 🎨 커스터마이징

### 콘텐츠 수정
- `index.html`에서 텍스트, 이미지 경로 수정
- `assets/` 폴더에 이미지/영상 파일 추가

### 스타일 수정
- `styles/minimal.css`: Minimal 테마 스타일
- `styles/neon.css`: Neon 테마 스타일
- `styles/common.css`: 공통 스타일

### 기능 수정
- `js/main.js`: JavaScript 기능 수정

## 📁 프로젝트 구조

```
KHT-Portfolio/
├── index.html              # 메인 HTML 파일
├── styles/
│   ├── common.css          # 공통 스타일
│   ├── minimal.css         # Minimal 테마
│   └── neon.css           # Neon 테마
├── js/
│   └── main.js            # JavaScript 기능
├── assets/                # 이미지, 영상, 오디오 파일
│   ├── images/
│   ├── videos/
│   └── audio/
└── README.md
```

## 🔧 기술 스택

- **HTML5**: 시맨틱 마크업
- **CSS3**: Flexbox, Grid, 애니메이션
- **JavaScript ES6+**: 클래스, 모듈
- **GitHub Pages**: 무료 호스팅

## 📱 브라우저 지원

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🎯 성능 최적화

- 이미지 최적화 (WebP 권장)
- Lazy loading
- CSS/JS 압축
- 모바일 우선 설계

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

## 📄 라이선스

MIT License - 자유롭게 사용하실 수 있습니다.

# CLAUDE.md - CrossTimer Harness (이 프로젝트의 헌법)

## 1. 역할 (Multi-Agent 시스템)
- **Planner**: 전체 스펙·로드맵·다음 스프린트 계획
- **Generator**: HTML/CSS/JS 실제 코드 작성
- **Evaluator**: 타이머 정확도·UI/UX·버그 엄격 검증
- **Documenter**: worklog.md에 모든 과정 기록

## 2. 작업 규칙 (반드시 지킬 것)
- 한 번에 **하나의 스프린트**만 진행 (작은 기능 단위)
- 변경사항은 무조건 `docs/worklog.md`에 hypothesis → command → result → evidence 형식 기록
- Evaluator는 “타이머 정확도 100% + 모바일 반응형 + 사운드 정상”을 최우선 검증
- 모든 JS는 모듈화 (timer.js, ui.js, presets.js 등)

## 3. 기술 스택
- HTML5, CSS3 (Tailwind CDN 사용), Vanilla JavaScript
- Audio API (알림음)
- localStorage (프리셋 저장)
- Full-screen API + Wake Lock (모바일 운동 중 화면 꺼짐 방지)
- 모바일 우선 반응형 (세로 모드 최적화)

## 4. Evaluator 검증 기준 (점수 0~10)
- Timer Accuracy (초 단위 정확도): 무조건 10점
- UI/UX (운동 중 직관성 + 시인성): 9점 이상
- Mobile Experience: 9점 이상
- Code Quality & Modularity: 8점 이상
- Bug Free: 10점 (버그 있으면 즉시 재작성)

## 5. 핵심 기능 로드맵 (최종 목표)
1. 기본 Countdown + Start/Pause/Reset
2. Tabata (20/10), EMOM, AMRAP, Interval 커스텀
3. 미리 만들어진 WOD 프리셋 8개
4. 사운드 알림 + 진동 + 색상 변경 (Work/Rest)
5. Full-screen + 화면 항상 켜짐
6. 프리셋 저장·불러오기 (localStorage)
7. 다크모드 + 크로스핏 느낌 디자인

## 6. 작업 흐름
Planner → 스프린트 계획 → Generator → 코드 → Evaluator 검증 → Documenter 기록 → 반복
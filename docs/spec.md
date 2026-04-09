# CrossTimer spec.md

## 프로젝트 개요
- 이름: CrossTimer (크로스핏 전용 타이머)
- 타겟: 크로스핏 박스 회원들이 운동 중 바로 사용할 수 있는 인터벌 타이머
- 핵심 요구사항: 화면에 **흐릿한 타이틀 로고 "CFGN.SS"** 항상 표시

## Sprint 1 목표 (현재 진행 중)
- Tailwind + 다크 크로스핏 테마 적용
- 화면 중앙에 초 단위 큰 디지털 타이머
- Start / Pause / Reset 버튼
- 배경에 **흐릿하고 은은한 CFGN.SS 로고** (blur + low opacity)
- 모바일 완벽 반응형 + 터치 친화적
- 기본 5분 카운트다운 (나중에 프리셋으로 확장)

## 전체 로드맵 (추후)
1. 기본 타이머 엔진 + 로고 (Sprint 1)
2. Tabata / EMOM / AMRAP 모드
3. WOD 프리셋 8개 + localStorage 저장
4. 사운드·진동·색상 변경 (Work/Rest)
5. Full-screen + Wake Lock

## 디자인 방향
- 메인 컬러: #111111 (배경), #00FF9D (네온 그린)
- 로고: 흐릿하게 (blur + opacity 8~12%), 화면 전체에 살짝 보이게# Specification
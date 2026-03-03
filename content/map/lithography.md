---
title: "Lithography 패터닝"
step: "Lithography"
order: 2
summary_3lines:
  - "마스크 패턴을 포토레지스트에 전사하는 공정이다."
  - "파장, NA, 포커스가 해상도와 수율을 결정한다."
  - "Overlay·CDU 관리가 미세 공정의 핵심이다."
  - "EUV/High-NA는 해상도는 높지만 공정 난도가 크다."
  - "패터닝 품질은 이후 식각/증착 결과에 직접 영향."
key_points:
  - "회로 패턴의 기준선을 만드는 핵심 공정."
  - "해상도 vs 공정 윈도(변동 허용폭) 균형이 중요."
  - "Overlay/CDU는 미세 공정 수율의 핵심 지표."
  - "EUV 도입으로 장비/레지스트 난도가 상승."
common_issues:
  - "포커스/노광 조건 불안정"
  - "레지스트 붕괴/라인 에지 거칠기"
  - "Overlay 오차 및 정렬 불량"
  - "마스크 결함/오염"
measurements:
  - "CD 측정(SEM/광학)"
  - "Overlay 메트롤로지"
  - "포커스/도즈 모니터링"
  - "레지스트 두께/균일도 측정"
  - "패턴 결함 검사"
handoff:
  - "리소그래피 패턴 품질이 식각 프로파일을 결정."
  - "정렬 오차는 다음 층 배선/접속 문제로 이어짐."
  - "레지스트 상태가 식각 선택비/손상에 영향."
tags:
  - lithography
  - patterning
  - photoresist

audiences:
  - general
updated_at: "2026-03-03"
sources:
  - https://en.wikipedia.org/wiki/Semiconductor_device_fabrication
  - https://www.ibm.com/topics/semiconductors
---
리소그래피는 “회로의 설계도를 웨이퍼 위에 그리는 단계”입니다. 마스크(포토마스크) 패턴을 빛으로 레지스트에 전사하고, 현상으로 패턴을 남겨 이후 공정의 기준선을 만듭니다.

핵심 변수는 파장(λ), NA, 포커스입니다. 해상도를 올릴수록 공정 윈도는 좁아져서 작은 변동에도 수율이 떨어질 수 있습니다.

미세 공정에서는 Overlay(층 정렬)과 CDU(치수 균일도)가 수율과 직결됩니다. 앞 공정에서 생긴 미세 변형이 뒤 공정의 정렬 오차로 이어질 수 있기 때문에 계측과 보정이 필수입니다.

EUV/High-NA는 해상도를 높이지만 광학계/마스크/레지스트 조건이 함께 올라가므로 공정 난도가 크게 증가합니다. 리소그래피는 단순한 “패턴 그리기”가 아니라 전체 공정 안정성을 좌우하는 기준 공정입니다.

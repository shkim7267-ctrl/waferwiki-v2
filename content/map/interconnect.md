---
title: "Interconnect 배선"
step: "Interconnect"
order: 5
summary_3lines:
  - "트랜지스터를 금속 배선으로 연결해 회로를 완성한다."
  - "저저항 금속과 절연막 조합이 핵심이다."
  - "RC 지연과 신뢰성이 성능 병목이 된다."
  - "다마신(Damascene) 공정이 표준이다."
  - "CMP와의 연계가 배선 품질을 좌우한다."
key_points:
  - "배선 재료·저유전 절연막 선택이 성능에 직결."
  - "다마신 공정 + CMP가 표준 흐름."
  - "RC 지연과 EM(일렉트로마이그레이션) 관리가 핵심."
  - "배선 구조는 패키징/시스템 설계와 연결됨."
common_issues:
  - "보이드/기공 발생"
  - "CMP 디싱/에로전"
  - "EM로 인한 신뢰성 저하"
  - "저유전 재료 손상"
measurements:
  - "시트 저항/라인 저항"
  - "라인 폭/간격 측정"
  - "CMP 평탄도 측정"
  - "배선 결함 검사"
  - "신뢰성/EM 테스트"
handoff:
  - "배선 품질이 테스트 수율과 성능에 직결."
  - "배선 구조가 패키징 신호 무결성에 영향."
  - "CMP 품질이 후속 패키징 결함으로 연결될 수 있음."
tags:
  - interconnect
  - metallization
  - rc-delay

audiences:
  - general
updated_at: "2026-03-03"
sources:
  - https://en.wikipedia.org/wiki/Semiconductor_device_fabrication
  - https://www.ibm.com/topics/semiconductors
---
배선 공정은 “소자를 연결해 회로를 완성하는 단계”입니다. 트랜지스터가 잘 만들어져도 배선 품질이 낮으면 전체 칩 성능이 떨어집니다.

현대 배선은 다마신 공정이 표준입니다. 절연막에 트렌치를 만들고 금속을 채운 뒤, CMP로 평탄화해 균일한 배선을 얻습니다.

미세 공정일수록 RC 지연이 증가해 속도와 전력에 영향을 줍니다. 그래서 저저항 금속, 저유전 절연막, 배리어막 설계가 중요해집니다.

배선은 패키징 단계와도 연결됩니다. 내부 배선 구조가 외부 인터페이스 설계에 영향을 주기 때문에, 전공정/후공정의 연결 관점에서 이해하는 것이 필요합니다.

# 프로젝트 구조와 개발 참고

## 개요

`@pdg/data`는 TypeScript 데이터 유틸리티 npm 패키지다. 실제 코드와 설정을 문서보다 우선한다. 현재 공개 기능은 `src/index.ts`의 이름 있는 내보내기와 같은 네 함수를 담은 기본 내보내기다.

| 경로 | 책임과 주의점 |
| --- | --- |
| `src/copy.ts` | JSON 직렬화와 역직렬화로 복사한다. 모든 객체 유형을 보존하는 범용 복사가 아니다. |
| `src/lv.ts`, `src/vl.ts` | 인자 순서가 다른 `label`·`value` 객체 생성 함수. 추가 속성과 타입 추론을 함께 확인한다. |
| `src/makeConst.ts` | 값·레이블 목록에서 별칭과 조회 함수를 만든다. 튜플 추론과 런타임 결과를 함께 확인한다. |
| `src/index.ts` | 네 함수의 이름 있는 내보내기와 기본 객체를 제공하는 번들 진입점 |
| `test/*.test.ts` | 공개 진입점을 통한 Jest 동작 테스트. 현재 각 함수의 기본 사례를 다룬다. |
| `examples/src/example.ts` | 현재 `Hello, World!`만 출력한다. `examples/`는 별도 npm 프로젝트이며 루트 패키지 의존성은 없다. |
| `package.json`, `rollup.config.js` | 배포 진입점, 명령과 CJS·ESM 번들 생성 설정 |
| `tsconfig.json`, `tsconfig.test.json`, `jest.config.ts` | 소스 타입 검사 및 ts-jest의 Node 테스트 환경 |
| `dist/` | Git에서 추적하는 빌드 결과. 직접 편집하지 않으며 빌드가 기존 내용을 덮어쓴다. |

## 빌드와 배포 경로

Rollup은 `src/index.ts`에서 `dist/index.js`(CJS), `dist/index.esm.js`(ESM)를 생성하고 타입 선언을 `dist/`에 출력한다. `package.json`의 `main`·`exports.require`, `module`·`exports.import`, `types`·`exports.types`가 각각 이 파일을 가리킨다. `files`는 `dist`와 `README.md`를 지정한다.

- `"type": "module"`인 패키지에서 CJS 출력이 `.js`이므로 Node의 `require` 호환성을 보장할 수 없다. 배포 경로나 모듈 형식을 변경하거나 게시할 때 실제 설치 패키지의 `import`, `require`, 타입 해석을 별도로 검증한다.
- Rollup은 `dist/*`를 삭제한 후 생성하고 `.private` 디렉터리와 `.private.d.ts`를 제거한다. 공개 선언이 삭제된 타입을 참조하지 않는지도 확인한다.
- 소스 타입 검사는 `src/`만 포함하고 lint도 `src/**/*.ts`만 검사한다. 테스트와 예제는 별도 확인이 필요하다. Rollup의 ESLint는 경고에도 실패한다.
- TypeScript는 ES2017, `moduleResolution: bundler`, `strict`, `verbatimModuleSyntax`를 사용한다. 테스트는 별도 설정으로 Jest·Node 타입을 사용한다.
- Rollup의 `context: 'window'`만으로 브라우저 지원을 판단하지 않는다. 테스트 환경은 Node다.

## 명령 안내

루트 기준이며 `.nvmrc`는 Node `24.22.1`을 지정한다. 루트와 `examples/`의 의존성은 별도 설치하고 잠금 파일은 Git에서 제외된다.

| 목적 | 명령 | 주의점 |
| --- | --- | --- |
| 타입 검사 | `npm run tsc` | `src/` 대상 |
| 정적 검사 | `npm run lint` | `src/**/*.ts` 대상 |
| 테스트 | `npm test -- --runInBand --watchman=false` | Watchman 없이 실행 |
| 표준 빌드 | `npm run build` | Watchman 재등록, 기본 Jest, Rollup 순서 |
| 번들만 확인 | `./node_modules/.bin/rollup -c --bundleConfigAsCjs` | 테스트를 별도로 실행해야 하며 `dist/*`를 지운다. |
| 예제 실행 | `npm run dev` | `examples/` 의존성이 필요하며 단발 실행이다. |
| 배포 목록 확인 | `npm pack --dry-run` | 게시하지 않는다. 실제 소비 검증을 대신하지 않는다. |

`npm run pub`는 설치·빌드·공개 게시를 수행하고 끝의 `|| true`가 실패를 가릴 수 있다. `git:commit`은 전체 변경을 스테이징하고, `reset:gitignore`는 인덱스를 재구성하며, `reinstall:module`은 의존성과 잠금 파일을 삭제한다. 일반 검증에 사용하지 않는다.

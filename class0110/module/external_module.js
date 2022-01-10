// nconf 모듈을 사용하면 시스템 환경 변수에 접근할 수 있음
const nconf = require('nconf'); // 외장 모듈을 사용할 때는 상대 경로를 사용x
nconf.env();
console.log('OS 환경변수의 값: %s', nconf.get('OS'));
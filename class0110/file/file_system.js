// 동기식 IO는 파일 작업이 끝날 때까지 대기, Sync라는 단어가 붙음
var fs = require('fs');
var data = fs.readFileSync('../../package.json', 'utf-8');
console.log(data);
var fs = require('fs');
fs.readFile('../../package.json', 'utf-8', function(err, data) { // 콜백 함수를 파라미터로 전달
    console.log(data);
});
console.log('프로젝트 폴더 안의 package.json 파일 읽기');
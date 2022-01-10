const { file } = require('nconf');
var path = require('path');

// path에서 디렉토리, 파일 이름, 확장자 구별하기
var filename = "C:\\Users\\mike\\notepad.exe";
var dirname = path.dirname(filename); // 디렉토리
var basename = path.basename(filename); // 파일 이름
var extname = path.extname(filename); // 확장자
console.log('디렉토리: %s, 파일이름: %s, 확장자: %s', dirname, basename, extname);
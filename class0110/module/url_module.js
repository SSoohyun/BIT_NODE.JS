var url = require('url');

// 주소 문자열을 파싱하여 url 객체 생성
var curURL = url.parse('https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8');
var curStr = url.format(curURL); // url 객체를 주소 문자열로 변환
console.log('주소 문자열: %s', curStr);
console.dir(curURL);
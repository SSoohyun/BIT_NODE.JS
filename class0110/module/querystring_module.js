var url = require('url');
var curURL = url.parse('https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8');

// & 기호로 구분되는 요청 파라미터를 분리하는 데 사용
var querystring = require('querystring');
var param = querystring.parse(curURL.query); // 요청 파라미터 문자열을 파싱하여 요청 파라미터 객체를 만들어줌
console.log('요청 query 중 파라미터의 값: %s', param.query);
console.log('원본 요청 파라미터: %s', querystring.stringify(param)); // 요청 파라미터 객체를 문자열로 변환
const http = require('http');
const options = {
    host: 'www.google.com',
    port:80,
    path:'/'
};

const req = http.get(options, function(res) { // get 방식으로 요청
    let resData = '';
    res.on('data', function(chunk) {
        resData += chunk; // 데이터를 모두 문자열로
    });

    res.on('end', function() { // 데이터 수신 완료
        console.log(resData);
    });
});

req.on('error', function(err) {
    console.log("오류 발생" + err.message);
});
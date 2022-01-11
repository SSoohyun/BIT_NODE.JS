let express = require('express'), http = require('http');

let app = express(); // app 객체 생성

// use() 메소드를 여러번 사용
app.use(function (req, res, next) {
    console.log('첫 번째 미들웨어에서 요청을 처리함');
    req.user = 'conan';
    next(); // 다음 미들웨어로 넘김
});

app.use(function (req, res, next) {
    console.log('두 번째 미들웨어에서 요청을 처리함');
    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    res.end('<h1>Express 서버에서 ' + req.user + '이 응답 중</h1>');
    next();
});

app.listen(3000, function() {
    console.log('Express 서버가 3000번 포트에서 start');
});
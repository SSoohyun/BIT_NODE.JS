let express = require('express'), http = require('http');

let app = express(); // app 객체 생성

app.use(function (req, res, next) { // 미들웨어가 하나뿐이라 next 사용 X
    console.log('첫 번째 미들웨어에서 요청을 처리함');
    
    let userAgent = req.header('User-agent');
    let paramName = req.query.name; // 클라이언트에서 get 방식으로 전송한 요청 파라미터 확인 (?name= 값을 가져옴)
    
    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express 서버 응답</h1>');
    res.write('<div><p>User-agent : ' + userAgent + '</p></div>');
    res.write('<div><p>Param name : ' + paramName + '</p></div>');
    res.end();
});

app.listen(3000, function() {
    console.log('Express 서버가 3000번 포트에서 start');
});
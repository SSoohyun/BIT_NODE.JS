let express = require('express'), http = require('http');

let app = express(); // app 객체 생성

app.use(function (req, res, next) { // 미들웨어가 하나뿐이라 next 사용 X
    console.log('첫 번째 미들웨어에서 요청을 처리함');
    // res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    // res.end("<h1>Express 서버 응답</h1>");

    // send
    // res.send({name:'코난', age:10});

    // redirect
    res.redirect("http://google.com");
});

app.listen(3000, function() {
    console.log('Express 서버가 3000번 포트에서 start');
});
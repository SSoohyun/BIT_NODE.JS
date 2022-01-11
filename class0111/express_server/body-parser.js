// body-parser: post로 요청했을 때 요청 파라미터 확인 방법 제공

let express = require('express'), http = require('http'), path = require('path');
let bodyParser = require('body-parser'), static = require('serve-static');

var app = express();

app.set('port', process.env.PORT || 3000);

// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({extended:false}))
// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())
app.use(static(path.join(__dirname, 'public'))); // 루트로 접근

app.use(function (req, res, next) {
    console.log('첫 번째 미들웨어에서 요청을 처리함');

    let paramUserId = req.body.userId || req.query.userId; // 아이디
    let paramUserPwd = req.body.userPwd || req.query.userPwd; // 패스워드

    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express 서버 응답</h1>');
    res.write('<div><p>Param id : ' + paramUserId + '</p></div>');
    res.write('<div><p>Param password : ' + paramUserPwd + '</p></div>');
    res.end();
});

app.listen(3000, function() {
    console.log('Express 서버가 3000번 포트에서 start');
});
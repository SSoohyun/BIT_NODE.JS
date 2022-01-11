let express = require('express'), http = require('http'), path = require('path');
let bodyParser = require('body-parser'), static = require('serve-static');
let cookieParser = require('cookie-parser');

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(cookieParser());

// 라우터 객체 참조
let router = express.Router();

// 라우팅 함수 등록
router.route('/process/setUserCookie').get(function(req, res) {
    console.log('/process/setUserCookie 호출됨');
    
    // 쿠키 설정 .. 응답 객체의 cookie 메소드 호출
    res.cookie('user', {
        id:'conan',
        name:'코난',
        authorized:true
    });

    // redirect로 응답
    res.redirect('/process/showCookie');
});

// showCookie
router.route('/process/showCookie').get(function(req, res) {
    console.log('/process/showCookie 호출됨');

    res.send(req.cookies); // 쿠키 정보 표시
});

app.use('/', router); // 라우터 객체를 app 객체에 등록

// 등록되지 않은 패스에 대해 페이지 오류 응답
app.all('*', function(req, res) {
    res.status(404).send('<h1>ERROR - 페이지를 찾을 수 없습니다.</h1>');
});

app.listen(3000, function() {
    console.log('Express 서버가 3000번 포트에서 start');
});
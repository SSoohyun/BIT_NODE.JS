let express = require('express'), http = require('http'), path = require('path');
let bodyParser = require('body-parser'), static = require('serve-static');
let expressSession = require('express-session');

var app = express();

app.set('port', process.env.PORT || 3000);

// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({extended:false}))
// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())
app.use('/public', static(path.join(__dirname, 'public')));

// 세션 설정
app.use(expressSession({
    secret:'my key',
    resave: true,
    saveUninitialized: true
}));

// 라우터 객체 참조
let router = express.Router();

// 로그인 라우팅 함수 - 로그인 후 세션 저장함
router.route('/process/login').post(function(req, res) {
    console.log('/process/login 호출됨');
    
    let paramUserId = req.body.userId || req.query.userId;
    let paramUserPwd = req.body.userPwd || req.query.userPwd;

    if(req.session.user) { // 이미 로그인된 상태
        console.log("이미 로그인되어 상품 페이지로 이동합니다.");
        res.redirect('/public/product.html');
    } else {
        // 세션 저장
        req.session.user = {id:paramUserId, name:'코난', authorized:true};
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h1>로그인 성공</h1>');
        res.write('<div><p>Param id : ' + paramUserId + '</p></div>');
        res.write('<div><p>Param password : ' + paramUserPwd + '</p></div>');
        res.write("<br><br><a href='/process/product'>상품 페이지로 이동하기</a>");
        res.end();
    }
});

app.use('/', router); // 라우터 객체를 app 객체에 등록

// 등록되지 않은 패스에 대해 페이지 오류 응답
app.all('*', function(req, res) {
    res.status(404).send('<h1>ERROR - 페이지를 찾을 수 없습니다.</h1>');
});

app.listen(3000, function() {
    console.log('Express 서버가 3000번 포트에서 start');
});
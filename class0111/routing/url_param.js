let express = require('express'), http = require('http'), path = require('path');
let bodyParser = require('body-parser'), static = require('serve-static');

var app = express();

app.set('port', process.env.PORT || 3000);

// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({extended:false}))
// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())
app.use('/public', static(path.join(__dirname, 'public'))); // 루트/public ~

// 라우터 객체 참조
let router = express.Router();

// 라우팅 함수 등록
router.route('/process/login/:name').post(function(req, res) { // 데이터를 name으로 받음
    console.log('/process/login/:name 처리함');
    
    let paramName = req.params.name; // parameter로 받음 (주소에 노출되는 값)
    let paramUserId = req.body.userId || req.query.userPwd; // post || get
    let paramUserPwd = req.body.userPwd || req.query.userPwd;

    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express 서버 응답</h1>');
    res.write('<div><p>Param name : ' + paramName + '</p></div>');
    res.write('<div><p>Param id : ' + paramUserId + '</p></div>');
    res.write('<div><p>Param password : ' + paramUserPwd + '</p></div>');
    res.write("<br><br><a href='/public/login2.html'>로그인 페이지로 돌아가기</a>");
    res.end();
});

app.use('/', router); // 라우터 객체를 app 객체에 등록

// 등록되지 않은 패스에 대해 페이지 오류 응답
app.all('*', function(req, res) {
    res.status(404).send('<h1>ERROR - 페이지를 찾을 수 없습니다.</h1>');
});

app.listen(3000, function() {
    console.log('Express 서버가 3000번 포트에서 start');
});
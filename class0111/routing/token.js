let express = require('express'), http = require('http'), path = require('path');
let bodyParser = require('body-parser'), static = require('serve-static');

var app = express();

app.set('port', process.env.PORT || 3000);

// 라우터 객체 참조
let router = express.Router();

// 라우팅 함수 등록
router.route('/process/users/:id').get(function(req, res) { // :id -> 토큰
    console.log('/process/users/:id 처리함');
    
    // url 파라미터 확인
    let paramId = req.params.id;
    console.log('/process/users와 토큰 %s를 이용해 처리함', paramId);

    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express 서버 응답</h1>');
    res.write('<div><p>Param id : ' + paramId + '</p></div>');
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
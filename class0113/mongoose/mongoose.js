// Express 기본 모듈 불러오기
let express = require('express'), http = require('http'), path = require('path');
let bodyParser = require('body-parser'), static = require('serve-static');
let mongoose = require('mongoose');

// Session 미들웨어 불러오기
let expressSession = require('express-session');

// 익스프레스 객체 생성
let app = express();

// 기본 속성 설정
app.set('port', process.env.PORT || 3000);

// body-parser 설정
// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({extended:false}))
// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())

// session 설정
app.use(expressSession({
    secret:'my key',
    resave: true,
    saveUninitialized: true
}));

// public 폴더를 static으로 오픈
app.use('/public', static(path.join(__dirname, '/public')));

let database; let MemberSchema; let MemberModel;
// 데이터베이스에 연결
function connectDB() {
    // 데이터베이스 연결 정보
    let databaseUrl = 'mongodb://localhost:27017/bitDB';
    // 데이터베이스 연결
    console.log('데이터베이스 연결을 시도합니다.');
    mongoose.Promise = global.Promise; // mongoose의 Promise 객체는 global의 Promise 객체
    mongoose.connect(databaseUrl); // 연결
    database = mongoose.connection;
    
    // 연결되었는지 확인
    database.on('error', console.error.bind(console, 'mongoose connection error')); 
    database.on('open', function() {
        console.log('데이터베이스에 연결되었습니다.' + databaseUrl);
        // 스키마 정의
        MemberSchema = mongoose.Schema({
            userId : String,
            userPwd : String,
            userName : String
        });
        console.log('MemberSchema 정의함');

        // MemberModel 모델 정의
        // 컬렉션과 스키마 연결 (컬렉션 이름은 소문자만 인식, 컬렉션 없으면 생성·있으면 그 컬렉션 사용)
        MemberModel = mongoose.model("members2", MemberSchema); 
        console.log('MemberModel 정의함');
    });
    // 연결 끊어졌을 때 5초 후 재연결
    database.on('disconnected', function() {
        console.log('연결이 끊어졌습니다. 5초 후 재연결합니다.');
        setInterval(connectDB, 5000); // 5초마다 실행
    });
}

// 사용자를 추가하는 함수
let addMember = function(database, userId, userPwd, userName, callback) {
    console.log('addMember 호출됨: ' + userId + ', ' + userPwd + ', ' + userName);
    
    // MemberModel 인스턴스 생성
    let user = new MemberModel({"userId":userId, "userPwd":userPwd, "userName":userName});
    
    // save()로 저장: 저장 성공 시 addedUser 객체가 파라미터로 전달됨
    user.save(function(err, addedUser) {
        console.log("addedUser%j", addedUser);
        if(err) {
            callback(err, null);
            return;
        }
        console.log("사용자 데이터 추가함");
        callback(null, addedUser);
    });
};

// 사용자 인증 함수
let authMember = function(database, userId, userPwd, callback) {
    console.log('authMember 호출됨');

    MemberModel.find({"userId":userId, "userPwd":userPwd}, function(err, results) {
        if(err) {
            callback(err, null);
            ruturn;
        }
        console.log('아이디[%s], 비밀번호[%s]로 사용자 검색 결과', userId, userPwd);
        console.dir(results);

        if(results.length > 0) {
            console.log('일치하는 사용자 찾음', userId, userPwd);
            callback(null, results);
        } else {
            console.log('일치하는 사용자 찾지 못함');
            callback(null, null);
        }
    });
}

// 라우터 사용하여 라우팅 함수 등록
let router = express.Router();

// 회원가입
router.route('/process/addMember').post(function(req, res) {
    console.log('/process/addMember 호출됨');

    // 요청 파라미터 확인
    let userId = req.body.userId || req.query.userId;
    let userPwd = req.body.userPwd || req.query.userPwd;
    let userName = req.body.userName || req.query.userName;
    console.log('요청 파라미터: ' + userId + ', ' + userPwd + ', ' + userName);

    // 데이터베이스 객체가 초기화된 경우, addMember 함수 호출
    if(database) {
        addMember(database, userId, userPwd, userName, function(err, result) {
            if(err) {
                throw err;
            }
            // 추가된 데이터가 있으면 성공 응답 전송
            if(result) {
                console.dir(result);
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>가입 성공</h1>');
                res.end();
            } else { // 결과 객체가 없으면 실패 응답 전송
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>가입 실패</h1>');
                res.end();
            }
        })
    } else { // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
});

// 로그인 라우팅 함수 - 로그인 후 세션 저장함
router.route('/process/login').post(function(req, res) {
    console.log('/process/login 호출됨');
    
    // 요청 파라미터 확인
    let userId = req.body.userId || req.query.userId;
    let userPwd = req.body.userPwd || req.query.userPwd;
    console.log('요청 파라미터: ' + userId + ', ' + userPwd);

    // 데이터베이스 객체가 초기화된 경우, authMember 함수 호출하여 사용자 인증
    if(database) {
        authMember(database, userId, userPwd, function(err, docs) {
            if(err) {
                throw err;
            }

            // 조회된 레코드가 있으면 성공 응답 전송
            if(docs) {
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>로그인 성공</h1>');
                res.end();
            } else { // 조회된 레코드가 없는 경우 실패 응답 전송
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>로그인 실패</h1>');
                res.end();
            }
        });
    } else {
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
});

app.use('/', router); // 라우터 객체를 app 객체에 등록

app.listen(app.get('port'), function() {
    console.log('서버가 시작되었습니다. 포트: ' + app.get('port'));
    // 데이터베이스 연결을 위한 함수 호출
    connectDB();
});
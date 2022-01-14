// Express 기본 모듈 불러오기
let express = require('express'), http = require('http'), path = require('path');
let bodyParser = require('body-parser'), static = require('serve-static');
let mongoose = require('mongoose');

// member
let member = require('./member');
// let listMember = require('./member').listMember;
// let addMember = require('./member').addMember;
// let authMember = require('./member').authMember;

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
            userId : {type: String, required: true, unique: true},
            userPwd : {type: String, required: true},
            userName : {type: String, index: 'hashed'},
            age : {type: Number, 'default': -1},
            regDate: {type: Date, index:{unique: false}, 'default': Date.now},
            updateDate: {type: Date, index:{unique: false}, 'default': Date.now}
        });
        // 스키마에 static 메소드 추가
        MemberSchema.static('findById', function(userId, callback) {
            return this.find({userId: userId}, callback);
        });
        MemberSchema.static('findAll', function(callback) {
            return this.find({}, callback);
        });
        console.log('MemberSchema 정의함');

        // MemberModel 모델 정의
        // 컬렉션과 스키마 연결 (컬렉션 이름은 소문자만 인식, 컬렉션 없으면 생성·있으면 그 컬렉션 사용)
        MemberModel = mongoose.model("members3", MemberSchema); 
        console.log('MemberModel 정의함');
    });
    // 연결 끊어졌을 때 5초 후 재연결
    database.on('disconnected', function() {
        console.log('연결이 끊어졌습니다. 5초 후 재연결합니다.');
        setInterval(connectDB, 5000); // 5초마다 실행
    });
}

// 라우터 사용하여 라우팅 함수 등록
let router = express.Router();

// 회원가입
router.route('/process/addMember').post(function(req, res) {
    console.log('/process/addMember 호출');

    // 요청 파라미터 확인
    let userId = req.body.userId || req.query.userId;
    let userPwd = req.body.userPwd || req.query.userPwd;
    let userName = req.body.userName || req.query.userName;
    let age = req.body.age || req.query.age;
    console.log('요청 파라미터: ' + userId + ', ' + userPwd + ', ' + userName + ', ' + age);

    // 데이터베이스 객체가 초기화된 경우, addMember 함수 호출
    if(database) {
        // MemberModel 인스턴스 생성해서 addMember의 인자로 보냄
        let user = new MemberModel({"userId":userId, "userPwd":userPwd, "userName":userName, "age":age});

        member.addMember(database, user, userId, userPwd, userName, age, function(err, result) {
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
    console.log('/process/login 호출');
    
    // 요청 파라미터 확인
    let userId = req.body.userId || req.query.userId;
    let userPwd = req.body.userPwd || req.query.userPwd;
    console.log('요청 파라미터: ' + userId + ', ' + userPwd);

    // 데이터베이스 객체가 초기화된 경우, authMember 함수 호출하여 사용자 인증
    if(database) {
        member.authMember(database, MemberModel, userId, userPwd, function(err, docs) {
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

// 회원 리스트 조회
router.route('/process/listMember').post(function(req, res) {
    console.log('/process/listMember 호출');
    
    // 요청 파라미터는 없음

    // 데이터베이스 객체가 초기화된 경우, authMember 함수 호출하여 사용자 인증
    if(database) {
        // 1. 모든 사용자 검색
        member.listMember(database, MemberModel, function(err, results) {
            if(err) {
                console.error('사용자 리스트 조회 중 오류 발생 : ' + err.stack);
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 리스트 조회 중 오류 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
            }

            if(results.length > 0) { // 결과 객체가 있으면 리스트 전송
                console.dir(results);
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 리스트</h2>');
                res.write('<div><ul>');
                for(let i = 0; i < results.length; i++) {
                    let curUserId = results[i]._doc.userId;
                    let curUserPwd = results[i]._doc.userPwd;
                    let curUserName = results[i]._doc.userName;
                    let curAge = results[i]._doc.age;
                    let curRegDate = results[i]._doc.regDate;
                    let curUpdateDate = results[i]._doc.updateDate;
                    res.write('<li>#' + i + ' : ' 
                    + '<br>아이디=' + curUserId + ' / ' + '비밀번호=' + curUserPwd + ' / '
                    + '<br>이름=' + curUserName + ' / ' + '나이=' + curAge + ' / '
                    + '<br>가입일=' + curRegDate + ' / ' + '수정일=' + curUpdateDate + '<hr></li>');
                }
                res.write('</ul></div>');
                res.end();
            } else { // 결과 객체가 없으면 실패 응답 전송
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>조회에 실패했습니다.</h2>');
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
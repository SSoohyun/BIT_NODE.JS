// Express 기본 모듈 불러오기
let express = require('express'), http = require('http'), path = require('path');
let bodyParser = require('body-parser'), static = require('serve-static');
let mongoose = require('mongoose');

// 라우터 사용하여 라우팅 함수 등록
let router = express.Router();

// 라우팅 함수 등록
let member = require('./member');
router.route('/process/login').post(member.procLogin);
router.route('/process/addMember').post(member.procAddMember);
router.route('/process/listMember').post(member.procListMember);
router.route('/process/updateMember').post(member.procUpdateMember);
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

function createMemberSchema(database) {
    console.log('createMemberSchema() 호출되었음');
    database.MemberSchema = require('./memberSchema.js').createSchema(mongoose);
    database.MemberModel = mongoose.model("members3", database.MemberSchema); // MemberModel 모델 정의
    console.log('Schema 생성되었음');
    console.dir('Model 생성되었음');
}

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
        createMemberSchema(database);
    });
    // 연결 끊어졌을 때 5초 후 재연결
    database.on('disconnected', function() {
        console.log('연결이 끊어졌습니다. 5초 후 재연결합니다.');
        setInterval(connectDB, 5000); // 5초마다 실행
    });
    app.set('database', database);
}

app.use('/', router); // 라우터 객체를 app 객체에 등록

app.listen(app.get('port'), function() {
    console.log('서버가 시작되었습니다. 포트: ' + app.get('port'));
    // 데이터베이스 연결을 위한 함수 호출
    connectDB();
});
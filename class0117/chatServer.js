// Express 기본 모듈 불러오기
let express = require('express'), http = require('http'), path = require('path');
let bodyParser = require('body-parser'), static = require('serve-static');
let mongoose = require('mongoose');

// Session 미들웨어 불러오기
let expressSession = require('express-session');

// socket.io 모듈 불러들이기
let socketio = require('socket.io');
// cors 사용 - 클라이언트에서 ajax로 요청하면 CORS 지원
let cors = require('cors');

// 익스프레스 객체 생성
let app = express();
// 기본 속성 설정
app.set('port', process.env.PORT || 3000);

// body-parser 설정
// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({extended:false}))
// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())

// cors를 미들웨어로 사용하도록 등록
app.use(cors());

// session 설정
app.use(expressSession({
    secret:'my key',
    resave: true,
    saveUninitialized: true
}));


// 라우터 사용하여 라우팅 함수 등록
let router = express.Router();

// 라우팅 함수 등록
let member = require('./member');
router.route('/process/login').post(member.procLogin);
router.route('/process/addMember').post(member.procAddMember);
router.route('/process/listMember').post(member.procListMember);
router.route('/process/updateMember').post(member.procUpdateMember);


// public 폴더를 static으로 오픈
app.use('/public', static(path.join(__dirname, '/public')));
app.use('/semantic', static(path.join(__dirname, 'semantic')));
app.use('/images', static(path.join(__dirname, 'images')));

// 익스프레스에서 뷰 엔진을 ejs로 설정
app.set('/view', __dirname + '/views');
app.set('view engine', 'ejs');

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


// 시작된 서버 객체를 반환
let server = app.listen(app.get('port'), function() {
    console.log('서버가 시작되었습니다. 포트: ' + app.get('port'));
    // 데이터베이스 연결을 위한 함수 호출
    // connectDB();
});

// socket.io 서버를 시작
let io = socketio(server);
console.log('socket.io 요청 대기 중');

let login_userIds = {};

// 클라이언트가 연결했을 때의 이벤트 처리
io.sockets.on('connection', function(socket) {
    console.log('connection info : ', socket.request.connection._peername);
    // 소켓 객체에 클라이언트 Host, Port 정보 속성으로 추가
    socket.remoteAddress = socket.request.connection._peername.address;
    socket.remotePort = socket.request.connection._peername.port;

    // 'message' 이벤트를 받았을 때의 처리
    socket.on('message', function(message) {
        console.log('message 이벤트를 받았음');
        console.dir(message);
        
        if(message.recepient == 'ALL') { // 나를 포함한 모든 클라이언트에게 메시지 전달
            console.dir('나 포함 모든 클라이언트에게 message 이벤트를 전송');
            io.sockets.emit('message', message);
        } else { // 특정 클라이언트에게 메시지 전달
            if(login_userIds[message.recepient]) { // 메시지 수신자가 있는 경우
                io.sockets.to(login_userIds[message.recepient]).emit('message', message);
                // message 이벤트를 받았을 때 일대일 채팅인 경우 상대방 소켓을 찾아 메시지 전송
                sendResponse(socket, 'message', '200', '메시지 전송완료');
            } else {
                sendResponse(socket, 'login', '404', '상대방의 로그인 ID를 찾을 수 없음');
            }
        }
    });

    // 'login' 이벤트를 받았을 때 처리
    socket.on('login', function(login) {
        console.log('login 이벤트 발생');
        console.dir(login);

        // 기존 클라이언트 ID가 없으면 클라이언트 ID를 맵에 추가
        login_userIds[login.userId] = socket.id; // socket.id는 고유 속성이므로 변경 x
        socket.login_userId = login.userId;
        console.log('접속한 클라이언트 ID 개수 : %d', Object.keys(login_userIds).length); 
        sendResponse(socket, 'login', '200', '로그인되었음'); // 응답 메시지 전송 (emit)
    });

    // 응답 메시지 전송 메소드
    function sendResponse(socket, command, code, message) {
        let statusObj = {command: command, code: code, message: message};
        socket.emit('response', statusObj);
    }
});
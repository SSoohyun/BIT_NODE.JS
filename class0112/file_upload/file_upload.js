let express = require('express'), http = require('http'), path = require('path');
let bodyParser = require('body-parser'), static = require('serve-static');
let expressSession = require('express-session');
let multer = require('multer'); // 파일 업로드용 미들웨어
let fs = require('fs');
let cors = require('cors'); // 클라이언트에서 ajax로 요청 시 CORS(다중 서버 접속) 지원

var app = express();

app.set('port', process.env.PORT || 3000);

// 세션 설정
app.use(expressSession({
    secret:'my key',
    resave: true,
    saveUninitialized: true
}));

// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({extended:false}))
// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())

// public 폴더와 uploads 폴더 오픈
app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads')));
app.use(cors());

// multer 미들웨어 사용: 미들웨어 순서 중요. body-parser -> multer -> router
// 파일 제한 : 10개, 1G
let storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, 'uploads')
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname + Date.now())
    }
});

let upload = multer({
    storage: storage,
    limits: {
        files: 10,
        fileSize: 1024 * 1024 * 1024
    }
});

// 라우터 사용하여 라우팅 함수 등록
let router = express.Router();

// 파일 업로드 라우팅 함수 - 로그인 후 세션 저장함
router.route('/process/upload').post(upload.array('uploadedFile', 1), function(req, res) {
    console.log('/process/upload 호출됨');
    
    try {
        let files = req.files;
        console.dir('#=== 업로드된 첫 번째 파일 정보 ===#');
        console.dir(req.files[0]);
        console.dir('#================================#');

        // 현재의 파일 정보를 저장할 변수 선언
        let originalname = '', filename = '', mimetype = '', size = 0;
        if(Array.isArray(files)) { // 배열에 들어가 있는 경우 (설정에서 1개의 파일도 배열에 넣게 했음)
            console.log("배열에 들어있는 파일 개수 : %d", files.length);
            for(let index = 0; index < files.length; index++) {
                originalname = files[index].originalname;
                filename = files[index].filename;
                mimetype = files[index].mimetype;
                size = files[index].size;
            }
        } else { // 배열에 들어가 있지 않은 경우(현재 설정에서는 해당 없음)
            console.log("파일 개수 : 1");
            originalname = files[index].originalname;
            filename = fiels[index].filename;
            mimetype = files[index].mimetype;
            size = files[index].size;
        }
        console.log('현재 파일 정보: ' + originalname + ',' + filename + ',' + mimetype + ',' + size);

        // 클라이언트에 응답 전송
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h1>파일 업로드 성공</h1>');
        res.write('</hr>');
        res.write('<p>원본 파일명 : ' + originalname + ' -> 저장 파일명: ' + filename + '</p>');
        res.write('<p>MIME TYPE : ' + mimetype + '</p>');
        res.write('<p>파일 크기: ' + size + '</p>');
        res.end();
    } catch (err) {
        console.dir(err.stack);
    }
});

// 상품정보 라우팅 함수
router.route('/process/product').get(function(req, res) {
    console.log('/process/product 호출됨');

    if(req.session.user) { // 로그인된 상태
        res.redirect('/public/product.html');
    } else {
        res.redirect('/public/login.html');
    }
});

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

// 로그아웃 라우팅 함수 - 로그아웃 후 세션 삭제
router.route('/process/logout').get(function(req, res) {
    console.log('/process/logout 호출됨.');
    if(req.session.user) {
        // 로그인된 상태
        console.log('로그아웃합니다.');
        req.session.destroy(function(err) {
            if(err) {
                throw err;
            }
            console.log('세션을 삭제하고 로그아웃함');
            res.redirect('/public/login.html');
        });
    } else {
        // 로그인 안된 상태
        console.log('아직 로그인되어있지 않음');
        res.redirect('/public/login.html');
    }
});

app.use('/', router); // 라우터 객체를 app 객체에 등록

// 등록되지 않은 패스에 대해 페이지 오류 응답
// app.all('*', function(req, res) {
//     res.status(404).send('<h1>ERROR - 페이지를 찾을 수 없습니다.</h1>');
// });

app.listen(3000, function() {
    console.log('Express 서버가 3000번 포트에서 start');
});
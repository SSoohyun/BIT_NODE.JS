var http = require('http');
var server = http.createServer(); // 웹 서버 객체 생성

// 웹 서버 실행 시 호스트와 포트 지정하는 경우
var host = '127.0.0.1'; // 호스트
var port = 3000; // 포트

// 서버 생성한 다음 클라이언트가 요청할 때까지 대기
server.listen(port, host, '50000', function() { // 50000: 응답 대기시간
    console.log('웹 서버 시작: %s, %d', host, port);
});

server.on('connection', function(socket) { // 클라이언트가 접속하여 연결됨
    var addr = socket.address();
    console.log('클라이언트가 접속: %s, %d', addr.address, addr.port);
});

server.on('request', function(req, res) { // 클라이언트가 요청(req: 요청, res: 응답)
    console.log('클라이언트가 요청함');
    //console.dir(req);

    // 파일 읽어 응답하기
    var filename = 'choonsik.jpg';
    var fs = require('fs');
    fs.readFile(filename, function(err, data) {
        res.writeHead(200, {"Content-Type":'image/jpg'});
        res.write(data);
        res.end();
    });
});
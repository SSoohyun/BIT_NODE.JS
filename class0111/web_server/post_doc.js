let http = require('http');

let opts = {
    host: 'www.google.com',
    port:80,
    method:'POST',
    path:'/',
    headers:{}
};

let resData = '';
let req = http.request(opts, function(res) { // post 방식으로 요청 -> error 발생
    // 응답 처리
    res.on('data', function(chunk) {
        resData += chunk; // 데이터를 모두 문자열로
    });

    res.on('end', function() { // 데이터 수신 완료
        console.log(resData);
    });
});

// post 방식으로 요청 시에는 헤더 작성 필요
opts.headers['Content-Type'] = 'application/x-www-form-urlencoded';
req.data = "q=actor";
opts.headers['Content-Length'] = req.data.length;

req.on('error', function(err) {
    console.log("오류 발생" + err.message);
});

// 요청 전송
req.write(req.data);
req.end();
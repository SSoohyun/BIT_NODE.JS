const express = require('express');

// 익스프레스 객체 생성
let app = express();

// 기본 포트를 app 객체에 속성으로 설정
app.set('port', process.env.PORT || 3000);

// 익스프레스 서버 시작
app.get('/', (req, res) => { // writeHead, write, end를 send로 한 번에 처리
    res.send('Hello World');
});

app.listen(app.get('port'), () =>
    console.log('익스프레스 서버를 시작했습니다 : ' + app.get('port'))
);
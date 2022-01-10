const { fuchsia } = require('color-name');
var fs = require('fs');
fs.open('./output.txt', 'r', function(err, fd) { // open으로 열고
    if(err) {
        throw err;
    }
    var buf = Buffer.alloc(20); // 버퍼 할당
    console.log('버퍼 타입: %s', Buffer.isBuffer(buf));
    fs.read(fd, buf, 0,  buf.length, null, function(err, bytesRead, buffer) { // read로 읽기 (바이트 단위로 읽어서 버퍼로 처리)
        if(err) {
            throw err;
        }
        var inStr = buffer.toString('utf-8', 0, bytesRead);
        console.log('파일에서 읽은 데이터 : %s', inStr);
        console.log(err, bytesRead, buffer);
        fs.close(fd, function() {
            console.log('ouptut.txt 파일을 열고 읽기 완료');
        });
    });
});
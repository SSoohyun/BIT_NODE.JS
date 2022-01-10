// open, read, write, close
const fs = require('fs');
fs.open('./output.txt', 'w', function(err, fd) {
    if(err) {
        throw err;
    }
    const buf = Buffer.from('안녕!\n', 'utf-8');
    fs.write(fd, buf, 0, buf.length, null, function(err, written, buffer) {
        if(err) {
            throw err;
        }
        console.log(err, fs.written, buffer);
        fs.close(fd, function() {
            console.log('파일 열고 데이터 쓰고 파일 닫기 완료');
        });
    });
});
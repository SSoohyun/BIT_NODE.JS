var fs = require('fs');
// mkdir
fs.mkdir('./docs', 0666, function (err) {
    if (err) {
        throw err;
        console.log('새로운 docs폴더를 생성');
    }
});

// rmdir
fs.rmdir('./docs', function (err) {
    if (err) {
        console.log('docs 폴더를 삭제');
    }
});
// process 객체를 이용해 이벤트를 발생시킴
// on으로 등록 -> emit을 해야 이벤트가 실행됨
process.on('tick', function(count) {
    console.log('tick 이벤트 발생함 : %s', count);
});

setTimeout(function() {
    console.log('2초 후에 tick 이벤트 전달 시도함.');
    process.emit('tick', 2); // 이벤트 실행
}, 2000);
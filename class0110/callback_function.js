// 비동기 처리
// 콜백 함수 : 나중에 실행되는 코드
// A()라는 함수의 인자로 함수를 넘겨준 다음,
// A 함수의 모든 명령들을 실행한 다음, 마지막으로 넘겨받은 인자 callback을 실행
setTimeout(() => {
    console.log('todo : first!'); // 함수를 인자로 넣음
}, 3000); // 3초 후 실행

setTimeout(() => {
    console.log('todo : second!');
}, 2000); // 2초 후 실행

// 동기 처리
setTimeout(() => {
    setTimeout(() => {
        console.log('todo : second!');
    }, 2000); // 콜백 함수
    console.log('todo : first!');
}, 3000); // 3초 후 first 실행한 후 second 실행

// 콜백 큐를 거치지 않고 동기적으로 처리
// 함수가 호출되면 stack에 들어가고, 실행 끝나면 stack에서 빠져나옴
function mySetTimeout(callback) {
    callback();
}
console.log(0);
mySetTimeout(function() {
    console.log("hello"); // 단순 출력이라 callback할 것이 없음
});
console.log(1);

// 비동기 처리
console.log(0);
setTimeout(function() { // 콜백 함수
    console.log('hello'); // 콜백 큐로 들어감
}, 0);
console.log(1);
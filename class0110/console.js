// console
console.log('숫자 보여주기 : %d', 10);
console.log('문자열 보여주기 : %s', '안녕!');
console.log('JSON 객체 보여주기 : %j', {name : '코난'});

// console.time
var result = 0;
console.time('elapsedTime');
for (var i = 0; i <= 100; i++) {
    result += i;
}
console.timeEnd('elapsedTime');
console.log('1부터 100까지의 합: %d', result);

// console
console.log('현재 실행한 파일의 이름: %s', __filename); // 파일명
console.log('현재 실행한 파일의 path: %s', __dirname); // 경로
var Person = {name:"conan", age:10}; // 객체
console.dir(Person); // 객체 정보 출력
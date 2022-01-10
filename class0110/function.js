function add(a, b) {
    return a + b;
}
console.log(add(1, 4));

// 람다식을 이용한 함수 선언
const lambda_add = (a, b) => { // function 키워드 생략
    return a + b;
}
console.log("lambda add : " + lambda_add(2, 4)); // 변수 이름으로 호출

const lambda_add1 = (a, b) => a + b; // return 생략
console.log("lambda add1 : " + lambda_add1(2, 4));


// 함수 생성 시에 자신의 스코프 안에 자신을 가리키는 this와 파라미터가 담기는 arguments가 자동 생성
const myFunc = function() {
    console.log(arguments);
}
myFunc(1, 2, 3, 4);

// 람다식 표현은 자동 생성하지 않으므로 필요한 경우 ...args로 생성 (입력 인자가 몇 개인지 정해지지 않음)
const myFunc1 = (...args) => {
    console.log(args);
}
myFunc1(1, 2, 3, 4);
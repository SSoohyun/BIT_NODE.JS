// 변수 호이스팅
console.log(dog);
var dog = "bark";
console.log(dog);
var dog = "happy";
console.log(dog);

// 호이스팅 해결
let dog1;
dog1 = "happy";
console.log(dog1);
// let dog1 = "happy"; // 변수 중복 선언 불가능

const dog2 = "happy";
// const dog2 = "very happy"; // 변수 중복 선언 불가능

// Function level scope
// 함수의 블록 범위 내에서 선언한 변수는 함수 내에서만 인정
// 함수 외부에서 선언한 변수는 모두 전역 변수
// let: 재할당 가능, const: 재할당 불가
var cat = "happy";
console.log(cat); // happy
{
    var cat = "sad";
}
console.log(cat); // sad

let cat1 = "happy";
{
    let cat1 = "sad";
}
console.log(cat1); // happy
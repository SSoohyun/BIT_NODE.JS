// 내부 함수가 외부 함수의 스코프에 접근할 수 있음
// outer()의 실행이 끝난 이후에도 inner() 함수가 outer() 함수의 스코프에 접근 가능
function outer() {
    var a = 'AA';
    var b = 'BB';
    console.log("from outer : " + a); // AA
    console.log("from outer : " + b); // BB
    
    function inner() {
        var a = 'aa';
        console.log("from inner : " + a); // aa
        console.log("from inner : " + b); // BB
    }
    return inner;
}

var outerFunc = outer(); // 함수를 변수에 할당
outerFunc();
// promise : 보낸 요청에 대해 응답이 준비되었을 때 알림을 주는 역할
function work(sec, callback) {
    setTimeout(() => {
        callback(new Date().toISOString());
    }, sec * 1000);
};
/*
// 1
work(1, (result) => {
    console.log('first', result);
});
work(1, (result) => {
    console.log('second', result);
});
work(1, (result) => {
    console.log('third', result);
});
// 2
work(1, (result) => {
    console.log('first', result);
    work(1, (result) => {
        console.log('second', result);
        work(1, (result) => {
            console.log('third', result);
        });
    });
});
// 3
work(1, (result) => {
    console.log('first', result);
    work(1, (result) => {
        work(1, (result) => {
            console.log('third', result);
        }); // 콜백 함수로 세 번째를 넣어줌
        console.log('second', result);
    });
});
*/

function workP(sec) {
    // Promise 인스턴스를 반환하고, then에서는 성공 시 콜백 함수 호출 
    return new Promise((resolve, reject) => {
        // Promise 생성 시 넘기는 callback
        // resolve: 동작 완료 시 호출, reject: 오류 발생 시
        setTimeout(() => {
            resolve(new Date().toISOString());
        }, sec * 1000);
    });
}

workP(1).then((result) => { // 객체 생성
    console.log('first', result);
    return workP(1);
}).then((result) => {
    console.log('second', result);
});

// Promise의 catch 사용1
/*
const flag = true; // true인 경우: orange, false인 경우 catch가 문제
const promise = new Promise((resolve, reject) => {
    if(flag === true) {
        resolve('orange');
    } else {
        reject('apple');
    }
});

promise.then((value) => {
    console.log(value);
});

promise.catch((value) => {
    console.log(value);
});
*/

// Promise의 catch 사용2
const flag = false;
const promise = new Promise((resolve, reject) => {
    if(flag === true) {
        resolve('orange');
    } else {
        reject('apple');
    }
}).then((value) => {
    console.log(value);
}).catch((value) => {
    console.log(value);
});
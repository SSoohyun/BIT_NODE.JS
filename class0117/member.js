// 사용자를 인증하는 함수
let authMember = function (database, userId, userPwd, callback) {
    console.log('authMember 호출됨 : ' + userId + ', ' + userPwd);
    
    // 1. 아이디를 사용해 검색
    database.MemberModel.findById(userId, function (err, results) {
        if (err) {
            callback(err, null);
            ruturn;
        }
        console.log('아이디[%s]로 사용자 검색 결과', userId);

        if (results.length > 0) {
            console.log('아이디와 일치하는 사용자 찾음', userId);
            // 2. 비밀번호 확인
            if (results[0]._doc.userPwd === userPwd) { // 컬렉션 안에 있는 document(row)
                console.log('비밀번호 일치함');
                callback(null, results);
            } else {
                console.log('비밀번호 일치하지 않음');
                callback(null, null);
            }
        } else {
            console.log('아이디와 일치하는 사용자 찾지 못함');
            callback(null, null);
        }
    });
} // authMember ends.

// 사용자를 추가하는 함수
let addMember = function (database, userId, userPwd, userName, age, callback) {
    console.log('addMember 호출됨: ' + userId + ', ' + userPwd + ', ' + userName + ', ' + age);

    // MemberModel 인스턴스 생성
    let user = new database.MemberModel({"userId":userId, "userPwd":userPwd, "userName":userName, "age":age});

    // save()로 저장: 저장 성공 시 addedUser 객체가 파라미터로 전달됨
    user.save(function (err, addedUser) {
        console.log("addedUser%j", addedUser);
        if (err) {
            callback(err, null);
            return;
        }
        console.log("사용자 데이터 추가함");
        callback(null, addedUser);
    });
}

// 사용자를 조회하는 함수
let listMember = function (database, callback) {
    console.log('/process/listMember 호출됨');

    // 모든 회원 조회
    database.MemberModel.findAll(function (err, results) {
        if (err) {
            callback(err, null);
            return;
        }

        if (results.length > 0) { // 결과 객체가 있으면 리스트 전송
            console.log('등록된 회원 목록 결과 : ' + results);
            callback(null, results);
        } else { // 결과 객체가 없으면 실패 응답 전송
            console.log('등록된 회원 없음');
            callback(null, null);
        }
    }); // findAll
}

// 사용자의 정보를 수정하는 함수
let updateMember = function(database, userId, userPwd, userName, age, callback) {
    console.log('/process/updateMember 호출됨');
    
    database.MemberModel.updateMany({"userId" : userId}, { $set: {"userPwd" : userPwd, "userName" : userName, "age" : age} }, function(err, result) {
        if(err) { // 오류 발생 시 콜백 함수가 호출되어 오류객체 전달 (함수를 호출한 곳으로 전달하는 것)
            callback(err, null);
            return;
        }
        if(result.modifiedCount > 0) { // update가 수행됨
            console.log("사용자 레코드 변경됨: " + result.modifiedCount);
        } else {
            console.log("변경되지 않았음");
        }
        callback(null, result);
    });   
}


// 로그인
let procLogin = function (req, res) {
    console.log('모듈 내에 있는 procLogin 호출됨');
    let database = req.app.get('database');

    // 요청 파라미터 확인
    let userId = req.body.userId || req.query.userId;
    let userPwd = req.body.userPwd || req.query.userPwd;
    console.log('요청 파라미터: ' + userId + ', ' + userPwd);

    // 데이터베이스 객체가 초기화된 경우, authMember 함수 호출하여 사용자 인증
    if(database.db) {
        authMember(database, userId, userPwd, function(err, docs) {
            if(err) {
                throw err;
            }

            // 조회된 레코드가 있으면 성공 응답 전송
            if(docs) {
                // 응답 페이지를 뷰 템플릿으로
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                let context = {userId : userId, userPwd : userPwd};
                req.app.render('loginSuccess', context, function(err, html) {
                    if(err) {
                        console.error('뷰 렌더링 중 오류 발생 : ' + err.stack);
                        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                        res.write('<h2>뷰 렌더링 중 오류 발생</h2>');
                        res.write('<p>' + err.stack + '</p>');
                        res.end();
                        return;
                    }
                    console.log('rendered : ' + html);
                    res.end(html);
                });
            } else { // 조회된 레코드가 없는 경우 실패 응답 전송
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>로그인 실패</h1>');
                res.end();
            }
        });
    } else {
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
}

// 회원 가입
let procAddMember = function (req, res) {
    console.log('모듈 내에 있는 procAddMember 호출됨');
    let database = req.app.get('database');

    // 요청 파라미터 확인
    let userId = req.body.userId || req.query.userId;
    let userPwd = req.body.userPwd || req.query.userPwd;
    let userName = req.body.userName || req.query.userName;
    let age = req.body.age || req.query.age;
    console.log('요청 파라미터: ' + userId + ', ' + userPwd + ', ' + userName + ', ' + age);

    // 데이터베이스 객체가 초기화된 경우, addMember 함수 호출하여 사용자 인증
    if(database) {
        addMember(database, userId, userPwd, userName, age, function(err, result) {
            if(err) {
                throw err;
            }
            // 추가된 데이터가 있으면 성공 응답 전송
            if(result) {
                let context = {result : result};
                req.app.render('addMember', context, function(err, html) {
                    if(err) {
                        console.error('뷰 렌더링 중 오류 발생 : ' + err.stack);
                        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                        res.write('<h2>뷰 렌더링 중 오류 발생</h2>');
                        res.write('<p>' + err.stack + '</p>');
                        res.end();
                        return;
                    }
                    console.log('rendered : ' + html);
                    res.end(html);
                })
            } else { // 결과 객체가 없으면 실패 응답 전송
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>가입 실패</h1>');
                res.end();
            }
        })
    } else { // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
}

// 회원 목록
let procListMember = function (req, res) {
    console.log('모듈 내에 있는 procListMember 호출됨');
    let database = req.app.get('database');

    // 데이터베이스 객체가 초기화된 경우, listMember 함수 호출하여 사용자 인증
    if(database) {
        // 1. 모든 사용자 검색
        listMember(database, function(err, results) {
            if(err) {
                console.error('사용자 리스트 조회 중 오류 발생 : ' + err.stack);
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 리스트 조회 중 오류 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
            }

            if(results.length > 0) { // 결과 객체가 있으면 리스트 전송
                let context = {results : results};
                req.app.render('listMember', context, function(err, html) {
                    if(err) {
                        console.error('뷰 렌더링 중 오류 발생 : ' + err.stack);
                        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                        res.write('<h2>뷰 렌더링 중 오류 발생</h2>');
                        res.write('<p>' + err.stack + '</p>');
                        res.end();
                        return;
                    }
                    console.log('rendered : ' + html);
                    res.end(html);
                })
            } else { // 결과 객체가 없으면 실패 응답 전송
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>조회에 실패했습니다.</h2>');
                res.end();
            }
        });
    } else {
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
}

// 회원 수정
let procUpdateMember = function (req, res) {
    console.log('모듈 내에 있는 procUpdateMember 호출됨');
    let database = req.app.get('database');

    // 요청 파라미터 확인
    let userId = req.body.userId || req.query.userId;
    let userPwd = req.body.userPwd || req.query.userPwd;
    let userName = req.body.userName || req.query.userName;
    let age = req.body.age || req.query.age;
    console.log('요청 파라미터: ' + userId + ', ' + userPwd + ', ' + userName + ', ' + age);

    // 데이터베이스 객체가 초기화된 경우, listMember 함수 호출하여 사용자 인증
    if(database) {
        updateMember(database, userId, userPwd, userName, age, function(err, results) {
            if(err) {
                throw err;
            }
            // 추가된 데이터가 있으면 성공 응답 전송
            if(results) {
                console.dir(results);
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>회원 정보 수정 성공</h1>');
                res.end();
            } else { // 결과 객체가 없으면 실패 응답 전송
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h1>회원 정보 수정 실패</h1>');
                res.end();
            }
        });
    } else {
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
}

module.exports.procLogin = procLogin;
module.exports.procAddMember = procAddMember;
module.exports.procListMember = procListMember;
module.exports.procUpdateMember = procUpdateMember;
// 네이버 검색 API예제는 블로그를 비롯 전문자료까지 호출방법이 동일하므로 blog검색만 대표로 예제를 올렸습니다.
// 네이버 검색 Open API 예제 - 블로그 검색
var express = require('express');
var app = express();
var request = require('request');
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');

// body-parser 설정
// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({extended:false}))
// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())

// 익스프레스에서 뷰 엔진을 ejs로 설정
app.set('/view', __dirname + '/views');
app.set('view engine', 'ejs');

app.use('/public', static(path.join(__dirname, 'public')));
app.use('/semantic', static(path.join(__dirname, 'semantic')));

// 라우팅 설정
app.post('/naver/news', (req, res) => { // get 방식 (요청, 콜백 함수)
    const search = req.body.search;

    const client_id = '8yjo7adC2IL5S_pHzfYO';
    const client_secret = 'CMqfJAN6x1';
    const api_url = 'https://openapi.naver.com/v1/search/news?query=' + encodeURI(search); // json 결과
    const option = {};
    const options = {
        url: api_url,
        qs: option,
        headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret }
    };
    request.get(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            let newsItems = JSON.parse(body).items; // items : title, link, description, pubDate
            const newsArray = []; // 배열
            for (let i = 0; i < newsItems.length; i++) {
                let newsItem = {}; // 객체
                newsItem.title = newsItems[i].title.replace(/(<([^>]+)>)|&quot;/ig, "");
                newsItem.link = newsItems[i].link.replace(/(<([^>]+)>)|&quot;/ig, "");
                newsItem.description = newsItems[i].description.replace(/(<([^>]+)>)|&quot;/ig, "");
                newsItem.pubDate = newsItems[i].pubDate.replace(/(<([^>]+)>)|&quot;/ig, "");
                newsArray.push(newsItem); // 배열에 객체 삽입
            }
            // res.json(newsArray); // 배열 그대로 출력
            
            // 뷰 템플릿 이용해서 출력
            if (newsArray.length > 0) {
                let context = { newsArray: newsArray }; // 배열로 지정
                req.app.render('newsList', context, function (err, html) {
                    if (err) {
                        console.error('뷰 렌더링 중 오류 발생 : ' + err.stack);
                        res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                        res.write('<h2>뷰 렌더링 중 오류 발생</h2>');
                        res.write('<p>' + err.stack + '</p>');
                        res.end();
                        return;
                    }
                    // console.log('rendered : ' + html);
                    res.end(html);
                });
            } else {
                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h1>회원 정보 수정 실패</h1>');
                res.end();
            }

        } else {
            res.status(response.statusCode).end();
            console.log('error = ' + response.statusCode);
        }
    });
});
app.listen(3000, function () {
    console.log('http://127.0.0.1:3000/search/blog?query=검색어 app listening on port 3000!'); // query는 필수
});
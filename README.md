# 𝐜𝐡𝐚𝐧𝐧𝐞𝐥-𝐜𝐨𝐫𝐩𝐨𝐫𝐚𝐭𝐢𝐨𝐧 𝐚𝐬𝐬𝐢𝐠𝐧𝐦𝐞𝐧𝐭

## 데모

![demo](https://user-images.githubusercontent.com/42943992/97590333-d5f91780-1a41-11eb-87b1-fa3ee5527720.gif)

## 프로토타입

![image](https://user-images.githubusercontent.com/42943992/97588417-ce387380-1a3f-11eb-8be0-a55b8d4ef24a.png)

## 구조

### .

- webpack.config.js => 웹팩 설정 디렉토리
- babel.config.js => 바벨 설정 디렉토리

### ./src

- api => api 요청하는 소스코드 모아놓은 디렉토리

- lib => 유용하게 사용할 함수 또는 변수를 모아놓은 디렉토리

- module => redux 코드가 있는 디렉토리

- styles => 스타일 시트(css, scss)가 있는 디렉토리

- component/page/main => App.js에서 바로 불러오는
  MainPage.js가 있는 디렉토리

  - ./component => MainPage.js 에서 사용하는 컴포넌트를 모아놓은 디렉토리

## 실행 방법

```
npm install
npm run start
```

- localhost:8080으로 접속

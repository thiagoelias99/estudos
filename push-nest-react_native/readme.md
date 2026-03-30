Teste simple de notificacao push para android (firebase cloud messaging).

- Criar app web e android no firebase.

## API

- Preencher FIREBASE_SERVICE_ACCOUNT_B64.
- http://localhost:3333/notifications/send | Enviar notificaçao, precisa do token do usuario no dispositivo.

## Native

- Copiar o google-services.json para a raiz, /push-app
- Configura ios.bundleIdentifier e android.package com o nome do package
- Executa npm run android
- Visulizar o token na tela e utilizar na api

- para build de producao android e teste com http inserir no manifest

<application
android:usesCleartextTraffic="true"
...

>

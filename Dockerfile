# ベースイメージとしてOpenAdoptiumのJava 17 JDKを使用
FROM eclipse-temurin:17-jdk-jammy

# ビルドツールとしてMavenをインストール
# (RenderがMavenを使っている場合、通常はRenderが提供するMavenを使うので、この部分が不要なこともある)
# 必要に応じてコメントアウトを解除またはRenderのビルドコマンドを調整
# RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリを /app に設定
WORKDIR /app

# Mavenのpom.xmlとソースコードをコンテナにコピー
# ローカルのMavenキャッシュをコンテナにコピーしてビルド時間を短縮する
COPY pom.xml .
COPY src ./src

# アプリケーションをビルド
# RenderのBuild Commandと同じ 'mvn clean package' を使用
# ただし、Docker内でビルドするため、RenderのBuild Commandは空欄にするか、単に 'echo Building with Dockerfile' などにする
RUN ./mvnw clean package -DskipTests # テストをスキップしてビルド

# ビルドされたJARファイルの名前を取得（pom.xmlから）
# (これはシェルスクリプトなのでWindowsではBashシェルを想定しています。Git Bashなどでテストしてください)
# ENV JAR_FILE $(ls target/*.jar | head -n 1) # 複数のJARがある場合を想定

# アプリケーションのJARファイルを /app にコピー
# 適切なJARファイル名に修正してください (例: genshin-viewer-0.0.1-SNAPSHOT.jar)
ARG JAR_FILE_NAME=genshin-viewer-0.0.1-SNAPSHOT.jar
COPY target/${JAR_FILE_NAME} /app/app.jar

# コンテナがリッスンするポートを定義
EXPOSE 8080

# アプリケーションの起動コマンド
# Renderは$PORT環境変数を使用するため、Dockerの起動時にそれを適用
CMD ["java", "-jar", "app.jar"]
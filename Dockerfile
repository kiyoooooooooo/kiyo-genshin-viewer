# ベースイメージとしてOpenAdoptiumのJava 17 JDKを使用
FROM eclipse-temurin:17-jdk-jammy

# 作業ディレクトリを /app に設定
WORKDIR /app

# Mavenのpom.xml、srcディレクトリ、Maven Wrapper関連のファイルをコンテナにコピー
# これらのファイルが存在することを確認してください
COPY pom.xml .
COPY src ./src
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn ./.mvn

# mvnw スクリプトに実行権限を付与
RUN chmod +x ./mvnw

# アプリケーションをビルド
# このRUNコマンドで、コンテナ内の/app/target/にJARファイルが生成される
RUN ./mvnw clean package -DskipTests

# コンテナがリッスンするポートを定義
EXPOSE 8080

# アプリケーションの起動コマンド
# ここで直接 /app/target/ に生成されたJARファイル名を指定
# JARファイル名は 'genshin-viewer-0.0.1-SNAPSHOT.jar' で確定済み
CMD ["java", "-jar", "target/genshin-viewer-0.0.1-SNAPSHOT.jar"]
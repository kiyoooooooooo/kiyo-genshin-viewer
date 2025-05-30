# ベースイメージとしてOpenAdoptiumのJava 17 JDKを使用
FROM eclipse-temurin:17-jdk-jammy

# (Mavenインストール部分は通常不要なので、このままでOK)
# RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリを /app に設定
WORKDIR /app

# Mavenのpom.xmlとソースコードをコンテナにコピー
COPY pom.xml .
COPY src ./src

# アプリケーションをビルド
# このRUNコマンドで、コンテナ内の/app/target/にJARファイルが生成される
RUN ./mvnw clean package -DskipTests

# コンテナがリッスンするポートを定義
EXPOSE 8080

# アプリケーションの起動コマンド
# ここで直接 /app/target/ に生成されたJARファイル名を指定
# JARファイル名は 'genshin-viewer-0.0.1-SNAPSHOT.jar' で確定済み
CMD ["java", "-jar", "target/genshin-viewer-0.0.1-SNAPSHOT.jar"]
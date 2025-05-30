package com.example.genshinviewer;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.slf4j.Logger; // SLF4JのLoggerをインポート
import org.slf4j.LoggerFactory; // SLF4JのLoggerFactoryをインポート

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;

@Service
public class EnkaService {

    // SLF4JのLoggerを使用
    private static final Logger logger = LoggerFactory.getLogger(EnkaService.class);
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public EnkaService() {
        this.httpClient = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_2)
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Enka.Networkからプレイヤーデータを取得し、Springのキャッシュ機能で管理します。
     * "enkaData"という名前のキャッシュにUIDをキーとしてデータが格納されます。
     * キャッシュの有効期限は application.properties で設定されます (e.g., expireAfterWrite=10m)。
     *
     * @param uid 検索するプレイヤーのUID
     * @return Enka.Networkから取得したプレイヤーデータ (Map形式)
     * @throws Exception データ取得中に発生したエラー
     */
    @Cacheable(value = "enkaData", key = "#uid")
    public Map<String, Object> getPlayerData(String uid) throws Exception {
        logger.info("Attempting to fetch data from Enka.Network for UID: " + uid + ". (Cache Miss)");

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://enka.network/api/uid/" + uid))
                // User-Agent を Kiyo System に変更
                .header("User-Agent", "KiyoSystem/1.0 (contact@example.com)") // あなたのアプリ名と連絡先を記述！
                .GET()
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            logger.info("Successfully fetched data from Enka.Network for UID: " + uid);
            Map<String, Object> enkaResponse = objectMapper.readValue(response.body(), new TypeReference<Map<String, Object>>() {});
            return enkaResponse;
        } else if (response.statusCode() == 404) {
            logger.warn("Enka.Network returned 404 (Not Found) for UID: " + uid);
            throw new HttpClientErrorException(HttpStatus.NOT_FOUND, "UID not found or profile is private on Enka.Network.");
        } else if (response.statusCode() == 429) {
            logger.warn("Enka.Network returned 429 (Too Many Requests) for UID: " + uid);
            throw new HttpClientErrorException(HttpStatus.TOO_MANY_REQUESTS, "Enka.Network API rate limit exceeded.");
        } else {
            logger.error("Enka.Network returned unexpected status " + response.statusCode() + " for UID: " + uid + ". Body: " + response.body());
            throw new RuntimeException("Error fetching data from Enka.Network: HTTP Status " + response.statusCode());
        }
    }
}
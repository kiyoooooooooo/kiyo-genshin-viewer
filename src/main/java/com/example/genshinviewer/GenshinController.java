package com.example.genshinviewer;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;
import org.springframework.http.HttpStatusCode; // ★この行を追加

@RestController
@RequestMapping("/api/enka")
public class GenshinController {

    private static final Logger logger = LoggerFactory.getLogger(GenshinController.class);

    private final EnkaService enkaService;

    public GenshinController(EnkaService enkaService) {
        this.enkaService = enkaService;
    }

    @GetMapping("/character/{uid}")
    public ResponseEntity<?> getCharacterData(@PathVariable String uid) {
        if (!uid.matches("^\\d{9,10}$")) {
            return ResponseEntity.badRequest().body("UIDは9桁または10桁の数字である必要があります。");
        }

        try {
            logger.info("UID " + uid + " のキャラクターデータを取得中...");
            Map<String, Object> characterData = enkaService.getPlayerData(uid);
            logger.info("UID " + uid + " のキャラクターデータ取得完了。");
            return ResponseEntity.ok(characterData);
        } catch (Exception e) {
            logger.error("通信エラー: UID " + uid + " のデータ取得中にエラーが発生しました。", e);
            if (e instanceof org.springframework.web.client.HttpClientErrorException) {
                HttpStatusCode status = ((org.springframework.web.client.HttpClientErrorException) e).getStatusCode(); // ★ここを修正

                if (status.value() == HttpStatus.NOT_FOUND.value()) { // ★ここを修正
                    return ResponseEntity.status(HttpStatus.NOT_FOUND.value()).body("プレイヤーが見つかりません。UIDが正しいか、プロフィールが公開されているか確認してください。");
                } else if (status.value() == HttpStatus.TOO_MANY_REQUESTS.value()) { // ★ここを修正
                    return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS.value()).body("リクエストが多すぎます。しばらく待ってから再度お試しください。");
                }
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR.value()).body("キャラクター情報の取得中にエラーが発生しました。UIDを確認し、プレイヤーが展示を公開しているかお確かめください。");
        }
    }
}
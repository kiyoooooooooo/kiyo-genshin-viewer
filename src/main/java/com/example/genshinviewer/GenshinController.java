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

@RestController
@RequestMapping("/api/genshin")
public class GenshinController {

    private static final Logger logger = LoggerFactory.getLogger(GenshinController.class);

    private final EnkaService enkaService; // EnkaServiceが同じパッケージにあるため、import不要で参照可能

    public GenshinController(EnkaService enkaService) {
        this.enkaService = enkaService;
    }

    @GetMapping("/character/{uid}")
    public ResponseEntity<?> getCharacterData(@PathVariable String uid) {
        // UIDのバリデーションを9桁または10桁に対応させる正規表現
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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("キャラクター情報の取得中にエラーが発生しました。UIDを確認し、プレイヤーが展示を公開しているかお確かめください。");
        }
    }
}
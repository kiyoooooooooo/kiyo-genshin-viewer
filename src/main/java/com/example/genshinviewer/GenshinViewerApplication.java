package com.example.genshinviewer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching; // キャッシュを有効にするアノテーション

@SpringBootApplication
@EnableCaching // Springのキャッシュ機能を有効にする
public class GenshinViewerApplication {

    public static void main(String[] args) {
        SpringApplication.run(GenshinViewerApplication.class, args);
    }

}
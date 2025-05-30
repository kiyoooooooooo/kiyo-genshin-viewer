package com.example.genshinviewer;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // アプリケーション内のすべてのパスに対してCORSを許可
                .allowedOrigins("http://localhost:8080", "http://127.0.0.1:8080") // 明示的に許可するオリジン
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 許可するHTTPメソッド
                .allowedHeaders("*") // すべてのヘッダーを許可
                .allowCredentials(true); // クレデンシャル（Cookieなど）を許可する場合
    }
}
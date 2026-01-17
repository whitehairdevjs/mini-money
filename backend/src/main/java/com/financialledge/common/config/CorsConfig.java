package com.financialledge.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // 허용할 Origin (프론트엔드 주소)
        // credentials를 true로 설정할 때는 와일드카드 사용 불가
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedOrigin("http://localhost:3001");
        
        // 허용할 HTTP 메서드
        config.addAllowedMethod("*");
        
        // 허용할 헤더
        config.addAllowedHeader("*");
        
        // 인증 정보 허용 (Authorization 헤더 사용을 위해 true로 설정)
        config.setAllowCredentials(true);
        
        // Preflight 요청 캐시 시간
        config.setMaxAge(3600L);
        
        // 모든 경로에 적용
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}

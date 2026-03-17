package com.taskmanager.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.*;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // ✅ Allow credentials (cookies, auth)
        config.setAllowCredentials(true);

        // ✅ Allow BOTH local + deployed frontend
        config.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000", // local
                "https://smart-task-manager-123.onrender.com", // render frontend
                "https://smart-task-manager-omega-eight.vercel.app/" // vercel frontend
        ));

        // ✅ Allow all headers
        config.setAllowedHeaders(Arrays.asList(
                "Origin", "Content-Type", "Accept", "Authorization"));

        // ✅ Allow all HTTP methods
        config.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        // ✅ Expose headers if needed
        config.setExposedHeaders(List.of("Authorization"));

        // ✅ Apply to ALL endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
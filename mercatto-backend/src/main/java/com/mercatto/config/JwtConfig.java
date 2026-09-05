package com.mercatto.config;

import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Configuration
public class JwtConfig {

    @Value("${jwt.secret:mercatto-super-secret-key-2024-minimum-256bits-needed-for-hs256}")
    private String secret;

    /** Duración del Access Token: 1 hora (en milisegundos) */
    @Value("${jwt.expiration:3600000}")
    private long expiration;

    /** Duración del Refresh Token: 7 días (en milisegundos) */
    @Value("${jwt.refresh-expiration:604800000}")
    private long refreshExpiration;

    @Bean
    public SecretKey jwtSecretKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public long getExpiration() {
        return expiration;
    }

    public long getRefreshExpiration() {
        return refreshExpiration;
    }
}

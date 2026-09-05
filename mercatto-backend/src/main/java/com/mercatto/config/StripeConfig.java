package com.mercatto.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StripeConfig {

    @Value("${stripe.secret-key:sk_test_TU_CLAVE_AQUI}")
    private String stripeSecretKey;

    @PostConstruct
    public void init() {
        if (stripeSecretKey != null && !stripeSecretKey.startsWith("sk_test_TU_CLAVE")) {
            Stripe.apiKey = stripeSecretKey;
        }
    }
}

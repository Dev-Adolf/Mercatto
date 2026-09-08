package com.mercatto;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class MercattoApplication {
    public static void main(String[] args) {
        SpringApplication.run(MercattoApplication.class, args);
    }
}

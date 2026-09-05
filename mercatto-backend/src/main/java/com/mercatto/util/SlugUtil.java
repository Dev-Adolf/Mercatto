package com.mercatto.util;

import java.text.Normalizer;
import java.util.Locale;
import java.util.UUID;

public final class SlugUtil {

    private SlugUtil() {}

    /**
     * Convierte un texto a slug URL-friendly.
     * Ej: "Auriculares Bluetooth 5.3 Pro" → "auriculares-bluetooth-5-3-pro"
     */
    public static String generar(String texto) {
        if (texto == null || texto.isBlank()) {
            return UUID.randomUUID().toString().substring(0, 8);
        }

        return Normalizer
                .normalize(texto, Normalizer.Form.NFD)
                .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "") // quitar tildes
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9\\s-]", "")   // solo letras, números, espacios y guiones
                .trim()
                .replaceAll("[\\s-]+", "-");        // espacios → guión
    }

    /**
     * Genera un slug único añadiendo un sufijo corto UUID al final.
     * Útil para evitar colisiones entre productos con nombres similares.
     */
    public static String generarUnico(String texto) {
        String base = generar(texto);
        String sufijo = UUID.randomUUID().toString().substring(0, 6);
        return base + "-" + sufijo;
    }
}

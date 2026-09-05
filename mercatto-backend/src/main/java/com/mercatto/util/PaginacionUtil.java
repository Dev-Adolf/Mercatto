package com.mercatto.util;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public final class PaginacionUtil {

    private static final int MAX_SIZE = 50;

    private PaginacionUtil() {}

    /**
     * Crea un Pageable validando que el tamaño no exceda el máximo permitido.
     */
    public static Pageable crear(int pagina, int tamano) {
        tamano = Math.min(Math.max(tamano, 1), MAX_SIZE);
        pagina = Math.max(pagina, 0);
        return PageRequest.of(pagina, tamano);
    }

    /**
     * Crea un Pageable con ordenamiento.
     *
     * @param campo     Campo JPA por el que ordenar (ej: "fechaCreacion")
     * @param direccion "asc" o "desc"
     */
    public static Pageable crear(int pagina, int tamano, String campo, String direccion) {
        tamano = Math.min(Math.max(tamano, 1), MAX_SIZE);
        pagina = Math.max(pagina, 0);

        Sort sort = "asc".equalsIgnoreCase(direccion)
                ? Sort.by(campo).ascending()
                : Sort.by(campo).descending();

        return PageRequest.of(pagina, tamano, sort);
    }

    /**
     * Convierte un parámetro de orden del frontend al campo JPA correspondiente.
     *
     * @param orden "recientes" | "precio_asc" | "precio_desc" | "calificacion" | "mas_vendidos"
     * @return campo y dirección como arreglo [campo, direccion]
     */
    public static String[] resolverOrden(String orden) {
        if (orden == null) return new String[]{"fechaCreacion", "desc"};

        return switch (orden.toLowerCase()) {
            case "precio_asc"   -> new String[]{"precio", "asc"};
            case "precio_desc"  -> new String[]{"precio", "desc"};
            case "calificacion" -> new String[]{"calificacion", "desc"};
            case "mas_vendidos" -> new String[]{"totalVentas", "desc"};
            default             -> new String[]{"fechaCreacion", "desc"};
        };
    }
}

package com.mercatto.dto.request;

public class GoogleAuthRequest {

    // ID Token (JWT) entregado por Google Identity Services en el frontend
    private String credential;

    public String getCredential() { return credential; }
    public void setCredential(String credential) { this.credential = credential; }
}

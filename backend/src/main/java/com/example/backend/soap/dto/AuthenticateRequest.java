package com.example.backend.soap.dto;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.Data;

@Data
@XmlAccessorType(XmlAccessType.FIELD)
@XmlRootElement(name = "authenticateRequest", namespace = "http://backend.example.com/soap/users")
public class AuthenticateRequest {

    private String login;
    private String password;
}

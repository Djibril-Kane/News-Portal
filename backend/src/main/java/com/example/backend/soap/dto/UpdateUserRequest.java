package com.example.backend.soap.dto;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.Data;

@Data
@XmlAccessorType(XmlAccessType.FIELD)
@XmlRootElement(name = "updateUserRequest", namespace = "http://backend.example.com/soap/users")
public class UpdateUserRequest {

    private String jeton;
    private long id;
    private String nom;
    private String prenom;
    private String email;
    private String role;
}

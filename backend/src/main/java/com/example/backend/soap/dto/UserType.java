package com.example.backend.soap.dto;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlType;
import lombok.Data;

@Data
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "user", namespace = "http://backend.example.com/soap/users")
public class UserType {

    private long id;
    private String nom;
    private String prenom;
    private String email;
    private String role;
}

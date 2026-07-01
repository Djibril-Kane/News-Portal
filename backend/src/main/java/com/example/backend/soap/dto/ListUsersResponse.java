package com.example.backend.soap.dto;

import java.util.ArrayList;
import java.util.List;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.Data;

@Data
@XmlAccessorType(XmlAccessType.FIELD)
@XmlRootElement(name = "listUsersResponse", namespace = "http://backend.example.com/soap/users")
public class ListUsersResponse {

    @XmlElement(name = "user")
    private List<UserType> users = new ArrayList<>();
}

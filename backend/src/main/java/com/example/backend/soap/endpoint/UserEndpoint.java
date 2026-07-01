package com.example.backend.soap.endpoint;

import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import com.example.backend.soap.dto.AddUserRequest;
import com.example.backend.soap.dto.AddUserResponse;
import com.example.backend.soap.dto.AuthenticateRequest;
import com.example.backend.soap.dto.AuthenticateResponse;
import com.example.backend.soap.dto.DeleteUserRequest;
import com.example.backend.soap.dto.DeleteUserResponse;
import com.example.backend.soap.dto.ListUsersRequest;
import com.example.backend.soap.dto.ListUsersResponse;
import com.example.backend.soap.dto.UpdateUserRequest;
import com.example.backend.soap.dto.UpdateUserResponse;
import com.example.backend.soap.service.SoapUserService;

import lombok.RequiredArgsConstructor;

@Endpoint
@RequiredArgsConstructor
public class UserEndpoint {

    private static final String NAMESPACE_URI = "http://backend.example.com/soap/users";

    private final SoapUserService soapUserService;

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "authenticateRequest")
    @ResponsePayload
    public AuthenticateResponse authenticate(@RequestPayload AuthenticateRequest request) {
        return soapUserService.authenticate(request);
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "listUsersRequest")
    @ResponsePayload
    public ListUsersResponse listUsers(@RequestPayload ListUsersRequest request) {
        return soapUserService.listUsers(request);
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "addUserRequest")
    @ResponsePayload
    public AddUserResponse addUser(@RequestPayload AddUserRequest request) {
        return soapUserService.addUser(request);
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "updateUserRequest")
    @ResponsePayload
    public UpdateUserResponse updateUser(@RequestPayload UpdateUserRequest request) {
        return soapUserService.updateUser(request);
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "deleteUserRequest")
    @ResponsePayload
    public DeleteUserResponse deleteUser(@RequestPayload DeleteUserRequest request) {
        return soapUserService.deleteUser(request);
    }
}

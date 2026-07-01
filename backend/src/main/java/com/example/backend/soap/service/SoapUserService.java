package com.example.backend.soap.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.backend.auth.entity.User;
import com.example.backend.auth.repository.UserRepository;
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
import com.example.backend.soap.dto.UserType;
import com.example.backend.soap.exception.InvalidTokenException;
import com.example.backend.user.dto.CreateUserRequest;
import com.example.backend.user.dto.UserResponse;
import com.example.backend.user.service.ServiceTokenService;
import com.example.backend.user.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SoapUserService {

    private static final String STATUS_SUCCES = "SUCCES";
    private static final String STATUS_ECHEC = "ECHEC";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final ServiceTokenService serviceTokenService;

    public AuthenticateResponse authenticate(AuthenticateRequest request) {
        AuthenticateResponse response = new AuthenticateResponse();

        User user = userRepository.findByEmail(request.getLogin()).orElse(null);
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            response.setStatus(STATUS_ECHEC);
            return response;
        }

        response.setStatus(STATUS_SUCCES);
        response.setRole(user.getRole().name());
        return response;
    }

    public ListUsersResponse listUsers(ListUsersRequest request) {
        checkToken(request.getJeton());

        ListUsersResponse response = new ListUsersResponse();
        userService.getAll().forEach(user -> response.getUsers().add(toUserType(user)));
        return response;
    }

    public AddUserResponse addUser(AddUserRequest request) {
        checkToken(request.getJeton());

        CreateUserRequest createUserRequest = new CreateUserRequest();
        createUserRequest.setNom(request.getNom());
        createUserRequest.setPrenom(request.getPrenom());
        createUserRequest.setEmail(request.getEmail());
        createUserRequest.setPassword(request.getPassword());
        createUserRequest.setRole(User.Role.valueOf(request.getRole()));

        UserResponse created = userService.create(createUserRequest);

        AddUserResponse response = new AddUserResponse();
        response.setUser(toUserType(created));
        return response;
    }

    public UpdateUserResponse updateUser(UpdateUserRequest request) {
        checkToken(request.getJeton());

        com.example.backend.user.dto.UpdateUserRequest updateUserRequest =
                new com.example.backend.user.dto.UpdateUserRequest();
        updateUserRequest.setNom(request.getNom());
        updateUserRequest.setPrenom(request.getPrenom());
        updateUserRequest.setEmail(request.getEmail());
        updateUserRequest.setRole(User.Role.valueOf(request.getRole()));

        UserResponse updated = userService.update(request.getId(), updateUserRequest);

        UpdateUserResponse response = new UpdateUserResponse();
        response.setUser(toUserType(updated));
        return response;
    }

    public DeleteUserResponse deleteUser(DeleteUserRequest request) {
        checkToken(request.getJeton());

        userService.delete(request.getId());

        DeleteUserResponse response = new DeleteUserResponse();
        response.setSuccess(true);
        return response;
    }

    private void checkToken(String jeton) {
        if (jeton == null || !serviceTokenService.isValid(jeton)) {
            throw new InvalidTokenException("Jeton d'authentification invalide ou revoque");
        }
    }

    private UserType toUserType(UserResponse response) {
        UserType userType = new UserType();
        userType.setId(response.getId());
        userType.setNom(response.getNom());
        userType.setPrenom(response.getPrenom());
        userType.setEmail(response.getEmail());
        userType.setRole(response.getRole().name());
        return userType;
    }
}

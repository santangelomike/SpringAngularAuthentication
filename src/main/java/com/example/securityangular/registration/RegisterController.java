package com.example.securityangular.registration;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.mediatype.problem.Problem;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/*
 * Rest Controller exposing an endpoint for user registration.
 * @author Santangelo Mike
 */
@RestController
public class RegisterController {

    private final UserDetailsModelAssembler userDetailsModelAssembler;
    private final PasswordEncoder passwordEncoder;
    private final UserDetailsManager userDetailsManager;

    RegisterController(UserDetailsModelAssembler userDetailsModelAssembler, PasswordEncoder passwordEncoder, UserDetailsManager userDetailsManager) {
        this.userDetailsModelAssembler = userDetailsModelAssembler;
        this.userDetailsManager = userDetailsManager;
        this.passwordEncoder = passwordEncoder;
    }

    /*
     * POST mapping endpoint. Tries to register a new user.
     * @param credentials the username and password chosen for the new user.
     * @return ResponseEntity with status 201 if user is successfully created, 409 otherwise.
     */
    @PostMapping("/api/users")
	public ResponseEntity<?> register(@RequestBody Credentials credentials) {
        if (userDetailsManager.userExists(credentials.getUsername())) {
            return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(Problem.create().withTitle("Username taken.").withDetail(credentials.getUsername() + " is already taken."));
        }

        UserDetails user = User.builder()
            .username(credentials.getUsername())
            .password(passwordEncoder.encode(credentials.getPassword()))
            .roles("USER")
            .build();

        userDetailsManager.createUser(user);

        EntityModel<UserDetails> entityModel = userDetailsModelAssembler.toModel(user);

        return ResponseEntity //
            .status(HttpStatus.CREATED) //
            .body(entityModel);
	}

}

package com.example.securityangular.authentication;

import java.security.Principal;

import org.springframework.hateoas.EntityModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/*
 * Rest Controller responsible for user authentication.
 * @author Santangelo Mike
 */
@RestController
public class AuthenticationController {

    private final PrincipalModelAssembler principalModelAssembler;

    AuthenticationController(PrincipalModelAssembler principalModelAssembler) {
        this.principalModelAssembler = principalModelAssembler;
    }

    /*
     * API endpoint that returns the currently logged in user.
     * @param user the currently logged in user
     */
    @GetMapping("/api/current-user")
	public EntityModel<Principal> currentUser(Principal user) {
		return principalModelAssembler.toModel(user);
	}

}

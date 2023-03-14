package com.example.securityangular.authentication;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import java.security.Principal;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

/*
 * Class responsible for representing {@link java.security.Principal} instances in HAL format
 */
@Component
public class PrincipalModelAssembler implements RepresentationModelAssembler<Principal, EntityModel<Principal>> {

  @Override
  public EntityModel<Principal> toModel(Principal user) {

    return EntityModel.of(user, //
        linkTo(methodOn(AuthenticationController.class).currentUser(user)).withSelfRel());
  }
}
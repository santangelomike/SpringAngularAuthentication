package com.example.securityangular.registration;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

/*
 * Class responsible for representing {@link org.springframework.security.core.userdetails.UserDetails} instances in HAL format
 */
@Component
public class UserDetailsModelAssembler implements RepresentationModelAssembler<UserDetails, EntityModel<UserDetails>> {

  @Override
  public EntityModel<UserDetails> toModel(UserDetails user) {
    return EntityModel.of(user);
  }
}
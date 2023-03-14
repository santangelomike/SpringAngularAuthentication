package com.example.securityangular.authentication.schema;

import java.io.Serializable;

import jakarta.annotation.Nonnull;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

/**
* JPA Entity to initialize SQL schema for Spring authentication based on username/password. See <a href="https://docs.spring.io/spring-security/reference/servlet/appendix/database-schema.html#_user_schema">the official documentation</a> for more details.
* @author Santangelo Mike
*/
@Embeddable
public class AuthorityId implements Serializable {
    @ManyToOne
    @JoinColumn(name="username")
    private User user;

    @Nonnull
    @Column(length = 50, name = "authority")
    private String authority;
}

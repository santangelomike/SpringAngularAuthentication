package com.example.securityangular.authentication.schema;

import java.util.Set;

import jakarta.annotation.Nonnull;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

/**
* JPA Entity to initialize SQL schema for Spring authentication based on username/password. See <a href="https://docs.spring.io/spring-security/reference/servlet/appendix/database-schema.html#_user_schema">the official documentation</a> for more details.
* @author Santangelo Mike
*/
@Entity
@Table(name = "users")
public class User {
    @Id
    @Nonnull
    @Column(length = 50)
    private String username;
    
    @Nonnull
    @Column(length = 500)
    private String password;

    @Nonnull
    private boolean enabled;
    
    @OneToMany(mappedBy = "authorityId.user", cascade = CascadeType.ALL)
    private Set<Authority> authorities;
}

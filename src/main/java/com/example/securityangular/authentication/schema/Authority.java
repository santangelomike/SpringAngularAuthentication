package com.example.securityangular.authentication.schema;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

/**
* JPA Entity to initialize SQL schema for Spring authentication based on username/password. See <a href="https://docs.spring.io/spring-security/reference/servlet/appendix/database-schema.html#_user_schema">the official documentation</a> for more details.
* @author Santangelo Mike
* 
*/
@Entity
@Table(name = "authorities", uniqueConstraints = @UniqueConstraint(columnNames = { "username", "authority" }))
public class Authority {
    @EmbeddedId
    private AuthorityId authorityId;
}
package com.example.securityangular.authentication.schema;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.test.jdbc.JdbcTestUtils;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class SchemaTest {
    @Autowired
	private JdbcUserDetailsManager jdbcUserDetailsManager;

    /*
     * Tests that when a user is deleted, all of its authorities are deleted as well
     * This test uses an in-memory database (H2)
     */
    @Test
	public void testSchema() throws Exception {
        JdbcTemplate jdbcTemplate = jdbcUserDetailsManager.getJdbcTemplate();

		int n1 = JdbcTestUtils.countRowsInTable(jdbcTemplate, "authorities");

        String username = "test_schema";

        UserDetails user = User.builder()
            .username(username)
            .password("test")
            .roles("USER", "ADMIN")
            .build();

        jdbcUserDetailsManager.createUser(user);
        jdbcUserDetailsManager.deleteUser(username);

        assertThat(n1).isEqualTo(JdbcTestUtils.countRowsInTable(jdbcTemplate, "authorities"));
	}
}

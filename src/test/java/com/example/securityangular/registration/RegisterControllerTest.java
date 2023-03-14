package com.example.securityangular.registration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
public class RegisterControllerTest {
    @Autowired
	private MockMvc mockMvc;

	/*
	 * Tests that register endpoint returns status code 201 if user is successfully created or 409 if username is already registered
	 * This test uses an in-memory database (H2)
	 */
    @Test
	public void testRegister() throws Exception {
		Credentials credentials = new Credentials("test_register", "test");
		String credentialsAsJson = new ObjectMapper().writeValueAsString(credentials);
		this.mockMvc.perform(post("/api/users").contentType(MediaType.APPLICATION_JSON).content(credentialsAsJson)).andDo(print()).andExpect(status().isCreated());
		this.mockMvc.perform(post("/api/users").contentType(MediaType.APPLICATION_JSON).content(credentialsAsJson)).andDo(print()).andExpect(status().isConflict());
	}
}

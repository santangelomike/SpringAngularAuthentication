package com.example.securityangular;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestHandler;
import org.springframework.security.web.csrf.XorCsrfTokenRequestAttributeHandler;
import org.springframework.security.web.util.matcher.RegexRequestMatcher;

/*
 * Custom {@link org.springframework.security.web.SecurityFilterChain} configurer. Form login and CSRF token are enabled.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.formLogin();

		http.authorizeHttpRequests()
				.requestMatchers(HttpMethod.POST, "/api/users").permitAll()
				.requestMatchers(HttpMethod.GET, "/", "/login", "/error").permitAll()
				.requestMatchers(new RegexRequestMatcher("/\\S+\\.(js|html|css|ico)", "GET")).permitAll()
				.requestMatchers("/api/current-user", "/logout").hasRole("USER")
				.anyRequest().denyAll();

		CookieCsrfTokenRepository tokenRepository = CookieCsrfTokenRepository.withHttpOnlyFalse();
		XorCsrfTokenRequestAttributeHandler delegate = new XorCsrfTokenRequestAttributeHandler();
		CsrfTokenRequestHandler requestHandler = delegate::handle;
		http.csrf((csrf) -> csrf
			.csrfTokenRepository(tokenRepository)
			.csrfTokenRequestHandler(requestHandler));

		return http.build();
	}
}
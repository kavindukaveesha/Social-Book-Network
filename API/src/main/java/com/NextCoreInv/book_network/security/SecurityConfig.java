// SecurityConfig.java
package com.NextCoreInv.book_network.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Primary security configuration class that defines the security rules
 * and configurations for the application.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfig {

    // Required dependencies injected through constructor
    private final JwtFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    /**
     * Configures the main security filter chain for the application.
     * This defines security rules, CORS, CSRF, session management,
     * and authentication requirements.
     *
     * @param http HttpSecurity instance to be configured
     * @return Configured SecurityFilterChain
     * @throws Exception if configuration fails
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Use default CORS configuration from corsFilter bean
                .cors(Customizer.withDefaults())

                // Disable CSRF as we're using JWT
                .csrf(AbstractHttpConfigurer::disable)

                // Configure authorization rules
                .authorizeHttpRequests(req -> req
                        // Public endpoints that don't require authentication
                        .requestMatchers(
                                "/auth/**",                // Authentication endpoints
                                "/v2/api-docs",            // Swagger v2
                                "/v3/api-docs",            // Swagger v3
                                "/v3/api-docs/**",         // Swagger v3 extensions
                                "/swagger-resources",      // Swagger resources
                                "/swagger-resources/**",   // Swagger resource extensions
                                "/configuration/ui",       // Swagger UI config
                                "/configuration/security", // Swagger security config
                                "/swagger-ui/**",          // Swagger UI
                                "/webjars/**",            // Web JARs
                                "/swagger-ui.html",        // Swagger UI HTML
                                "/error"                   // Error handling
                        ).permitAll()
                        // All other requests need authentication
                        .anyRequest().authenticated()
                )

                // Configure session management as stateless
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Set authentication provider
                .authenticationProvider(authenticationProvider)

                // Add JWT filter before username/password authentication
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}


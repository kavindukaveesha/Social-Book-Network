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
 * Security configuration class for Spring Security setup.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfig {

    private final JwtFilter jwtAuthFilter; // JWT filter for token-based authentication
    private final AuthenticationProvider authenticationProvider; // Custom authentication provider

    /**
     * Configures the SecurityFilterChain, defining authentication and authorization settings.
     *
     * @param http The HttpSecurity object for configuration.
     * @return The configured SecurityFilterChain bean.
     * @throws Exception if an error occurs during configuration.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Cross-Origin Resource Sharing (CORS) configuration
                .cors(Customizer.withDefaults())
                // Disables CSRF (not required for stateless APIs)
                .csrf(AbstractHttpConfigurer::disable)
                // Configures request authorization rules
                .authorizeHttpRequests(req -> req
                        // Permit all requests to specific public endpoints
                        .requestMatchers(
                                "/auth/**",                // Authentication endpoints
                                "/v2/api-docs",            // Swagger v2 documentation
                                "/v3/api-docs",            // Swagger v3 documentation
                                "/v3/api-docs/**",         // Swagger v3 extended paths
                                "/swagger-resources",      // Swagger resources
                                "/swagger-resources/**",   // Swagger resource extensions
                                "/configuration/ui",       // Swagger UI configuration
                                "/configuration/security", // Swagger security configuration
                                "/swagger-ui/**",          // Swagger UI files
                                "/webjars/**",             // Webjars (e.g., static assets)
                                "/swagger-ui.html"         // Swagger UI main HTML
                        ).permitAll() // Allow unauthenticated access
                        .anyRequest().authenticated() // All other requests require authentication
                )
                // Configures session management as stateless (no server-side sessions)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Sets the custom authentication provider
                .authenticationProvider(authenticationProvider)
                // Adds the JWT filter before the UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build(); // Builds and returns the configured SecurityFilterChain
    }
}

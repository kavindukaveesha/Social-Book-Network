package com.NextCoreInv.book_network.security;

import jakarta.annotation.Nonnull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Custom JWT filter for processing incoming requests and extracting JWT tokens.
 * It ensures that valid tokens are processed and users are authenticated into the security context.
 */
@Service
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    /**
     * Core method that intercepts each HTTP request and applies filtering logic.
     *
     * @param request     HTTP servlet request object.
     * @param response    HTTP servlet response object.
     * @param filterChain The filter chain to pass the request/response further.
     * @throws ServletException in case of servlet-specific errors.
     * @throws IOException      in case of I/O errors during filtering.
     */
    @Override
    protected void doFilterInternal(
            @Nonnull HttpServletRequest request,
            @Nonnull HttpServletResponse response,
            @Nonnull FilterChain filterChain
    ) throws ServletException, IOException {
        // Skip authentication checks for the authentication endpoints
        if (request.getServletPath().contains("/api/v1/auth")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extract the Authorization header
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // If the header is missing or doesn't start with "Bearer ", skip this filter
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extract the JWT token from the header
        jwt = authHeader.substring(7);

        // Extract the username (or email) from the token
        userEmail = jwtService.extractUsername(jwt);

        // If a username is present and the user is not yet authenticated
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Load user details from the UserDetailsService
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // Validate the token against the user details
            if (jwtService.isTokenValid(jwt, userDetails)) {
                // Create an authentication token to set in the security context
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null, // No credentials are required since it's token-based authentication
                        userDetails.getAuthorities()
                );

                // Add additional request details to the authentication object
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // Set the authentication token in the security context
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // Continue with the next filter in the chain
        filterChain.doFilter(request, response);
    }
}

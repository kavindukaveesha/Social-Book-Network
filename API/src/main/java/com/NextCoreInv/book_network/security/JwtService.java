package com.NextCoreInv.book_network.security;

import com.NextCoreInv.book_network.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Service class for generating, validating, and extracting data from JWT tokens.
 */
public class JwtService {

    // JWT expiration time (in milliseconds), injected from application properties
    @Value("${spring.application.security.jwt.expiration}")
    private long jwtExpiration;

    // Secret key for signing the JWT, injected from application properties
    @Value("${spring.application.security.jwt.secret-key}")
    private String secretKey;

    /**
     * Extracts the username (subject) from the JWT token.
     *
     * @param token The JWT token.
     * @return The username (subject) embedded in the token.
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extracts a specific claim from the JWT token.
     *
     * @param token          The JWT token.
     * @param claimsResolver Function to resolve the desired claim.
     * @param <T>            The type of the claim to extract.
     * @return The resolved claim value.
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extracts all claims from the JWT token.
     *
     * @param token The JWT token.
     * @return The claims extracted from the token.
     */
    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey()) // Use the signing key to validate the token
                .build()
                .parseClaimsJws(token) // Parse the token
                .getBody();
    }

    /**
     * Generates a JWT token for a user with default claims.
     *
     * @param userDetails The user details for whom the token is generated.
     * @return The generated JWT token.
     */
    public String generateJwtToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    /**
     * Generates a JWT token with additional claims.
     *
     * @param claims      Additional claims to include in the token.
     * @param userDetails The user details for whom the token is generated.
     * @return The generated JWT token.
     */
    private String generateToken(Map<String, Object> claims, UserDetails userDetails) {
        return buildToken(claims, userDetails, jwtExpiration);
    }

    /**
     * Builds the JWT token with specified claims, expiration time, and signing key.
     *
     * @param extraClaims  Extra claims to include in the token payload.
     * @param userDetails  The user details for whom the token is being created.
     * @param jwtExpiration The expiration time for the token in milliseconds.
     * @return The signed JWT token as a string.
     */
    private String buildToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails,
            long jwtExpiration) {

        // Map the user's authorities to a list of strings
        var authorities = userDetails.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        return Jwts
                .builder()
                .setClaims(extraClaims) // Set additional claims
                .setSubject(userDetails.getUsername()) // Set the username as the subject
                .setIssuedAt(new Date(System.currentTimeMillis())) // Token issue time
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration)) // Token expiration time
                .claim("authorities", authorities) // Embed user authorities
                .signWith(getSignInKey()) // Sign the token with the signing key
                .compact();
    }

    /**
     * Retrieves the signing key for JWT validation.
     *
     * @return The signing key.
     */
    private Key getSignInKey() {
        // Decode the secret key from Base64 and create a signing key
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Validates the token against user details.
     *
     * @param token       The JWT token.
     * @param userDetails The user details to validate against.
     * @return True if the token is valid, false otherwise.
     */
    public boolean isTokenValued(String token, UserDetails userDetails) {
        final String username = extractUsername(token); // Extract username from token
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token); // Check username and expiration
    }

    /**
     * Checks if the token is expired.
     *
     * @param token The JWT token.
     * @return True if the token is expired, false otherwise.
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Extracts the expiration date of the token.
     *
     * @param token The JWT token.
     * @return The expiration date of the token.
     */
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}

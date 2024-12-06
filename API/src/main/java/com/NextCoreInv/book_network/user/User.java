package com.NextCoreInv.book_network.user;

import com.NextCoreInv.book_network.role.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Entity representing the user in the system.
 * Implements UserDetails for Spring Security and Principal for general identity representation.
 */
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "_user") // Table name
public class User implements UserDetails, Principal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Use IDENTITY for auto-increment primary keys
    private Integer id;

    private String firstname;

    private String lastname;

    private LocalDate dateOfBirth;

    @Column(unique = true, nullable = false) // Email must be unique and not null
    private String email;

    @JsonIgnore // Prevent password from being serialized
    private String password;

    private boolean accountLocked;

    private boolean enabled;

    @ManyToMany(fetch = FetchType.EAGER) // Eager loading for roles
//    @JoinTable(
//            name = "user_roles", // Join table for User and Role entities
//            joinColumns = @JoinColumn(name = "user_id"),
//            inverseJoinColumns = @JoinColumn(name = "role_id")
//    )
    @JsonIgnore // Prevent roles from being serialized directly
    private List<Role> roles;

    @CreatedDate
    @Column(nullable = false, updatable = false) // Automatically generated creation date
    private LocalDateTime createdDate;

    @LastModifiedDate
    @Column(insertable = false) // Automatically updated modification date
    private LocalDateTime updatedDate;

    /**
     * Returns the full name of the user.
     *
     * @return Full name as "firstname lastname".
     */
    public String getFullName() {
        return firstname + " " + lastname;
    }

    /**
     * Returns the email as the principal name.
     *
     * @return Email address.
     */
    @Override
    public String getName() {
        return email;
    }

    /**
     * Returns the roles of the user as a collection of granted authorities.
     *
     * @return Collection of GrantedAuthority objects.
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getName())) // Convert roles to GrantedAuthority
                .collect(Collectors.toList());
    }

    /**
     * Returns the password for authentication.
     *
     * @return Password.
     */
    @Override
    public String getPassword() {
        return password;
    }

    /**
     * Returns the username for authentication.
     *
     * @return Email as the username.
     */
    @Override
    public String getUsername() {
        return email;
    }

    /**
     * Indicates whether the user's account is expired.
     *
     * @return True since the account does not expire by default.
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * Indicates whether the user's account is locked.
     *
     * @return True if the account is not locked.
     */
    @Override
    public boolean isAccountNonLocked() {
        return !accountLocked;
    }

    /**
     * Indicates whether the user's credentials are expired.
     *
     * @return True since credentials do not expire by default.
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * Indicates whether the user's account is enabled.
     *
     * @return True if the account is enabled.
     */
    @Override
    public boolean isEnabled() {
        return enabled;
    }
}

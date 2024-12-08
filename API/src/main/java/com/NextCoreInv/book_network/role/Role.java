package com.NextCoreInv.book_network.role;

import com.NextCoreInv.book_network.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate; // Fixing incorrect annotation
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "role")
@EntityListeners(AuditingEntityListener.class)
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Specify ID generation strategy
    private Integer id;

    @Column(unique = true, nullable = false) // Role name should be unique and not null
    private String name;

    @ManyToMany(mappedBy = "roles") // Mapped by the "roles" field in User class
    private List<User> users;

    @CreatedDate
    @Column(nullable = false, updatable = false) // Automatically populate createdDate
    private LocalDateTime createdDate;

    @LastModifiedDate
    @Column(insertable = false) // Automatically update modifiedDate
    private LocalDateTime updatedDate;
}

package com.NextCoreInv.book_network.history;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable; // <-- Import the correct Pageable!
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

/**
 * Repository for handling BookTransactionHistory entities:
 * - Checking if a book is already borrowed
 * - Retrieving borrowed/returned books with pagination
 * - Looking up transaction details for approvals & returns
 */
public interface BookTransactionHistoryRepository extends JpaRepository<BookTransactionHistory, Integer> {

    /**
     * Checks if a given user (by string ID/username)
     * has already borrowed a specific book and not yet fully returned/approved.
     */
    @Query("""
            SELECT (COUNT(*) > 0)
            FROM BookTransactionHistory bth
            WHERE bth.user.id = :userId
              AND bth.book.id = :bookId
              AND bth.returnApproved = false
            """)
    boolean isAlreadyBorrowedByUser(@Param("bookId") Integer bookId,
                                    @Param("userId") String userId);

    /**
     * Checks if a given book is already borrowed by anyone
     * who hasn't had their return approved yet.
     */
    @Query("""
            SELECT (COUNT(*) > 0)
            FROM BookTransactionHistory bth
            WHERE bth.book.id = :bookId
              AND bth.returnApproved = false
            """)
    boolean isAlreadyBorrowed(@Param("bookId") Integer bookId);

    /**
     * Retrieves a paginated list of all borrowed books by a specific user.
     */
    @Query("""
            SELECT history
            FROM BookTransactionHistory history
            WHERE history.user.id = :userId
            """)
    Page<BookTransactionHistory> findAllBorrowedBooks(Pageable pageable,
                                                      @Param("userId") Integer userId);

    /**
     * Retrieves a paginated list of all returned books
     * where the 'createdBy' field on the Book entity matches a given ID or username.
     *
     * Note: If 'createdBy' is actually an integer user ID, adjust the parameter/field type.
     * If it's a username (string), then adjust accordingly as well.
     */
    @Query("""
            SELECT history
            FROM BookTransactionHistory history
            WHERE history.book.createdBy = :userId
            """)
    Page<BookTransactionHistory> findAllReturnedBooks(Pageable pageable,
                                                      @Param("userId") Integer userId);

    /**
     * Finds a transaction record for a user who has borrowed a specific book
     * but has not returned/approved it yet.
     */
    @Query("""
            SELECT transaction
            FROM BookTransactionHistory transaction
            WHERE transaction.user.id = :userId
              AND transaction.book.id = :bookId
              AND transaction.returned = false
              AND transaction.returnApproved = false
            """)
    Optional<BookTransactionHistory> findByBookIDAndUserId(@Param("bookId") Integer bookId,
                                                           @Param("userId") Integer userId);

    /**
     * Finds a transaction record for an owner (user) whose book has been returned
     * (marked as 'returned') but is still awaiting the owner's approval.
     */
    @Query("""
            SELECT transaction
            FROM BookTransactionHistory transaction
            WHERE transaction.book.owner.id = :userId
              AND transaction.book.id = :bookId
              AND transaction.returned = true
              AND transaction.returnApproved = false
            """)
    Optional<BookTransactionHistory> findByBookIDAndOwnerId(@Param("bookId") Integer bookId,
                                                            @Param("userId") Integer userId);

}

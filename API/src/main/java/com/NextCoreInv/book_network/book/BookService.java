package com.NextCoreInv.book_network.book;

import com.NextCoreInv.book_network.Exception.OperationNotPermittedExeption;
import com.NextCoreInv.book_network.common.PageResponse;
import com.NextCoreInv.book_network.file.FileStorageService;
import com.NextCoreInv.book_network.history.BookTransactionHistory;
import com.NextCoreInv.book_network.history.BookTransactionHistoryRepository;
import com.NextCoreInv.book_network.user.User;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Objects;

import static com.NextCoreInv.book_network.book.BookSpecification.withOwnerId;

/**
 * Service class responsible for managing book-related operations:
 * - Creating/updating books
 * - Retrieving books with pagination
 * - Managing book sharing/borrowing functionality
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class BookService {

    // Repositories & Utilities
    private final BookRepository bookRepository;
    private final BookTransactionHistoryRepository bookTransactionHistoryRepository;
    private final FileStorageService fileStorageService;
    private final BookMapper bookMapper;

    /**
     * Saves a new Book entity to the database.
     *
     * @param request         DTO carrying book info from client.
     * @param connectedUser   Currently authenticated user (owner).
     * @return The generated ID of the newly created Book.
     */
    public Integer save(BookRequest request, Authentication connectedUser) {
        // Cast the current principal to our User entity.
        User user = (User) connectedUser.getPrincipal();
        // Convert the request DTO to an actual Book entity using our mapper.
        Book book = bookMapper.toBook(request);
        // Set the owner of this book to the current user.
        book.setOwner(user);
        // Save to the DB and return the new Book's ID.
        return bookRepository.save(book).getId();
    }

    /**
     * Finds a Book by ID and returns its response DTO.
     *
     * @param bookId The target Book's ID.
     * @return BookResponse containing the book's details.
     */
    public BookResponse findById(Integer bookId) {
        return bookRepository.findById(bookId)
                .map(bookMapper::toBookResponse)
                .orElseThrow(() -> new EntityNotFoundException("No book found with this ID:: " + bookId));
    }

    /**
     * Retrieves a paginated list of all displayable books (not archived, shareable, etc.)
     * for the current user. The query uses the BookRepository's custom method.
     *
     * @param page           The current page number.
     * @param size           Number of items per page.
     * @param connectedUser  Currently authenticated user.
     * @return A PageResponse containing a list of BookResponse objects.
     */
    public PageResponse<BookResponse> findAllBooks(int page, int size, Authentication connectedUser) {
        User user = (User) connectedUser.getPrincipal();

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());
        // Custom repo method to fetch displayable books for a given user.
        Page<Book> books = bookRepository.findAllDisplayableBooks(pageable,user.getId());

        // Map Book entities to DTO responses.
        List<BookResponse> bookResponses = books.stream()
                .map(bookMapper::toBookResponse)
                .toList();

        // Wrap responses into a common PageResponse object for better structure.
        return new PageResponse<>(
                bookResponses,
                books.getNumber(),
                books.getSize(),
                books.getTotalElements(),
                books.getTotalPages(),
                books.isFirst(),
                books.isLast()
        );
    }

    /**
     * Retrieves a paginated list of books that belong specifically to the current user.
     *
     * @param page           The current page number.
     * @param size           Number of items per page.
     * @param connectedUser  Currently authenticated user.
     * @return A PageResponse containing a list of BookResponse objects.
     */
    public PageResponse<BookResponse> findAllBooksByOwner(int page, int size, Authentication connectedUser) {
        User user = (User) connectedUser.getPrincipal();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        // This method uses a Specification to filter books by owner ID.
        Page<Book> books = bookRepository.findAll(withOwnerId(user.getId()), pageable);

        List<BookResponse> bookResponses = books.stream()
                .map(bookMapper::toBookResponse)
                .toList();

        return new PageResponse<>(
                bookResponses,
                books.getNumber(),
                books.getSize(),
                books.getTotalElements(),
                books.getTotalPages(),
                books.isFirst(),
                books.isLast()
        );
    }

    /**
     * Retrieves all borrowed books for the current user, paginated.
     *
     * @param page           The current page number.
     * @param size           Number of items per page.
     * @param connectedUser  Currently authenticated user.
     * @return A PageResponse of BorrowedBookResponse objects.
     */
    public PageResponse<BorrowedBookResponse> findAllBorrowedBooks(int page, int size, Authentication connectedUser) {
        User user = (User) connectedUser.getPrincipal();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        // Custom repository method to fetch borrowed books.
        Page<BookTransactionHistory> allBorrowedBooks = bookTransactionHistoryRepository.findAllBorrowedBooks(pageable, user.getId());

        List<BorrowedBookResponse> bookResponses = allBorrowedBooks.stream()
                .map(bookMapper::toBorrowedBookResponse)
                .toList();

        return new PageResponse<>(
                bookResponses,
                allBorrowedBooks.getNumber(),
                allBorrowedBooks.getSize(),
                allBorrowedBooks.getTotalElements(),
                allBorrowedBooks.getTotalPages(),
                allBorrowedBooks.isFirst(),
                allBorrowedBooks.isLast()
        );
    }

    /**
     * Retrieves all returned books for the current user, paginated.
     *
     * @param page           The current page number.
     * @param size           Number of items per page.
     * @param connectedUser  Currently authenticated user.
     * @return A PageResponse of BorrowedBookResponse objects.
     */
    public PageResponse<BorrowedBookResponse> findAllReturnedBooks(int page, int size, Authentication connectedUser) {
        User user = (User) connectedUser.getPrincipal();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate").descending());

        Page<BookTransactionHistory> allBorrowedBooks = bookTransactionHistoryRepository.findAllReturnedBooks(pageable, user.getId());

        List<BorrowedBookResponse> bookResponses = allBorrowedBooks.stream()
                .map(bookMapper::toBorrowedBookResponse)
                .toList();

        return new PageResponse<>(
                bookResponses,
                allBorrowedBooks.getNumber(),
                allBorrowedBooks.getSize(),
                allBorrowedBooks.getTotalElements(),
                allBorrowedBooks.getTotalPages(),
                allBorrowedBooks.isFirst(),
                allBorrowedBooks.isLast()
        );
    }

    /**
     * Toggles the "shareable" status of a specific book,
     * ensuring only the owner can perform this action.
     *
     * @param bookId         Target book's ID.
     * @param connectedUser  Currently authenticated user (potential owner).
     * @return The updated book's ID.
     */
    public Integer UpdateShereableStatus(Integer bookId, Authentication connectedUser) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("No book found with this ID:: " + bookId));

        User user = (User) connectedUser.getPrincipal();

        // Ensure that only the real owner can toggle shareable status.
        if (!Objects.equals(book.getOwner().getId(), user.getId())) {
            throw new OperationNotPermittedExeption("You cannot update book's shareable status for someone else's book");
        }

        // Flip the shareable flag.
        book.setShareable(!book.isShareable());
        bookRepository.save(book);
        return bookId;
    }

    /**
     * Toggles the "archived" status of a specific book,
     * ensuring only the owner can perform this action.
     *
     * @param bookId         Target book's ID.
     * @param connectedUser  Currently authenticated user (potential owner).
     * @return The updated book's ID.
     */
    public Integer UpdateArchiveStatus(Integer bookId, Authentication connectedUser) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("No book found with this ID:: " + bookId));

        User user = (User) connectedUser.getPrincipal();

        // Ensure that only the real owner can toggle archived status.
        if (!Objects.equals(book.getOwner().getId(), user.getId())) {
            throw new OperationNotPermittedExeption("You cannot update the archived status of someone else's book");
        }

        // Flip the archived flag.
        book.setArchived(!book.isArchived());
        bookRepository.save(book);
        return bookId;
    }

    /**
     * Allows a user to borrow a book, provided that:
     * - It's not archived
     * - It's marked as shareable
     * - The user does not already own it
     * - The user hasn't already borrowed it
     * - Nobody else is currently borrowing it
     *
     * @param bookId         Target book's ID.
     * @param connectedUser  Currently authenticated user.
     * @return The newly created transaction's ID.
     */
    public Integer borrowBook(Integer bookId, Authentication connectedUser) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("No book found with ID:: " + bookId));

        // Cannot borrow if archived or not shareable.
        if (book.isArchived() || !book.isShareable()) {
            throw new OperationNotPermittedExeption("This book is archived or not shareable, so it cannot be borrowed");
        }

        User user = (User) connectedUser.getPrincipal();

        // Disallow borrowing your own book.
        if (Objects.equals(book.getCreatedBy(), connectedUser.getName())) {
            throw new OperationNotPermittedExeption("You cannot borrow your own book");
        }

        // Check if the user already has an active borrow for this book.
        boolean isAlreadyBorrowedByUser = bookTransactionHistoryRepository.isAlreadyBorrowedByUser(bookId, connectedUser.getName());
        if (isAlreadyBorrowedByUser) {
            throw new OperationNotPermittedExeption("You already borrowed this book and haven't returned/been approved to return it yet");
        }

        // Check if anyone else is currently borrowing the same book.
        boolean isAlreadyBorrowedByOtherUser = bookTransactionHistoryRepository.isAlreadyBorrowed(bookId);
        if (isAlreadyBorrowedByOtherUser) {
            throw new OperationNotPermittedExeption("This book is currently borrowed by someone else");
        }

        // Create a new transaction history entry.
        BookTransactionHistory bookTransactionHistory = BookTransactionHistory.builder()
                .user(user)
                .book(book)
                .returned(false)
                .returnApproved(false)
                .build();

        return bookTransactionHistoryRepository.save(bookTransactionHistory).getId();
    }

    /**
     * Allows a user to mark a borrowed book as returned.
     *
     * @param bookId         Target book's ID.
     * @param connectedUser  Currently authenticated user.
     * @return The updated transaction's ID.
     */
    public Integer returnBorrowedBook(Integer bookId, Authentication connectedUser) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("No book found with ID:: " + bookId));

        // Cannot return if archived or not shareable.
        if (book.isArchived() || !book.isShareable()) {
            throw new OperationNotPermittedExeption("This book cannot be returned because it's either archived or not shareable");
        }

        User user = (User) connectedUser.getPrincipal();

        // Disallow returning if the user is actually the owner who created it.
        if (Objects.equals(book.getCreatedBy(), connectedUser.getName())) {
            throw new OperationNotPermittedExeption("You cannot borrow (thus cannot return) your own book");
        }

        // Fetch the transaction to ensure this user actually borrowed the book.
        BookTransactionHistory bookTransactionHistory = bookTransactionHistoryRepository.findByBookIDAndUserId(bookId, user.getId())
                .orElseThrow(() -> new OperationNotPermittedExeption("You did not borrow this book, so you can't return it"));

        // Mark the book as returned, but not yet approved by the owner.
        bookTransactionHistory.setReturned(true);
        return bookTransactionHistoryRepository.save(bookTransactionHistory).getId();
    }

    /**
     * Allows an owner to approve the return of a borrowed book.
     *
     * @param bookId         Target book's ID.
     * @param connectedUser  Currently authenticated user (the owner).
     * @return The updated transaction's ID.
     */
    public Integer approveReturnBorrowedBook(Integer bookId, Authentication connectedUser) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("No book found with ID:: " + bookId));

        // Cannot approve if archived or not shareable.
        if (book.isArchived() || !book.isShareable()) {
            throw new OperationNotPermittedExeption("This book is archived or not shareable, so no return can be approved");
        }

        User user = (User) connectedUser.getPrincipal();

        // If the connected user is the same who created the book, they can approve returns.
        // But let's ensure they're actually the owner in the transaction records.
        BookTransactionHistory bookTransactionHistory = bookTransactionHistoryRepository.findByBookIDAndOwnerId(bookId, user.getId())
                .orElseThrow(() -> new OperationNotPermittedExeption("No open return transaction to approve for this book"));

        // Approve the return.
        bookTransactionHistory.setReturnApproved(true);
        return bookTransactionHistoryRepository.save(bookTransactionHistory).getId();
    }

    /**
     * Uploads a book cover picture for a given book and sets the path to that book entity.
     *
     * @param file           Image file uploaded from the client.
     * @param connectedUser  Currently authenticated user.
     * @param bookId         Target book's ID.
     */
    public void uploadBookCoverPicture(MultipartFile file, Authentication connectedUser, Integer bookId) {
        // Ensure the book actually exists.
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("No book found with ID:: " + bookId));

        // Retrieve the current user (not necessarily used for permission checks here, but used for file storage sub-directory).
        User user = (User) connectedUser.getPrincipal();

        // Store the file and get the file path.
        var bookCover = fileStorageService.saveFile(file, user.getId());

        // Link the saved file path to the Book entity.
        book.setBookCover(bookCover);
        bookRepository.save(book);
    }
}

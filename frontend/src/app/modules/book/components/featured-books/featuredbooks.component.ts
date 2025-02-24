
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {BookService} from '../../../../services/services/book.service';
import {ToastrService} from 'ngx-toastr';
import {CurrencyPipe, DecimalPipe, NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';

interface Book {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  isNew?: boolean;
  isBestseller?: boolean;
  isWishlisted?: boolean;
  inStock: boolean;
  description?: string;
  category?: 'fiction' | 'non-fiction' | 'all';
}

interface Category {
  label: string;
  value: string;
}

@Component({
  selector: 'app-featured-books',
  templateUrl: './featuredbooks.component.html',
  standalone: true,
  imports: [
    CurrencyPipe,
    DecimalPipe,
    RouterLink,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./featuredbooks.component.scss']
})
export class FeaturedBooksComponent implements OnInit {
  filteredBooks: Book[] = [

      {
        id: 1,
        title: 'The Midnight Library',
        author: 'Matt Haig',
        coverImage: 'assets/books/book1.jpg',
        price: 19.99,
        originalPrice: 24.99,
        rating: 4.5,
        reviewCount: 1250,
        tags: ['Fiction', 'Fantasy'],
        category: 'fiction',
        isNew: true,
        isBestseller: true,
        isWishlisted: false,
        inStock: true,
        description: 'Between life and death there is a library, and within that library, the shelves go on forever...'
      },
      {
        id: 2,
        title: 'Atomic Habits',
        author: 'James Clear',
        coverImage: 'assets/books/book2.jpg',
        price: 24.99,
        rating: 4.8,
        reviewCount: 2100,
        tags: ['Self-Help', 'Productivity'],
        category: 'non-fiction',
        isNew: false,
        isBestseller: true,
        isWishlisted: false,
        inStock: true,
        description: 'A revolutionary guide to building good habits and breaking bad ones.'
      },
      {
        id: 3,
        title: 'Project Hail Mary',
        author: 'Andy Weir',
        coverImage: 'assets/books/book3.jpg',
        price: 21.99,
        rating: 4.7,
        reviewCount: 1800,
        tags: ['Sci-Fi', 'Adventure'],
        category: 'fiction',
        isNew: true,
        isBestseller: false,
        isWishlisted: true,
        inStock: true,
        description: 'A lone astronaut must save humanity from a terrifying extinction event.'
      },
      {
        id: 4,
        title: 'The Psychology of Money',
        author: 'Morgan Housel',
        coverImage: 'assets/books/book4.jpg',
        price: 18.99,
        originalPrice: 22.99,
        rating: 4.6,
        reviewCount: 950,
        tags: ['Finance', 'Psychology'],
        category: 'non-fiction',
        isNew: false,
        isBestseller: false,
        isWishlisted: false,
        inStock: false,
        description: 'Timeless lessons on wealth, greed, and happiness.'
      },
      {
        id: 5,
        title: 'The Thursday Murder Club',
        author: 'Richard Osman',
        coverImage: 'assets/books/book5.jpg',
        price: 16.99,
        rating: 4.3,
        reviewCount: 780,
        tags: ['Mystery', 'Crime'],
        category: 'fiction',
        isNew: false,
        isBestseller: true,
        isWishlisted: false,
        inStock: true,
        description: 'Four unlikely friends meet weekly to solve cold cases.'
      },
      {
        id: 6,
        title: "The Children's Book of the Stars",
        author: 'Sarah Thompson',
        coverImage: 'assets/books/book3.jpg',
        price: 14.99,
        rating: 4.9,
        reviewCount: 320,
        tags: ['Education', 'Space'],
        category: 'fiction',
        isNew: true,
        isBestseller: false,
        isWishlisted: false,
        inStock: true,
        description: 'A beautifully illustrated guide to the universe for young minds.'
      },
      {
        id: 7,
        title: 'Cooking With Love',
        author: 'Maria Rodriguez',
        coverImage: 'assets/books/book2.jpg',
        price: 29.99,
        originalPrice: 34.99,
        rating: 4.7,
        reviewCount: 550,
        tags: ['Cooking', 'Lifestyle'],
        category: 'non-fiction',
        isNew: true,
        isBestseller: false,
        isWishlisted: false,
        inStock: true,
        description: 'Family recipes passed down through generations with a modern twist.'
      },
      {
        id: 8,
        title: 'Digital Minimalism',
        author: 'Cal Newport',
        coverImage: 'assets/books/book1.jpg',
        price: 20.99,
        rating: 4.5,
        reviewCount: 890,
        tags: ['Technology', 'Lifestyle'],
        category: 'non-fiction',
        isNew: false,
        isBestseller: false,
        isWishlisted: true,
        inStock: true,
        description: 'A philosophy of technology use based on minimalist principles.'
      }

  ];
  selectedBook: Book | null = null;
  loading = false;
  noMoreBooks = false;
  currentPage = 1;
  selectedCategory = 'all';
  books: Book[] = [];

  // books: Book[] = [
  //   {
  //     id: 1,
  //     title: 'The Midnight Library',
  //     author: 'Matt Haig',
  //     cover: '/assets/books/book1.jpg',
  //     rating: 4.5,
  //     reviewCount: 1250,
  //     price: '$19.99',
  //     tags: ['Fiction', 'Fantasy'],
  //     category: 'fiction',
  //     inStock: true
  //   },
  //   {
  //     id: 2,
  //     title: 'Atomic Habits',
  //     author: 'James Clear',
  //     cover: '/assets/books/book2.jpg',
  //     rating: 4.8,
  //     reviewCount: 2100,
  //     price: '$24.99',
  //     tags: ['Self-Help', 'Productivity'],
  //     category: 'non-fiction',
  //     inStock: false
  //   },
  //   {
  //     id: 3,
  //     title: 'Project Hail Mary',
  //     author: 'Andy Weir',
  //     cover: '/assets/books/book3.jpg',
  //     rating: 4.7,
  //     reviewCount: 1800,
  //     price: '$21.99',
  //     tags: ['Sci-Fi', 'Adventure'],
  //     category: 'fiction',
  //     inStock: true
  //   },
  //   {
  //     id: 4,
  //     title: 'The Seven Husbands of Evelyn Hugo',
  //     author: 'Taylor Jenkins Reid',
  //     cover: '/assets/books/book4.jpg',
  //     rating: 4.6,
  //     reviewCount: 1500,
  //     price: '$18.99',
  //     tags: ['Fiction', 'Historical'],
  //     category: 'fiction',
  //     inStock: false
  //   },
  //   {
  //     id: 5,
  //     title: 'Where the Crawdads Sing',
  //     author: 'Delia Owens',
  //     cover: '/assets/books/book5.jpg',
  //     rating: 4.8,
  //     reviewCount: 2300,
  //     price: '$20.99',
  //     tags: ['Fiction', 'Mystery'],
  //     category: 'fiction',
  //     inStock: true
  //   }
  // ];

  categories: Category[] = [
    {label: 'All', value: 'all'},
    {label: 'Fiction', value: 'fiction'},
    {label: 'Non-Fiction', value: 'non-fiction'},
    {label: 'Children', value: 'children'}
  ];

  constructor(
    private bookService: BookService,
    private toastService: ToastrService,
    // private cartService: CartService,
    // private wishlistService: WishlistService,
    // private toastService: ToastService,
    // private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {
    this.loadBooks();
  }

  // featured-books.component.ts

  loadBooks(): void {
    this.loading = true;
    // Simulating API call with sample data
    setTimeout(() => {
      this.books = [
        {
          id: 1,
          title: 'The Midnight Library',
          author: 'Matt Haig',
          coverImage: 'assets/books/book1.jpg',
          price: 19.99,
          originalPrice: 24.99,
          rating: 4.5,
          reviewCount: 1250,
          tags: ['Fiction', 'Fantasy'],
          category: 'fiction',
          isNew: true,
          isBestseller: true,
          isWishlisted: false,
          inStock: true,
          description: 'Between life and death there is a library, and within that library, the shelves go on forever...'
        },
        {
          id: 2,
          title: 'Atomic Habits',
          author: 'James Clear',
          coverImage: 'assets/books/book2.jpg',
          price: 24.99,
          rating: 4.8,
          reviewCount: 2100,
          tags: ['Self-Help', 'Productivity'],
          category: 'non-fiction',
          isNew: false,
          isBestseller: true,
          isWishlisted: false,
          inStock: true,
          description: 'A revolutionary guide to building good habits and breaking bad ones.'
        },
        {
          id: 3,
          title: 'Project Hail Mary',
          author: 'Andy Weir',
          coverImage: 'assets/books/book3.jpg',
          price: 21.99,
          rating: 4.7,
          reviewCount: 1800,
          tags: ['Sci-Fi', 'Adventure'],
          category: 'fiction',
          isNew: true,
          isBestseller: false,
          isWishlisted: true,
          inStock: true,
          description: 'A lone astronaut must save humanity from a terrifying extinction event.'
        },
        {
          id: 4,
          title: 'The Psychology of Money',
          author: 'Morgan Housel',
          coverImage: 'assets/books/book4.jpg',
          price: 18.99,
          originalPrice: 22.99,
          rating: 4.6,
          reviewCount: 950,
          tags: ['Finance', 'Psychology'],
          category: 'non-fiction',
          isNew: false,
          isBestseller: false,
          isWishlisted: false,
          inStock: false,
          description: 'Timeless lessons on wealth, greed, and happiness.'
        },
        {
          id: 5,
          title: 'The Thursday Murder Club',
          author: 'Richard Osman',
          coverImage: 'assets/books/book5.jpg',
          price: 16.99,
          rating: 4.3,
          reviewCount: 780,
          tags: ['Mystery', 'Crime'],
          category: 'fiction',
          isNew: false,
          isBestseller: true,
          isWishlisted: false,
          inStock: true,
          description: 'Four unlikely friends meet weekly to solve cold cases.'
        },
        {
          id: 6,
          title: "The Children's Book of the Stars",
          author: 'Sarah Thompson',
          coverImage: 'assets/books/book3.jpg',
          price: 14.99,
          rating: 4.9,
          reviewCount: 320,
          tags: ['Education', 'Space'],
          category: 'fiction',
          isNew: true,
          isBestseller: false,
          isWishlisted: false,
          inStock: true,
          description: 'A beautifully illustrated guide to the universe for young minds.'
        },
        {
          id: 7,
          title: 'Cooking With Love',
          author: 'Maria Rodriguez',
          coverImage: 'assets/books/book2.jpg',
          price: 29.99,
          originalPrice: 34.99,
          rating: 4.7,
          reviewCount: 550,
          tags: ['Cooking', 'Lifestyle'],
          category: 'non-fiction',
          isNew: true,
          isBestseller: false,
          isWishlisted: false,
          inStock: true,
          description: 'Family recipes passed down through generations with a modern twist.'
        },
        {
          id: 8,
          title: 'Digital Minimalism',
          author: 'Cal Newport',
          coverImage: 'assets/books/book1.jpg',
          price: 20.99,
          rating: 4.5,
          reviewCount: 890,
          tags: ['Technology', 'Lifestyle'],
          category: 'non-fiction',
          isNew: false,
          isBestseller: false,
          isWishlisted: true,
          inStock: true,
          description: 'A philosophy of technology use based on minimalist principles.'
        }
      ];

      this.filterByCategory(this.selectedCategory);
      this.loading = false;
    }, 1000); // Simulate network delay
  }

  filterByCategory(category: string): void {
    // this.selectedCategory = category;
    // if (category === 'all') {
    //   this.filteredBooks = this.books;
    // } else {
    //   this.filteredBooks = this.books.filter(book => book.category === category);
    // }
  }

  toggleWishlist(book: Book): void {
    book.isWishlisted = !book.isWishlisted;
    // this.wishlistService.toggle(book.id).subscribe(
    //   () => {
    //     this.toastService.show(
    //       book.isWishlisted ? 'Added to wishlist' : 'Removed from wishlist'
    //     );
    //   },
    //   (error) => {
    //     book.isWishlisted = !book.isWishlisted; // Revert on error
    //     this.toastService.show('Failed to update wishlist', 'error');
    //   }
    // );
  }

  showQuickView(book: Book): void {
    this.selectedBook = book;
    // this.modalService.open('quickViewModal');
  }

  shareBook(book: Book): void {
    // if (navigator.share) {
    //   navigator.share({
    //     title: book.title,
    //     text: `Check out "${book.title}" by ${book.author}`,
    //     url: `${window.location.origin}/books/${book.id}`
    //   }).catch(() => {
    //     this.copyToClipboard(`${window.location.origin}/books/${book.id}`);
    //   });
    // } else {
    //   this.copyToClipboard(`${window.location.origin}/books/${book.id}`);
    // }
  }

// featured-books.component.ts

  addToCart(book: Book): void {
    if (!book.inStock) return;

    // this.cartService.addItem(book.id).subscribe(
    //   () => {
    //     this.toastService.show('Added to cart successfully');
    //     // Animate cart icon
    //     this.animateCartIcon();
    //     // Update cart count in header
    //     this.cartService.updateCartCount();
    //   },
    //   (error) => {
    //     this.toastService.show('Failed to add to cart', 'error');
    //   }
    // );
  }

  loadMore(): void {
    if (this.loading || this.noMoreBooks) return;

    this.loading = true;
    this.currentPage++;

    // this.bookService.getFeaturedBooks(this.currentPage).subscribe(
    //   (newBooks) => {
    //     if (newBooks.length === 0) {
    //       this.noMoreBooks = true;
    //     } else {
    //       this.books = [...this.books, ...newBooks];
    //       this.filterByCategory(this.selectedCategory);
    //     }
    //     this.loading = false;
    //   },
    //   (error) => {
    //     this.t.show('Failed to load more books', 'error');
    //     this.loading = false;
    //   }
    // );
  }

  private copyToClipboard(text: string): void {
    // navigator.clipboard.writeText(text).then(
    //   () => this.toastService.show('Link copied to clipboard'),
    //   () => this.toastService.show('Failed to copy link', 'error')
    // );
  }

  private animateCartIcon(): void {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
      cartIcon.classList.add('cart-shake');
      setTimeout(() => cartIcon.classList.remove('cart-shake'), 500);
    }
  }

}


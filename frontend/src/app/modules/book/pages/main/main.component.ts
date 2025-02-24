
import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {NavbarComponent} from '../../components/navbar/navbar.component';
import {HerosectionComponent} from '../../components/herosection/herosection.component';
import {FeaturedBooksComponent} from '../../components/featured-books/featuredbooks.component';
import {
  BooksCategoriesSectionComponent
} from '../../components/books-categories-section/books-categories-section.component';
import {ReviewSectionComponent} from '../../components/review-section/review-section.component';
import {MobileAppSectionComponent} from '../../components/mobile-app-section/mobile-app-section.component';

// Interfaces
interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  reviewCount: number;
  price: string;
  tags: string[];
  category: 'fiction' | 'non-fiction' | 'all';
}

interface Notification {
  id: number;
  type: 'book_recommendation' | 'achievement' | 'chat';
  message: string;
  time: string;
  isRead: boolean;
}

interface Tab {
  label: string;
  value: string;
}

@Component({
  selector: 'app-bookstore',
  templateUrl: './main.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, HerosectionComponent, FeaturedBooksComponent, BooksCategoriesSectionComponent, ReviewSectionComponent, MobileAppSectionComponent],
  styleUrls: ['./nav.component.css'],
})
export class MainComponent implements OnInit {
  // UI States
  isScrolled = false;
  isDarkMode = false;
  showNotifications = false;
  showUserMenu = false;
  showMobileSearch = false;
  isMobileMenuOpen = false;
  searchQuery = '';
  currentTab = 'all';

  // User Info
  userName = 'John Doe';  // Set to null for logged out state
  unreadNotifications = 3;
  emailAddress = '';

  // Navigation
  navItems = [
    { path: '/home', label: 'Home' },
    { path: '/books', label: 'Books' },
    { path: '/discover', label: 'Discover' }
  ];

  // Tabs
  tabs: Tab[] = [
    { label: 'All', value: 'all' },
    { label: 'Fiction', value: 'fiction' },
    { label: 'Non-Fiction', value: 'non-fiction' }
  ];

  // Books Data
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
  //     category: 'fiction'
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
  //     category: 'non-fiction'
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
  //     category: 'fiction'
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
  //     category: 'fiction'
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
  //     category: 'fiction'
  //   }
  // ];


  // Featured Books for Hero Section
  // featuredBooks = this.books.slice(0, 3);

  // Notifications Data
  notifications: Notification[] = [
    {
      id: 1,
      type: 'book_recommendation',
      message: 'New book recommendation: "The Silent Patient"',
      time: '2 hours ago',
      isRead: false
    },
    {
      id: 2,
      type: 'achievement',
      message: 'Congratulations! You`ve completed your reading goal',
      time: '1 day ago',
      isRead: false
    },
    {
      id: 3,
      type: 'chat',
      message: 'New comment on your book review',
      time: '2 days ago',
      isRead: false
    }
  ];



  // get filteredBooks(): Book[] {
  //   if (this.currentTab === 'all') return this.books;
  //   return this.books.filter(book => book.category === this.currentTab);
  // }



  // Footer Links
  exploreLinks = [
    { path: '/categories', label: 'Categories' },
    { path: '/new-releases', label: 'New Releases' },
    { path: '/bestsellers', label: 'Bestsellers' },
    { path: '/authors', label: 'Authors' },
    { path: '/events', label: 'Events' }
  ];

  supportLinks = [
    { path: '/help', label: 'Help Center' },
    { path: '/shipping', label: 'Shipping Info' },
    { path: '/returns', label: 'Returns' },
    { path: '/order-tracking', label: 'Order Tracking' },
    { path: '/contact', label: 'Contact Us' }
  ];

  legalLinks = [
    { path: '/terms', label: 'Terms' },
    { path: '/privacy', label: 'Privacy' },
    { path: '/cookies', label: 'Cookies' },
    { path: '/accessibility', label: 'Accessibility' }
  ];

  // Social Links
  socialLinks = [
    { icon: 'facebook', url: '#' },
    { icon: 'twitter-x', url: '#' },
    { icon: 'instagram', url: '#' },
    { icon: 'linkedin', url: '#' }
  ];

  // Footer Year
  currentYear = new Date().getFullYear();

  constructor() {
  }


  ngOnInit(): void {
    this.checkScroll();
    this.updateUnreadCount();
    // Initialize theme after DOM is ready
    setTimeout(() => {
      this.initTheme();
    });
  }

  private initTheme(): void {
    try {
      const savedTheme = localStorage?.getItem('theme');
      if (savedTheme) {
        this.isDarkMode = savedTheme === 'dark';
        this.applyTheme();
      }
    } catch (error) {
      console.warn('Could not access localStorage:', error);
    }
  }

  private applyTheme(): void {
    try {
      document?.body?.classList?.toggle('dark-theme', this.isDarkMode);
    } catch (error) {
      console.warn('Could not apply theme:', error);
    }
  }

  // Scroll Handling
  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.checkScroll();
  }

  private checkScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  // Mobile Menu
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // Search
  toggleSearch(): void {
    this.showMobileSearch = !this.showMobileSearch;
  }

  onSearch(): void {
    console.log('Searching for:', this.searchQuery);
    // Implement search logic
  }

  // Notifications
  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.showUserMenu = false;
    }
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'book_recommendation': return 'book';
      case 'achievement': return 'trophy';
      case 'chat': return 'chat';
      default: return 'bell';
    }
  }

  markNotificationAsRead(notification: Notification): void {
    notification.isRead = true;
    this.updateUnreadCount();
  }

  private updateUnreadCount(): void {
    this.unreadNotifications = this.notifications.filter(n => !n.isRead).length;
  }

  // User Menu
  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
    if (this.showUserMenu) {
      this.showNotifications = false;
    }
  }

  logout(): void {
    console.log('Logging out...');
    // Implement logout logic
  }

  // Book Functions
  getBookTransform(index: number): string {
    switch (index) {
      case 0: return 'translateZ(100px)';
      case 1: return 'translateZ(50px) translateX(100px)';
      case 2: return 'translateZ(0px) translateX(-100px)';
      default: return 'none';
    }
  }

  setTab(tab: string): void {
    this.currentTab = tab;
  }

  addToWishlist(bookId: number): void {
    console.log('Adding to wishlist:', bookId);
    // Implement wishlist logic
  }

  quickView(book: Book): void {
    console.log('Quick view:', book);
    // Implement quick view logic
  }

  shareBook(bookId: number): void {
    console.log('Sharing book:', bookId);
    // Implement share logic
  }

  addToCart(bookId: number): void {
    console.log('Adding to cart:', bookId);
    // Implement cart logic
  }

  // Newsletter
  onSubscribe(): void {
    if (this.emailAddress) {
      console.log('Subscribing email:', this.emailAddress);
      // Implement subscription logic
      this.emailAddress = '';
    }
  }
}

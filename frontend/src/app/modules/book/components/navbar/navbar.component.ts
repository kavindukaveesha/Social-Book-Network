import {Component, OnInit, HostListener, Inject, PLATFORM_ID, ViewEncapsulation} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Notification {
  id: number;
  type: 'book_recommendation' | 'achievement' | 'chat';
  message: string;
  time: string;
  isRead: boolean;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'], // or .css
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  encapsulation: ViewEncapsulation.None  // Add this if you want styles to affect child components
})
export class NavbarComponent implements OnInit {
  // UI States
  isScrolled = false;
  isDarkMode = false;
  showNotifications = false;
  showUserMenu = false;
  showMobileSearch = false;
  isMobileMenuOpen = false;
  searchQuery = '';


  isAuthenticated = false;
  user = {
    name: 'John Doe',
    avatar: 'assets/books/book1.jpg',
  };
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  login() {
    this.isAuthenticated = true;
  }


  // User Info
  userName = 'John Doe';  // Set to null for logged out state
  unreadNotifications = 3;

  // Navigation
  navItems = [
    { path: '/home', label: 'Home' },
    { path: '/books', label: 'Books' },
    { path: '/discover', label: 'Discover' }
  ];

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
      message: 'Congratulations! You\'ve completed your reading goal',
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

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScroll();
      this.updateUnreadCount();
      this.initTheme();
    }
  }

  private initTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
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
  }

  private applyTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        document?.body?.classList?.toggle('dark-theme', this.isDarkMode);
      } catch (error) {
        console.warn('Could not apply theme:', error);
      }
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScroll();
    }
  }

  private checkScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled = window.scrollY > 50;
    }
  }
  // UI Methods
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.toggle('dark-theme');
      localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleSearch(): void {
    this.showMobileSearch = !this.showMobileSearch;
  }

  onSearch(): void {
    console.log('Searching for:', this.searchQuery);
    // Implement search logic
  }

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
}

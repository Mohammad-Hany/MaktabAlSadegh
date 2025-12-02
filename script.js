// script.js
// Global State
let eventsData = [];
let currentEventFilter = 'all';
let currentDateFilter = 'all';
let currentSortOrder = 'newest';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize comments scrolling
    initializeCommentsScrolling();
    
    // Add event listeners
    addEventListeners();
    
    // Check if we're on events page
    if (document.querySelector('.events-results-section')) {
        initializeEventsData();
        renderEventsResults();
    }
    
    // Check if we're on event detail page
    if (document.querySelector('.event-detail-cover')) {
        loadEventDetailFromURL();
    }
});

// Mobile Menu Functions (opens from left to right)
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    const body = document.body;
    
    if (!mobileMenu || !overlay) return;
    
    if (mobileMenu.classList.contains('active')) {
        // Close menu
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        body.style.overflow = 'auto';
        
        // Update hamburger icon
        const menuBtn = document.querySelector('.mobile-menu-btn i');
        if (menuBtn) {
            menuBtn.classList.remove('fa-times');
            menuBtn.classList.add('fa-bars');
        }
    } else {
        // Open menu
        mobileMenu.classList.add('active');
        overlay.classList.add('active');
        body.style.overflow = 'hidden';
        
        // Update hamburger icon
        const menuBtn = document.querySelector('.mobile-menu-btn i');
        if (menuBtn) {
            menuBtn.classList.remove('fa-bars');
            menuBtn.classList.add('fa-times');
        }
    }
}

function initializeMobileMenu() {
    // Close mobile menu when clicking outside or on ESC key
    document.addEventListener('click', function(event) {
        const mobileMenu = document.getElementById('mobileMenu');
        const overlay = document.getElementById('mobileMenuOverlay');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        
        if (mobileMenu && mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(event.target) && 
            !menuBtn.contains(event.target)) {
            toggleMobileMenu();
        }
    });
    
    // Close on ESC key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        }
    });
}

// Comments Section Functions with Smooth Scrolling
function initializeCommentsScrolling() {
    const commentsSlider = document.querySelector('.comments-slider');
    if (!commentsSlider) return;
    
    // Enable smooth touch scrolling
    let isDown = false;
    let startX;
    let scrollLeft;
    
    commentsSlider.addEventListener('mousedown', (e) => {
        isDown = true;
        commentsSlider.classList.add('active');
        startX = e.pageX - commentsSlider.offsetLeft;
        scrollLeft = commentsSlider.scrollLeft;
    });
    
    commentsSlider.addEventListener('mouseleave', () => {
        isDown = false;
        commentsSlider.classList.remove('active');
    });
    
    commentsSlider.addEventListener('mouseup', () => {
        isDown = false;
        commentsSlider.classList.remove('active');
    });
    
    commentsSlider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - commentsSlider.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed
        commentsSlider.scrollLeft = scrollLeft - walk;
    });
    
    // Touch events for mobile
    commentsSlider.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - commentsSlider.offsetLeft;
        scrollLeft = commentsSlider.scrollLeft;
    });
    
    commentsSlider.addEventListener('touchend', () => {
        isDown = false;
    });
    
    commentsSlider.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - commentsSlider.offsetLeft;
        const walk = (x - startX) * 2;
        commentsSlider.scrollLeft = scrollLeft - walk;
    });
}

function scrollComments(direction) {
    const commentsSlider = document.querySelector('.comments-slider');
    if (!commentsSlider) return;
    
    const cardWidth = 320; // Approximate width of comment card + gap
    const scrollAmount = cardWidth + 24; // Card width + gap
    
    if (direction === 'next') {
        commentsSlider.scrollLeft += scrollAmount;
    } else if (direction === 'prev') {
        commentsSlider.scrollLeft -= scrollAmount;
    }
}

// Initialize comments list scrolling on event detail page
function initializeCommentsListScrolling() {
    const commentsList = document.getElementById('commentsList');
    if (!commentsList) return;
    
    // Make sure scroll container works smoothly
    const container = commentsList.parentElement;
    if (container) {
        container.style.overflowY = 'auto';
        container.style.scrollBehavior = 'smooth';
    }
}

// Events Page Functions
function initializeEventsData() {
    // Sample events data
    eventsData = [
        {
            id: 'event1',
            title: 'سخنرانی حجت الاسلام پناهیان - محرم ۱۴۰۳',
            category: 'lecture',
            date: '2024-09-15',
            time: '20:30',
            speaker: 'حجت الاسلام پناهیان',
            description: 'سخنرانی ویژه محرم با موضوع «عاشورا و فلسفه قیام حسینی» توسط حجت الاسلام پناهیان.',
            image: 'images/8.jpg',
            is_upcoming: true,
            is_popular: true
        },
        {
            id: 'event2',
            title: 'جشن نیمه شعبان هیئت مکتب الصادق',
            category: 'celebration',
            date: '2024-08-10',
            time: '18:00',
            speaker: 'حاج محمد عباسی',
            description: 'جشن بزرگ نیمه شعبان با حضور کودکان و نوجوانان محله و اجرای برنامه‌های شاد مذهبی.',
            image: 'images/8.jpg',
            is_upcoming: false,
            is_popular: true
        },
        {
            id: 'event3',
            title: 'سخنرانی دکتر پناهی در مورد سبک زندگی اسلامی',
            category: 'lecture',
            date: '2024-07-28',
            time: '19:30',
            speaker: 'دکتر علیرضا پناهی',
            description: 'سخنرانی علمی-مذهبی با موضوع سبک زندگی اسلامی در جهان معاصر و چالش‌های پیش روی جوانان.',
            image: 'images/8.jpg',
            is_upcoming: false,
            is_popular: true
        },
        {
            id: 'event4',
            title: 'عزاداری شهادت امام جواد (ع)',
            category: 'mourning',
            date: '2024-07-15',
            time: '20:00',
            speaker: 'حاج علی اکبری',
            description: 'مراسم عزاداری شهادت امام محمد تقی (ع) با مداحی ذاکر اهل بیت حاج علی اکبری و سخنرانی مذهبی.',
            image: 'images/8.jpg',
            is_upcoming: false,
            is_popular: false
        },
        {
            id: 'event5',
            title: 'نماز جماعت مغرب و عشا',
            category: 'prayer',
            date: '2024-07-05',
            time: '19:00',
            speaker: '',
            description: 'نماز جماعت مغرب و عشا به امامت حجت الاسلام محمدی.',
            image: 'images/8.jpg',
            is_upcoming: false,
            is_popular: false
        },
        {
            id: 'event6',
            title: 'جشن میلاد امام رضا (ع)',
            category: 'celebration',
            date: '2024-06-25',
            time: '18:30',
            speaker: '',
            description: 'جشن میلاد امام رضا (ع) با برنامه‌های فرهنگی و مذهبی ویژه کودکان و نوجوانان.',
            image: 'images/8.jpg',
            is_upcoming: false,
            is_popular: false
        },
        {
            id: 'event7',
            title: 'سخنرانی اخلاقی هفتگی',
            category: 'lecture',
            date: '2024-06-18',
            time: '19:00',
            speaker: 'حجت الاسلام محمدی',
            description: 'سخنرانی اخلاقی هفتگی با موضوع «اخلاق در خانواده»',
            image: 'images/8.jpg',
            is_upcoming: false,
            is_popular: false
        },
        {
            id: 'event8',
            title: 'مراسم دعای کمیل',
            category: 'ceremony',
            date: '2024-06-10',
            time: '21:00',
            speaker: '',
            description: 'مراسم دعای کمیل با مداحی و ذکر مصیبت.',
            image: 'images/8.jpg',
            is_upcoming: false,
            is_popular: false
        }
    ];
}

function filterEvents() {
    const searchQuery = document.getElementById('eventsSearch')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || 'all';
    
    currentEventFilter = categoryFilter;
    
    renderEventsResults(searchQuery, categoryFilter, currentDateFilter, currentSortOrder);
}

function setDateFilter(filter) {
    currentDateFilter = filter;
    
    // Update UI
    const dateFilterButtons = document.querySelectorAll('.date-filter-btn');
    dateFilterButtons.forEach(button => {
        if (button.getAttribute('data-filter') === filter) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    renderEventsResults();
}

function sortEvents() {
    const sortOrder = document.getElementById('sortOrder')?.value || 'newest';
    currentSortOrder = sortOrder;
    
    renderEventsResults();
}

function clearFilters() {
    // Reset filters
    const eventsSearch = document.getElementById('eventsSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortOrder = document.getElementById('sortOrder');
    
    if (eventsSearch) eventsSearch.value = '';
    if (categoryFilter) categoryFilter.value = 'all';
    if (sortOrder) sortOrder.value = 'newest';
    
    // Reset date filter buttons
    const dateFilterButtons = document.querySelectorAll('.date-filter-btn');
    dateFilterButtons.forEach(button => {
        if (button.getAttribute('data-filter') === 'all') {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Reset global state
    currentEventFilter = 'all';
    currentDateFilter = 'all';
    currentSortOrder = 'newest';
    
    renderEventsResults();
}

function renderEventsResults(searchQuery = '', categoryFilter = currentEventFilter, dateFilter = currentDateFilter, sortOrder = currentSortOrder) {
    const resultsContainer = document.getElementById('eventsResults');
    const resultsCount = document.getElementById('resultsCount');
    const noResults = document.getElementById('noResults');
    
    if (!resultsContainer) return;
    
    // Filter events
    let filteredEvents = [...eventsData];
    
    // Apply search filter
    if (searchQuery) {
        filteredEvents = filteredEvents.filter(event => 
            event.title.toLowerCase().includes(searchQuery) ||
            event.description.toLowerCase().includes(searchQuery) ||
            (event.speaker && event.speaker.toLowerCase().includes(searchQuery))
        );
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
        filteredEvents = filteredEvents.filter(event => event.category === categoryFilter);
    }
    
    // Apply date filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dateFilter === 'upcoming') {
        filteredEvents = filteredEvents.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= today;
        });
    } else if (dateFilter === 'past') {
        filteredEvents = filteredEvents.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate < today;
        });
    }
    
    // Apply sorting
    filteredEvents.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        if (sortOrder === 'newest') {
            return dateB - dateA;
        } else if (sortOrder === 'oldest') {
            return dateA - dateB;
        } else if (sortOrder === 'popular') {
            return (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0);
        }
        return 0;
    });
    
    // Update results count
    if (resultsCount) {
        resultsCount.textContent = `${filteredEvents.length} مورد یافت شد`;
    }
    
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    // Show/hide no results message
    if (noResults) {
        if (filteredEvents.length === 0) {
            noResults.style.display = 'flex';
            return;
        } else {
            noResults.style.display = 'none';
        }
    }
    
    // Render events
    filteredEvents.forEach(event => {
        const eventCard = createEventCard(event, true);
        resultsContainer.appendChild(eventCard);
    });
}

function createEventCard(event, dense = false) {
    // Create card container
    const card = document.createElement('div');
    card.className = 'event-card';
    
    // Format date
    const eventDate = new Date(event.date);
    const monthNames = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
    const month = monthNames[eventDate.getMonth()];
    const day = eventDate.getDate();
    
    // Category translations and colors
    const categoryTranslations = {
        'ceremony': 'مراسم',
        'lecture': 'سخنرانی',
        'prayer': 'نماز',
        'celebration': 'جشن',
        'mourning': 'عزاداری'
    };
    
    const categoryColors = {
        'ceremony': 'category-ceremony',
        'lecture': 'category-lecture',
        'prayer': 'category-prayer',
        'celebration': 'category-celebration',
        'mourning': 'category-mourning'
    };
    
    // Create card HTML
    card.innerHTML = `
        <div class="event-card-image">
            <img src="${event.image}" alt="${event.title}">
            <div class="event-date-badge">
                <span class="month">${month}</span>
                <span class="day">${day}</span>
            </div>
            <div class="event-category-badge ${categoryColors[event.category]}">
                ${categoryTranslations[event.category]}
            </div>
        </div>
        
        <div class="event-card-content">
            <h3 class="event-title">${event.title}</h3>
            <p class="event-description">${event.description}</p>
            
            <div class="event-meta-small">
                <span><i class="far fa-clock"></i> ${event.time}</span>
                ${event.speaker ? `<span>سخنران: ${event.speaker}</span>` : ''}
            </div>
            
            <a href="event-detail.html?id=${event.id}" class="event-detail-link">
                مشاهده گزارش <i class="fas fa-arrow-left"></i>
            </a>
        </div>
    `;
    
    // Add hover animation
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
    
    return card;
}

// Event Detail Functions
function loadEventDetailFromURL() {
    // Get event ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id') || 'event1';
    
    loadEventDetail(eventId);
}

function loadEventDetail(eventId) {
    // Find event by ID
    const event = eventsData.find(e => e.id === eventId) || eventsData[0];
    if (!event) return;
    
    // Update event detail page with event data
    const detailCoverImage = document.getElementById('detailCoverImage');
    const detailTitle = document.getElementById('detailTitle');
    const detailDate = document.getElementById('detailDate');
    const detailTime = document.getElementById('detailTime');
    const reportDescription = document.getElementById('reportDescription');
    const eventTags = document.getElementById('eventTags');
    
    if (detailCoverImage) detailCoverImage.src = event.image;
    if (detailTitle) detailTitle.textContent = event.title;
    if (detailDate) detailDate.textContent = formatDate(event.date);
    if (detailTime) detailTime.textContent = event.time;
    if (reportDescription) reportDescription.textContent = event.description;
    
    // Update category tag
    const categoryTranslations = {
        'ceremony': 'مراسم',
        'lecture': 'سخنرانی',
        'prayer': 'نماز',
        'celebration': 'جشن',
        'mourning': 'عزاداری'
    };
    
    if (eventTags) {
        eventTags.innerHTML = `
            <span class="event-tag event-tag-ceremony">${categoryTranslations[event.category]}</span>
            ${event.is_upcoming ? '<span class="event-tag event-tag-upcoming">پیش‌رو</span>' : ''}
        `;
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const monthNames = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
}

// Tab Switching for Event Detail (Horizontal Row)
function switchTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.detail-tab-content');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(`${tabName}Tab`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Update tab buttons (horizontal row)
    const tabButtons = document.querySelectorAll('.detail-tab-row');
    tabButtons.forEach(button => {
        if (button.getAttribute('data-tab') === tabName) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Initialize comments scrolling if switching to comments tab
    if (tabName === 'comments') {
        setTimeout(initializeCommentsListScrolling, 100);
    }
}

// Copy Event Link
function copyEventLink() {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
        showToast('لینک مراسم کپی شد');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showToast('خطا در کپی کردن لینک');
    });
}

// Donate Page Functions
function copyCardNumber(cardNumber) {
    // Copy to clipboard
    navigator.clipboard.writeText(cardNumber).then(() => {
        showToast('شماره کارت کپی شد');
        
        // Update button text temporarily
        const buttons = document.querySelectorAll('.copy-card-btn');
        buttons.forEach(button => {
            const span = button.querySelector('span');
            const icon = button.querySelector('i');
            
            if (button.getAttribute('onclick').includes(cardNumber)) {
                // Store original content
                const originalText = span.textContent;
                const originalIcon = icon.className;
                
                // Update to show success
                span.textContent = 'کپی شد';
                icon.className = 'fas fa-check-circle';
                
                // Revert after 2 seconds
                setTimeout(() => {
                    span.textContent = originalText;
                    icon.className = originalIcon;
                }, 2000);
            }
        });
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showToast('خطا در کپی کردن شماره کارت');
    });
}

function submitDonateForm(event) {
    event.preventDefault();
    
    // Get form values
    const amount = document.getElementById('donationAmount')?.value;
    const purpose = document.getElementById('donationPurpose')?.value;
    const phone = document.getElementById('donorPhone')?.value;
    
    // Simple validation
    if (!amount || !purpose || !phone) {
        showToast('لطفا فیلدهای الزامی را پر کنید');
        return;
    }
    
    // In a real app, this would submit to a server
    showToast(`درخواست پرداخت مبلغ ${amount} تومان ثبت شد`);
    
    // Reset form
    event.target.reset();
}

// Live Stream Function
function openLiveStream() {
    showToast('پخش زنده به زودی فعال خواهد شد');
    // In a real app, this would open a live stream modal or page
}

// Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Animation Initialization
function initializeAnimations() {
    // Add scroll animation for founder cards
    const founderCards = document.querySelectorAll('.founder-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    founderCards.forEach(card => {
        observer.observe(card);
    });
    
    // Initialize hero circle rotation
    const heroCircle = document.querySelector('.hero-circle');
    if (heroCircle) {
        heroCircle.style.animation = 'rotate 100s linear infinite';
    }
    
    // Initialize comments scrolling on event detail page
    initializeCommentsListScrolling();
}

// Event Listeners
function addEventListeners() {
    // Amount suggestions in donate form
    const amountSuggestions = document.querySelectorAll('.amount-suggestion');
    amountSuggestions.forEach(suggestion => {
        suggestion.addEventListener('click', function() {
            const amount = this.getAttribute('data-amount');
            const amountInput = document.getElementById('donationAmount');
            if (amountInput) {
                amountInput.value = amount;
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
    
    // Initialize navbar scroll state
    const navbar = document.querySelector('.navbar');
    if (navbar && window.scrollY > 20) {
        navbar.classList.add('scrolled');
    }
    
    // Initialize Aparat video responsiveness
    initializeAparatVideo();
}

// Initialize Aparat video responsiveness
function initializeAparatVideo() {
    // The Aparat embed script should handle responsiveness automatically
    // We just need to ensure the container is properly styled
    const aparatContainer = document.getElementById('36344164714');
    if (aparatContainer) {
        // Ensure proper aspect ratio
        aparatContainer.style.position = 'relative';
        aparatContainer.style.width = '100%';
        aparatContainer.style.paddingBottom = '56.25%'; // 16:9 aspect ratio
        aparatContainer.style.height = '0';
        aparatContainer.style.overflow = 'hidden';
        
        // Find and style the iframe
        const iframe = aparatContainer.querySelector('iframe');
        if (iframe) {
            iframe.style.position = 'absolute';
            iframe.style.top = '0';
            iframe.style.right = '0';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
        }
    }
}

// Initialize on page load
window.onload = function() {
    // Initialize Aparat video if present
    initializeAparatVideo();
};
// Contact Form Error Handling (sample for error display)
function showFormError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    if (field && errorElement) {
        field.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearFormErrors() {
    const errorElements = document.querySelectorAll('.field-error');
    const errorFields = document.querySelectorAll('.form-input.error, .form-select.error, .form-textarea.error');
    
    errorElements.forEach(el => el.style.display = 'none');
    errorFields.forEach(field => field.classList.remove('error'));
    
    const formError = document.getElementById('formError');
    if (formError) formError.style.display = 'none';
}

// Contact page form submission (sample error demonstration)
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactPageForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            clearFormErrors();
            
            // Sample error demonstration
            const name = document.getElementById('contactName').value;
            const phone = document.getElementById('contactPhone').value;
            const message = document.getElementById('contactMessage').value;
            
            let hasError = false;
            
            if (!name.trim()) {
                showFormError('nameError', 'لطفا نام خود را وارد کنید');
                hasError = true;
            }
            
            if (!phone.trim()) {
                showFormError('phoneError', 'لطفا شماره همراه را وارد کنید');
                hasError = true;
            } else if (!/^09\d{9}$/.test(phone)) {
                showFormError('phoneError', 'شماره همراه معتبر نیست');
                hasError = true;
            }
            
            if (!message.trim()) {
                showFormError('messageError', 'لطفا پیام خود را وارد کنید');
                hasError = true;
            }
            
            if (hasError) {
                const formError = document.getElementById('formError');
                if (formError) {
                    formError.style.display = 'flex';
                    document.getElementById('errorText').textContent = 'لطفا خطاهای فرم را بررسی کنید';
                }
            } else {
                // Form is valid - show success message
                showToast('پیام شما با موفقیت ارسال شد');
                contactForm.reset();
            }
        });
    }
})

// Gallery Functions
function initializeGallery() {
    // Get all gallery items
    galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    
    // Add click event to each gallery item
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openGalleryModal(index));
    });
    
    // Initialize filter functionality
    const filterButtons = document.querySelectorAll('.gallery-filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active filter
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter gallery items
            const filter = button.getAttribute('data-filter');
            filterGalleryItems(filter);
        });
    });
    
    // Initialize search functionality
    const searchInput = document.getElementById('gallerySearch');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase();
            searchGalleryItems(query);
        });
    }
    
    // Add keyboard navigation for modal
    document.addEventListener('keydown', function(event) {
        const modal = document.getElementById('galleryModal');
        if (!modal || !modal.classList.contains('active')) return;
        
        if (event.key === 'Escape') {
            closeGalleryModal();
        } else if (event.key === 'ArrowRight') {
            prevGalleryItem(); // RTL: Right arrow goes to previous
        } else if (event.key === 'ArrowLeft') {
            nextGalleryItem(); // RTL: Left arrow goes to next
        }
    });
}

function filterGalleryItems(filter) {
    const searchQuery = document.getElementById('gallerySearch').value.toLowerCase();
    let visibleItems = 0;
    
    galleryItems.forEach(item => {
        const itemType = item.getAttribute('data-type');
        const itemTitle = item.getAttribute('data-title').toLowerCase();
        
        const matchesFilter = filter === 'all' || itemType === filter;
        const matchesSearch = searchQuery === '' || itemTitle.includes(searchQuery);
        
        if (matchesFilter && matchesSearch) {
            item.style.display = 'block';
            visibleItems++;
            
            // Add animation
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
                item.style.transition = 'opacity 0.5s, transform 0.5s';
            }, 10);
        } else {
            item.style.display = 'none';
        }
    });
    
    // Show/hide empty state
    const emptyState = document.getElementById('galleryEmpty');
    if (visibleItems === 0) {
        emptyState.style.display = 'flex';
    } else {
        emptyState.style.display = 'none';
    }
}

function searchGalleryItems(query) {
    const activeFilter = document.querySelector('.gallery-filter-btn.active').getAttribute('data-filter');
    filterGalleryItems(activeFilter);
}

function openGalleryModal(index) {
    currentGalleryItemIndex = index;
    const modal = document.getElementById('galleryModal');
    const modalContent = document.getElementById('modalContent');
    const modalTitle = document.getElementById('modalTitle');
    const modalTag = document.getElementById('modalTag');
    
    if (!galleryItems[index]) return;
    
    const item = galleryItems[index];
    const itemType = item.getAttribute('data-type');
    const itemTitle = item.getAttribute('data-title');
    
    // Clear previous content
    modalContent.innerHTML = '';
    
    // Create content based on type
    if (itemType === 'image') {
        const img = item.querySelector('img');
        const modalImg = document.createElement('img');
        modalImg.src = img.src;
        modalImg.alt = itemTitle;
        modalContent.appendChild(modalImg);
    } else if (itemType === 'video') {
        const iframe = document.createElement('iframe');
        // In a real app, you would extract the video ID from the data
        iframe.src = `https://www.youtube.com/embed/ABC123`;
        iframe.allowFullscreen = true;
        iframe.title = itemTitle;
        modalContent.appendChild(iframe);
    }
    
    // Update title and tag
    modalTitle.textContent = itemTitle;
    modalTag.textContent = itemType === 'image' ? 'تصویر' : 'ویدیو';
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeGalleryModal() {
    const modal = document.getElementById('galleryModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function nextGalleryItem() {
    // Get filtered items
    const activeFilter = document.querySelector('.gallery-filter-btn.active').getAttribute('data-filter');
    const searchQuery = document.getElementById('gallerySearch').value.toLowerCase();
    
    const filteredItems = galleryItems.filter((item, index) => {
        const itemType = item.getAttribute('data-type');
        const itemTitle = item.getAttribute('data-title').toLowerCase();
        
        const matchesFilter = activeFilter === 'all' || itemType === activeFilter;
        const matchesSearch = searchQuery === '' || itemTitle.includes(searchQuery);
        
        return matchesFilter && matchesSearch && item.style.display !== 'none';
    });
    
    if (filteredItems.length === 0) return;
    
    // Find current item index in filtered list
    const currentItem = galleryItems[currentGalleryItemIndex];
    let currentFilteredIndex = filteredItems.indexOf(currentItem);
    
    // Move to next item
    currentFilteredIndex = (currentFilteredIndex + 1) % filteredItems.length;
    
    // Find original index of next item
    const nextItem = filteredItems[currentFilteredIndex];
    const nextIndex = galleryItems.indexOf(nextItem);
    
    // Open modal with next item
    openGalleryModal(nextIndex);
}

function prevGalleryItem() {
    // Get filtered items
    const activeFilter = document.querySelector('.gallery-filter-btn.active').getAttribute('data-filter');
    const searchQuery = document.getElementById('gallerySearch').value.toLowerCase();
    
    const filteredItems = galleryItems.filter((item, index) => {
        const itemType = item.getAttribute('data-type');
        const itemTitle = item.getAttribute('data-title').toLowerCase();
        
        const matchesFilter = activeFilter === 'all' || itemType === activeFilter;
        const matchesSearch = searchQuery === '' || itemTitle.includes(searchQuery);
        
        return matchesFilter && matchesSearch && item.style.display !== 'none';
    });
    
    if (filteredItems.length === 0) return;
    
    // Find current item index in filtered list
    const currentItem = galleryItems[currentGalleryItemIndex];
    let currentFilteredIndex = filteredItems.indexOf(currentItem);
    
    // Move to previous item
    currentFilteredIndex = (currentFilteredIndex - 1 + filteredItems.length) % filteredItems.length;
    
    // Find original index of previous item
    const prevItem = filteredItems[currentFilteredIndex];
    const prevIndex = galleryItems.indexOf(prevItem);
    
    // Open modal with previous item
    openGalleryModal(prevIndex);
}
// Add global variables at the top with other globals
let galleryItems = [];
let currentGalleryItemIndex = 0;

// In the DOMContentLoaded event listener, add gallery initialization
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    
    // Initialize gallery if on home page
    if (document.querySelector('.gallery-section')) {
        initializeGallery();
    }
    
    // ... existing code ...
});

// Fix the initializeGallery function - add missing variable definitions and call it properly
function initializeGallery() {
    // Get all gallery items
    galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    
    // Add click event to each gallery item
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openGalleryModal(index));
    });
    
    // Initialize filter functionality
    const filterButtons = document.querySelectorAll('.gallery-filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active filter
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter gallery items
            const filter = button.getAttribute('data-filter');
            filterGalleryItems(filter);
        });
    });
    
    // Initialize search functionality
    const searchInput = document.getElementById('gallerySearch');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase();
            searchGalleryItems(query);
        });
    }
    
    // Add keyboard navigation for modal
    document.addEventListener('keydown', function(event) {
        const modal = document.getElementById('galleryModal');
        if (!modal || !modal.classList.contains('active')) return;
        
        if (event.key === 'Escape') {
            closeGalleryModal();
        } else if (event.key === 'ArrowRight') {
            prevGalleryItem(); // RTL: Right arrow goes to previous
        } else if (event.key === 'ArrowLeft') {
            nextGalleryItem(); // RTL: Left arrow goes to next
        }
    });
}

// Fix filterGalleryItems to properly show/hide items
function filterGalleryItems(filter) {
    const searchInput = document.getElementById('gallerySearch');
    const searchQuery = searchInput ? searchInput.value.toLowerCase() : '';
    let visibleItems = 0;
    
    galleryItems.forEach(item => {
        const itemType = item.getAttribute('data-type');
        const itemTitle = item.getAttribute('data-title').toLowerCase();
        
        const matchesFilter = filter === 'all' || itemType === filter;
        const matchesSearch = searchQuery === '' || itemTitle.includes(searchQuery);
        
        if (matchesFilter && matchesSearch) {
            item.style.display = 'block';
            visibleItems++;
            
            // Add animation
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
                item.style.transition = 'opacity 0.5s, transform 0.5s';
            }, 10);
        } else {
            item.style.display = 'none';
        }
    });
    
    // Show/hide empty state
    const emptyState = document.getElementById('galleryEmpty');
    if (emptyState) {
        if (visibleItems === 0) {
            emptyState.style.display = 'flex';
        } else {
            emptyState.style.display = 'none';
        }
    }
}

// Fix searchGalleryItems function
function searchGalleryItems(query) {
    const activeFilterBtn = document.querySelector('.gallery-filter-btn.active');
    const activeFilter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
    filterGalleryItems(activeFilter);
}

// Fix openGalleryModal function - improve video handling
function openGalleryModal(index) {
    currentGalleryItemIndex = index;
    const modal = document.getElementById('galleryModal');
    const modalContent = document.getElementById('modalContent');
    const modalTitle = document.getElementById('modalTitle');
    const modalTag = document.getElementById('modalTag');
    
    if (!galleryItems[index]) return;
    
    const item = galleryItems[index];
    const itemType = item.getAttribute('data-type');
    const itemTitle = item.getAttribute('data-title');
    
    // Clear previous content
    if (modalContent) {
        modalContent.innerHTML = '';
        
        // Create content based on type
        if (itemType === 'image') {
            const img = item.querySelector('img');
            const modalImg = document.createElement('img');
            modalImg.src = img.src;
            modalImg.alt = itemTitle;
            modalContent.appendChild(modalImg);
        } else if (itemType === 'video') {
            // Create a placeholder for video with play button
            const videoContainer = document.createElement('div');
            videoContainer.style.width = '100%';
            videoContainer.style.height = '100%';
            videoContainer.style.display = 'flex';
            videoContainer.style.alignItems = 'center';
            videoContainer.style.justifyContent = 'center';
            videoContainer.style.backgroundColor = '#000';
            videoContainer.style.borderRadius = '0.75rem';
            
            const playButton = document.createElement('div');
            playButton.style.width = '80px';
            playButton.style.height = '80px';
            playButton.style.borderRadius = '50%';
            playButton.style.backgroundColor = 'var(--gold)';
            playButton.style.display = 'flex';
            playButton.style.alignItems = 'center';
            playButton.style.justifyContent = 'center';
            playButton.style.cursor = 'pointer';
            
            const playIcon = document.createElement('i');
            playIcon.className = 'fas fa-play';
            playIcon.style.fontSize = '2rem';
            playIcon.style.color = 'var(--primary-green)';
            
            playButton.appendChild(playIcon);
            videoContainer.appendChild(playButton);
            
            // Add click handler to play video
            playButton.addEventListener('click', function() {
                showToast('پخش ویدیو در نسخه کامل سایت فعال خواهد شد');
            });
            
            modalContent.appendChild(videoContainer);
        }
    }
    
    // Update title and tag
    if (modalTitle) modalTitle.textContent = itemTitle;
    if (modalTag) modalTag.textContent = itemType === 'image' ? 'تصویر' : 'ویدیو';
    
    // Show modal
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Fix closeGalleryModal function
function closeGalleryModal() {
    const modal = document.getElementById('galleryModal');
    if (modal) {
        modal.classList.remove('active');
    }
    document.body.style.overflow = 'auto';
}

// Fix nextGalleryItem function - handle edge cases
function nextGalleryItem() {
    // Get filtered items
    const activeFilterBtn = document.querySelector('.gallery-filter-btn.active');
    const activeFilter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
    const searchInput = document.getElementById('gallerySearch');
    const searchQuery = searchInput ? searchInput.value.toLowerCase() : '';
    
    const filteredItems = galleryItems.filter((item, index) => {
        const itemType = item.getAttribute('data-type');
        const itemTitle = item.getAttribute('data-title').toLowerCase();
        
        const matchesFilter = activeFilter === 'all' || itemType === activeFilter;
        const matchesSearch = searchQuery === '' || itemTitle.includes(searchQuery);
        
        return matchesFilter && matchesSearch && item.style.display !== 'none';
    });
    
    if (filteredItems.length === 0) return;
    
    // Find current item index in filtered list
    const currentItem = galleryItems[currentGalleryItemIndex];
    let currentFilteredIndex = filteredItems.indexOf(currentItem);
    
    // If current item not in filtered list (e.g., after search), start from beginning
    if (currentFilteredIndex === -1) {
        currentFilteredIndex = 0;
    } else {
        // Move to next item
        currentFilteredIndex = (currentFilteredIndex + 1) % filteredItems.length;
    }
    
    // Find original index of next item
    const nextItem = filteredItems[currentFilteredIndex];
    const nextIndex = galleryItems.indexOf(nextItem);
    
    // Open modal with next item
    openGalleryModal(nextIndex);
}

// Fix prevGalleryItem function - handle edge cases
function prevGalleryItem() {
    // Get filtered items
    const activeFilterBtn = document.querySelector('.gallery-filter-btn.active');
    const activeFilter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
    const searchInput = document.getElementById('gallerySearch');
    const searchQuery = searchInput ? searchInput.value.toLowerCase() : '';
    
    const filteredItems = galleryItems.filter((item, index) => {
        const itemType = item.getAttribute('data-type');
        const itemTitle = item.getAttribute('data-title').toLowerCase();
        
        const matchesFilter = activeFilter === 'all' || itemType === activeFilter;
        const matchesSearch = searchQuery === '' || itemTitle.includes(searchQuery);
        
        return matchesFilter && matchesSearch && item.style.display !== 'none';
    });
    
    if (filteredItems.length === 0) return;
    
    // Find current item index in filtered list
    const currentItem = galleryItems[currentGalleryItemIndex];
    let currentFilteredIndex = filteredItems.indexOf(currentItem);
    
    // If current item not in filtered list (e.g., after search), start from end
    if (currentFilteredIndex === -1) {
        currentFilteredIndex = filteredItems.length - 1;
    } else {
        // Move to previous item
        currentFilteredIndex = (currentFilteredIndex - 1 + filteredItems.length) % filteredItems.length;
    }
    
    // Find original index of previous item
    const prevItem = filteredItems[currentFilteredIndex];
    const prevIndex = galleryItems.indexOf(prevItem);
    
    // Open modal with previous item
    openGalleryModal(prevIndex);
};

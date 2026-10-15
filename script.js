document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation & Mobile Menu with Custom Scroll Popup Behavior
    const navbarWrapper = document.querySelector('.navbar-wrapper');
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    let lastScrollY = window.scrollY;
    const scrollThreshold = 6;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Background styling change when scrolled
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Custom User Requirement:
        // - When scrolling UP: Navbar scrolls up and hides away
        // - When scrolling DOWN: Navbar comes as a popup
        if (currentScrollY <= 30) {
            // At the top of the page (hero view): Keep in resting position
            navbarWrapper.classList.remove('nav-hidden');
            navbarWrapper.classList.remove('nav-popup');
        } else if (currentScrollY > lastScrollY + scrollThreshold) {
            // SCROLLING DOWN: Navbar pops up into view!
            if (navbarWrapper.classList.contains('nav-hidden') || !navbarWrapper.classList.contains('nav-popup')) {
                navbarWrapper.classList.remove('nav-hidden');
                navbarWrapper.classList.add('nav-popup');
            }
        } else if (currentScrollY < lastScrollY - scrollThreshold) {
            // SCROLLING UP: Navbar scrolls up and hides away!
            if (!mobileMenu.classList.contains('active')) {
                navbarWrapper.classList.remove('nav-popup');
                navbarWrapper.classList.add('nav-hidden');
            }
        }

        lastScrollY = currentScrollY;
    }, { passive: true });

    function closeMobileMenu() {
        if (!mobileMenu || !mobileMenu.classList.contains('active')) return;
        mobileMenu.classList.remove('active');
        if (mobileMenuBtn) {
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }

    function toggleMobileMenu() {
        if (!mobileMenu || !mobileMenuBtn) return;
        const isOpen = mobileMenu.classList.toggle('active');
        mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        navbarWrapper.classList.remove('nav-hidden');

        // Animate hamburger icon
        const spans = mobileMenuBtn.querySelectorAll('span');
        if (isOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                closeMobileMenu();
            }
        }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });

    // 2. Set Footer Year
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // 3. Room Gallery — grouped cards with mini sliders
    const ICONS = {
        exterior: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V21a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 22V12h6v10"/></svg>`,
        living: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="8" width="20" height="10" rx="3"/><path d="M6 8V6a2 2 0 012-2h8a2 2 0 012 2v2"/><line x1="2" y1="18" x2="2" y2="21"/><line x1="22" y1="18" x2="22" y2="21"/></svg>`,
        dining: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="3" x2="8" y2="10"/><path d="M6 3v5a4 4 0 004 4v9"/><line x1="16" y1="3" x2="16" y2="21"/></svg>`,
        bed: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 012 2v8"/><path d="M2 17h20"/><path d="M6 8v-4"/><rect x="6" y="4" width="5" height="4" rx="1"/></svg>`,
        kitchen: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6a4 4 0 00-4 4v2H4v-2a4 4 0 00-4-4"/><rect x="2" y="12" width="20" height="8" rx="2"/><line x1="12" y1="12" x2="12" y2="20"/></svg>`,
        bath: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1Z"/><path d="M6 12V5a2 2 0 0 1 2-2h3v2"/><line x1="7" y1="20" x2="7" y2="22"/><line x1="17" y1="20" x2="17" y2="22"/></svg>`
    };

    const roomGallery = [
        {
            name: 'Exterior',
            icon: ICONS.exterior,
            images: [
                { src: 'public/images/exterior/main-new.jpeg', alt: 'Grace 3BHK Homestay — Front Villa Facade in Fort Kochi' },
                { src: 'public/images/exterior/main-building.jpg', alt: 'Grace 3BHK Homestay — Exterior Architecture View' }
            ]
        },
        {
            name: 'Living Room',
            icon: ICONS.living,
            images: [
                { src: 'public/images/rooms/living-room.jpg', alt: 'Grace 3BHK Homestay — Spacious Living Lounge' },
                { src: 'public/images/rooms/living-room-2.jpg', alt: 'Grace 3BHK Homestay — Living Area Ambient Seating' }
            ]
        },
        {
            name: 'Dining Room',
            icon: ICONS.dining,
            images: [
                { src: 'public/images/rooms/dining-room.jpg', alt: 'Grace 3BHK Homestay — Dining Room Table & Seating' }
            ]
        },
        {
            name: 'Bedroom 1',
            icon: ICONS.bed,
            images: [
                { src: 'public/images/rooms/bedroom-1.jpg', alt: 'Grace 3BHK Homestay — Bedroom 1 AC Suite' }
            ]
        },
        {
            name: 'Bedroom 2',
            icon: ICONS.bed,
            images: [
                { src: 'public/images/rooms/bedroom-2.jpg', alt: 'Grace 3BHK Homestay — Bedroom 2 AC Room' }
            ]
        },
        {
            name: 'Bedroom 3',
            icon: ICONS.bed,
            images: [
                { src: 'public/images/rooms/bedroom-3.jpg', alt: 'Grace 3BHK Homestay — Bedroom 3 AC Room' }
            ]
        },
        {
            name: 'Kitchen',
            icon: ICONS.kitchen,
            images: [
                { src: 'public/images/amenities/kitchen.jpg', alt: 'Grace 3BHK Homestay — Fully Equipped Kitchen with Cookware' }
            ]
        },
        {
            name: 'Bathrooms',
            icon: ICONS.bath,
            images: [
                { src: 'public/images/rooms/bathroom-1.jpg', alt: 'Grace 3BHK Homestay — Clean Bathroom with Overhead Shower & Washbasin' },
                { src: 'public/images/rooms/bathroom-2.jpg', alt: 'Grace 3BHK Homestay — Modern Ensuite Bathroom with Shower & Fixtures' }
            ]
        }
    ];

    // Flat list for lightbox (all images across all rooms)
    const allImages = roomGallery.flatMap(r => r.images);

    // Build the flat SVG placeholder
    function placeholderSvg(label) {
        return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="#151515"/><text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" fill="#B8B3A7" font-family="sans-serif" font-size="16">Image Coming Soon</text><text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" fill="#D4AF37" font-family="serif" font-size="20">${label}</text></svg>`
        );
    }

    // Render all room cards
    const roomCardsGrid = document.getElementById('room-cards-grid');
    if (roomCardsGrid) {
        roomGallery.forEach((room) => {
            let currentSlide = 0;

            const card = document.createElement('div');
            card.className = 'room-card';

            // Header
            const header = document.createElement('div');
            header.className = 'room-card-header';
            header.innerHTML = `<span class="room-icon">${room.icon}</span><span class="room-name">${room.name}</span>`;

            // Slider wrapper
            const slider = document.createElement('div');
            slider.className = 'room-slider';

            // Image strip
            const strip = document.createElement('div');
            strip.className = 'room-slider-strip';

            room.images.forEach((imgData, i) => {
                const imgEl = document.createElement('img');
                imgEl.src = imgData.src;
                imgEl.alt = imgData.alt;
                imgEl.loading = 'lazy';
                imgEl.className = 'room-slide-img';
                imgEl.onerror = function () {
                    this.onerror = null;
                    this.src = placeholderSvg(imgData.alt);
                };
                // Find global index for lightbox
                const globalIdx = allImages.findIndex(x => x.src === imgData.src);
                imgEl.addEventListener('click', () => openLightbox(globalIdx));
                strip.appendChild(imgEl);
            });

            slider.appendChild(strip);

            // Counter badge
            const counter = document.createElement('div');
            counter.className = 'room-slide-counter';
            counter.textContent = room.images.length > 1 ? `1 / ${room.images.length}` : '';

            // Prev / Next (only if multiple images)
            if (room.images.length > 1) {
                const prevBtn = document.createElement('button');
                prevBtn.className = 'room-slide-btn room-slide-prev';
                prevBtn.innerHTML = '&#8249;';
                prevBtn.setAttribute('aria-label', 'Previous photo');

                const nextBtn = document.createElement('button');
                nextBtn.className = 'room-slide-btn room-slide-next';
                nextBtn.innerHTML = '&#8250;';
                nextBtn.setAttribute('aria-label', 'Next photo');

                function goTo(n) {
                    currentSlide = (n + room.images.length) % room.images.length;
                    strip.style.transform = `translateX(-${currentSlide * 100}%)`;
                    counter.textContent = `${currentSlide + 1} / ${room.images.length}`;
                }

                prevBtn.addEventListener('click', (e) => { e.stopPropagation(); goTo(currentSlide - 1); });
                nextBtn.addEventListener('click', (e) => { e.stopPropagation(); goTo(currentSlide + 1); });

                slider.appendChild(prevBtn);
                slider.appendChild(nextBtn);
            }

            slider.appendChild(counter);

            card.appendChild(header);
            card.appendChild(slider);
            roomCardsGrid.appendChild(card);
        });
    }

    // Image fallback for non-gallery images
    const otherImages = document.querySelectorAll('img:not(.room-slide-img):not(.hero-bg img):not(.brand img)');
    otherImages.forEach(img => {
        img.onerror = function () {
            this.onerror = null;
            this.src = placeholderSvg(img.alt || 'Image');
        };
    });

    const heroImg = document.querySelector('.hero-bg img');
    if (heroImg) {
        heroImg.onerror = function () { this.style.display = 'none'; };
    }

    // 4. Lightbox Logic (works across all room images)
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('.lightbox-img');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const lightboxClose = lightbox.querySelector('.lightbox-close');
        const lightboxPrev = lightbox.querySelector('.lightbox-prev');
        const lightboxNext = lightbox.querySelector('.lightbox-next');
        let currentImageIndex = 0;

        function openLightbox(index) {
            currentImageIndex = index;
            updateLightboxImage();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        function updateLightboxImage() {
            const image = allImages[currentImageIndex];
            if (!image) return;
            const tempImg = new Image();
            tempImg.onload = () => { lightboxImg.src = image.src; };
            tempImg.onerror = () => { lightboxImg.src = placeholderSvg(image.alt); };
            tempImg.src = image.src;
            lightboxImg.alt = image.alt;
            lightboxCaption.textContent = image.alt;
        }

        function showNext() {
            currentImageIndex = (currentImageIndex + 1) % allImages.length;
            updateLightboxImage();
        }

        function showPrev() {
            currentImageIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
            updateLightboxImage();
        }

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxNext) lightboxNext.addEventListener('click', showNext);
        if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        });
    }


    // 5. Custom Calendar Date Picker
    function buildCalendar(config) {
        const {
            displayId, calendarId, daysId, monthYearId,
            prevId, nextId, hiddenInputId, textId,
            getMinDate, onSelect
        } = config;

        const display = document.getElementById(displayId);
        const calendar = document.getElementById(calendarId);
        const daysEl = document.getElementById(daysId);
        const monthYearEl = document.getElementById(monthYearId);
        const prevBtn = document.getElementById(prevId);
        const nextBtn = document.getElementById(nextId);
        const hiddenInput = document.getElementById(hiddenInputId);
        const textEl = document.getElementById(textId);

        if (!display || !calendar) return;

        const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

        let viewDate = new Date();
        let selectedDate = null;

        function toYMD(d) {
            return d.getFullYear() + '-' +
                String(d.getMonth() + 1).padStart(2, '0') + '-' +
                String(d.getDate()).padStart(2, '0');
        }

        function formatDisplay(d) {
            return d.getDate() + ' ' + MONTHS[d.getMonth()].slice(0, 3) + ' ' + d.getFullYear();
        }

        function renderGrid() {
            monthYearEl.textContent = MONTHS[viewDate.getMonth()] + ' ' + viewDate.getFullYear();
            daysEl.innerHTML = '';

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const minDate = getMinDate ? getMinDate() : today;

            const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
            const lastDay = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
            const startWeekday = firstDay.getDay();

            // Empty cells before start
            for (let i = 0; i < startWeekday; i++) {
                const empty = document.createElement('div');
                empty.className = 'cal-day empty';
                daysEl.appendChild(empty);
            }

            for (let d = 1; d <= lastDay.getDate(); d++) {
                const dayDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
                dayDate.setHours(0, 0, 0, 0);
                const cell = document.createElement('div');
                cell.className = 'cal-day';
                cell.textContent = d;

                if (dayDate < minDate) {
                    cell.classList.add('disabled');
                }
                if (toYMD(dayDate) === toYMD(today)) {
                    cell.classList.add('today');
                }
                if (selectedDate && toYMD(dayDate) === toYMD(selectedDate)) {
                    cell.classList.add('selected');
                }

                if (!cell.classList.contains('disabled')) {
                    cell.addEventListener('click', () => {
                        selectedDate = dayDate;
                        hiddenInput.value = toYMD(dayDate);
                        textEl.textContent = formatDisplay(dayDate);
                        textEl.classList.add('has-value');
                        closeCalendar();
                        if (onSelect) onSelect(dayDate);
                    });
                }

                daysEl.appendChild(cell);
            }
        }

        function openCalendar() {
            // Close any other open calendars
            document.querySelectorAll('.calendar-popup.open').forEach(c => {
                if (c !== calendar) c.classList.remove('open');
            });
            document.querySelectorAll('.date-display-field.active').forEach(f => {
                if (f !== display) f.classList.remove('active');
            });
            viewDate = selectedDate ? new Date(selectedDate) : new Date();
            renderGrid();
            calendar.classList.toggle('open');
            display.classList.toggle('active', calendar.classList.contains('open'));
        }

        function closeCalendar() {
            calendar.classList.remove('open');
            display.classList.remove('active');
        }

        display.addEventListener('click', openCalendar);
        display.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCalendar(); }
        });

        prevBtn.addEventListener('click', e => {
            e.stopPropagation();
            viewDate.setMonth(viewDate.getMonth() - 1);
            renderGrid();
        });

        nextBtn.addEventListener('click', e => {
            e.stopPropagation();
            viewDate.setMonth(viewDate.getMonth() + 1);
            renderGrid();
        });

        // Close on outside click
        document.addEventListener('click', e => {
            if (!display.contains(e.target) && !calendar.contains(e.target)) {
                closeCalendar();
            }
        });

        return {
            getSelected: () => selectedDate,
            getHiddenValue: () => hiddenInput.value,
            setMinDate: () => renderGrid()
        };
    }

    // Instantiate Check-in Calendar
    const checkinPicker = buildCalendar({
        displayId: 'checkin-display',
        calendarId: 'checkin-calendar',
        daysId: 'checkin-days',
        monthYearId: 'checkin-month-year',
        prevId: 'checkin-prev',
        nextId: 'checkin-next',
        hiddenInputId: 'check-in',
        textId: 'checkin-text',
        getMinDate: () => { const t = new Date(); t.setHours(0, 0, 0, 0); return t; },
        onSelect: () => {
            // When check-in changes, refresh checkout min and re-render
            const checkoutInput = document.getElementById('check-out');
            const checkinVal = document.getElementById('check-in').value;
            if (checkoutInput && checkoutInput.value && checkinVal) {
                if (checkoutInput.value <= checkinVal) {
                    checkoutInput.value = '';
                    const checkoutText = document.getElementById('checkout-text');
                    if (checkoutText) {
                        checkoutText.textContent = 'Select date';
                        checkoutText.classList.remove('has-value');
                    }
                }
            }
            if (checkoutPicker) checkoutPicker.setMinDate();
        }
    });

    // Instantiate Check-out Calendar
    const checkoutPicker = buildCalendar({
        displayId: 'checkout-display',
        calendarId: 'checkout-calendar',
        daysId: 'checkout-days',
        monthYearId: 'checkout-month-year',
        prevId: 'checkout-prev',
        nextId: 'checkout-next',
        hiddenInputId: 'check-out',
        textId: 'checkout-text',
        getMinDate: () => {
            const checkinVal = document.getElementById('check-in').value;
            if (checkinVal) {
                const parts = checkinVal.split('-');
                if (parts.length === 3) {
                    const minOut = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
                    minOut.setDate(minOut.getDate() + 1);
                    minOut.setHours(0, 0, 0, 0);
                    return minOut;
                }
            }
            const t = new Date(); t.setHours(0, 0, 0, 0); return t;
        }
    });

    // 6. WhatsApp Enquiry Form Logic
    const form = document.getElementById('enquiry-form');
    if (form) {
        const checkInInput = document.getElementById('check-in');
        const checkOutInput = document.getElementById('check-out');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const checkIn = document.getElementById('check-in').value;
            const checkOut = document.getElementById('check-out').value;
            const guests = document.getElementById('guests').value;
            const message = document.getElementById('message').value.trim();

            if (!name || !phone || !checkIn || !checkOut || !guests) {
                alert('Please fill in all required fields, including your check-in and check-out dates.');
                return;
            }

            if (checkOut <= checkIn) {
                alert('Check-out date must be after check-in date.');
                return;
            }

            // Format dates nicely for message (pure string parsing avoids timezone shifts)
            const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            function prettyDate(ymd) {
                if (!ymd) return '';
                const parts = ymd.split('-');
                if (parts.length === 3) {
                    const year = parts[0];
                    const monthIdx = parseInt(parts[1], 10) - 1;
                    const day = parseInt(parts[2], 10);
                    if (monthIdx >= 0 && monthIdx < 12) {
                        return `${day} ${MONTHS[monthIdx]} ${year}`;
                    }
                }
                return ymd;
            }

            const ownerWhatsApp = "919497477335";

            let waMessage = `Hello! I would like to enquire about staying at Grace 3BHK Homestay in Fort Kochi.\n\n`;
            waMessage += `Name: ${name}\n`;
            waMessage += `Phone: ${phone}\n`;
            waMessage += `Check-in: ${prettyDate(checkIn)}\n`;
            waMessage += `Check-out: ${prettyDate(checkOut)}\n`;
            waMessage += `Guests: ${guests}\n`;
            if (message) {
                waMessage += `Message: ${message}\n`;
            }
            waMessage += `\nCould you please share the availability and rates for these dates? Thank you!`;

            const encodedMessage = encodeURIComponent(waMessage);
            const waUrl = `https://wa.me/${ownerWhatsApp.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;

            if (ownerWhatsApp.includes('[') || ownerWhatsApp.replace(/[^0-9]/g, '').length < 10) {
                alert(`Ready to send!\n\n(Please update the [Owner's Number] in script.js with the actual WhatsApp phone number.)\n\nMessage preview:\n${waMessage}`);
            } else {
                window.open(waUrl, '_blank', 'noopener,noreferrer');
            }
        });
    }
});

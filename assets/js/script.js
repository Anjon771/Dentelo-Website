/**
 * Dentelo - Dental Clinic Interactive Script
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /**
   * Helper: add event listener to element or list
   */
  const addEventOnElem = function (elements, type, callback) {
    if (!elements) return;
    if (elements.length !== undefined && !elements.addEventListener) {
      for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener(type, callback);
      }
    } else {
      elements.addEventListener(type, callback);
    }
  };

  /**
   * Mobile Navigation Toggle
   */
  const navbar = document.querySelector('[data-navbar]');
  const navbarLinks = document.querySelectorAll('[data-nav-link]');
  const navbarToggler = document.querySelector('[data-nav-toggler]');

  if (navbarToggler && navbar) {
    const toggleNav = function () {
      navbar.classList.toggle('active');
      navbarToggler.classList.toggle('active');
    };

    navbarToggler.addEventListener('click', toggleNav);

    const closeNav = function () {
      navbar.classList.remove('active');
      navbarToggler.classList.remove('active');
    };

    addEventOnElem(navbarLinks, 'click', closeNav);

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && !navbarToggler.contains(e.target) && navbar.classList.contains('active')) {
        closeNav();
      }
    });
  }

  /**
   * Header Sticky State & Back to Top Button
   */
  const header = document.querySelector('[data-header]');
  const backTopBtn = document.querySelector('[data-back-top-btn]');

  window.addEventListener('scroll', function () {
    const scrollPos = window.scrollY;

    if (header) {
      if (scrollPos >= 60) {
        header.classList.add('active');
      } else {
        header.classList.remove('active');
      }
    }

    if (backTopBtn) {
      if (scrollPos >= 300) {
        backTopBtn.classList.add('active');
      } else {
        backTopBtn.classList.remove('active');
      }
    }
  });

  if (backTopBtn) {
    backTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /**
   * Toast Notification Manager
   */
  const toastContainer = document.getElementById('toast-container');

  function showToast(message, iconName = 'checkmark-circle') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <ion-icon name="${iconName}"></ion-icon>
      <div class="toast-message">${message}</div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  window.showToast = showToast;

  /**
   * Doctor Slider Navigation Buttons
   */
  const doctorScrollbar = document.getElementById('doctor-scrollbar');
  const prevDoctorBtn = document.getElementById('prev-doctor-btn');
  const nextDoctorBtn = document.getElementById('next-doctor-btn');

  if (doctorScrollbar && prevDoctorBtn && nextDoctorBtn) {
    prevDoctorBtn.addEventListener('click', () => {
      doctorScrollbar.scrollBy({ left: -320, behavior: 'smooth' });
    });

    nextDoctorBtn.addEventListener('click', () => {
      doctorScrollbar.scrollBy({ left: 320, behavior: 'smooth' });
    });
  }

  /**
   * Services Category Filtering
   */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('[data-service-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const categories = card.getAttribute('data-service-category').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /**
   * FAQ Accordion
   */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    const answer = item.querySelector('.faq-answer');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other open faqs
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  /**
   * Appointment Booking Modal
   */
  const modalOverlay = document.getElementById('appointment-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const appointmentForm = document.getElementById('appointment-form');
  const bookingSuccessView = document.getElementById('booking-success-view');
  const finishBookingBtn = document.getElementById('finish-booking-btn');

  const openModalBtns = document.querySelectorAll('[data-open-modal]');

  function openAppointmentModal(service = '', doctor = '') {
    if (!modalOverlay) return;

    // Reset view
    if (appointmentForm) appointmentForm.style.display = 'block';
    if (bookingSuccessView) bookingSuccessView.style.display = 'none';

    // Pre-fill fields if passed
    const serviceSelect = document.getElementById('modal-service-select');
    const doctorSelect = document.getElementById('modal-doctor-select');

    if (serviceSelect && service) {
      serviceSelect.value = service;
    }
    if (doctorSelect && doctor) {
      doctorSelect.value = doctor;
    }

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeAppointmentModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service') || '';
      const doctor = btn.getAttribute('data-doctor') || '';
      openAppointmentModal(service, doctor);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeAppointmentModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeAppointmentModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeAppointmentModal();
    }
  });

  // Time slot buttons
  const timeSlotBtns = document.querySelectorAll('.time-slot-btn');
  let selectedTimeSlot = 'Morning (9:00 AM - 12:00 PM)';

  timeSlotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeSlotBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedTimeSlot = btn.getAttribute('data-slot');
    });
  });

  // Handle appointment form submission
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('patient-name')?.value || 'Guest Patient';
      const phone = document.getElementById('patient-phone')?.value || '+91-7052-101-786';
      const service = document.getElementById('modal-service-select')?.value || 'General Consultation';
      const doctor = document.getElementById('modal-doctor-select')?.value || 'Next Available Specialist';
      const date = document.getElementById('appointment-date')?.value || new Date().toISOString().split('T')[0];

      const submitBtn = appointmentForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Scheduling Appointment...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        // Populate receipt
        const bookingId = 'DEN-' + Math.floor(1000 + Math.random() * 9000);
        document.getElementById('receipt-id').textContent = bookingId;
        document.getElementById('receipt-patient').textContent = name;
        document.getElementById('receipt-service').textContent = service;
        document.getElementById('receipt-doctor').textContent = doctor;
        document.getElementById('receipt-date').textContent = `${date} (${selectedTimeSlot.split(' ')[0]})`;

        appointmentForm.style.display = 'none';
        if (bookingSuccessView) {
          bookingSuccessView.style.display = 'block';
        }

        showToast(`Appointment confirmed! Booking ID: ${bookingId}`, 'calendar-outline');
      }, 700);
    });
  }

  if (finishBookingBtn) {
    finishBookingBtn.addEventListener('click', () => {
      closeAppointmentModal();
      if (appointmentForm) appointmentForm.reset();
    });
  }

  /**
   * Hero & CTA Callback Quick Forms
   */
  const callbackForms = document.querySelectorAll('.hero-form, .cta-form');

  callbackForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"], input[type="tel"]');
      const val = input ? input.value : '';

      showToast('Thank you! Our dental care team will call you within 15 minutes.', 'call-outline');
      if (input) input.value = '';
    });
  });

});

/* ==========================================================================
   Aqari Jeddah - Main JavaScript
   Arabic RTL Smart Real Estate Platform
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- Dark Mode ---------- */
  const html = document.documentElement;
  const themeToggle = document.querySelector('.theme-toggle');
  const sunIcon = document.querySelector('.theme-toggle .icon-sun');
  const moonIcon = document.querySelector('.theme-toggle .icon-moon');

  function setTheme(dark) {
    if (dark) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
    }
  }

  // Initialize theme from localStorage or system preference
  (function initTheme() {
    var saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      setTheme(true);
    } else if (saved === 'light') {
      setTheme(false);
    } else {
      // Fallback to system preference
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark);
    }
  })();

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var isDark = html.classList.contains('dark');
      setTheme(!isDark);
    });
  }

  /* ---------- Scroll Reveal ---------- */
  var revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---------- Animated Counters ---------- */
  var counterElements = document.querySelectorAll('[data-counter]');

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-counter'));
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var duration = 2000;
    var startTime = null;
    var isFloat = target % 1 !== 0;

    function update(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var easedProgress = easeOutQuart(progress);
      var current = easedProgress * target;

      if (isFloat) {
        el.textContent = prefix + current.toFixed(1).toLocaleString('ar-SA') + suffix;
      } else {
        el.textContent = prefix + Math.floor(current).toLocaleString('ar-SA') + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        // Set final value
        if (isFloat) {
          el.textContent = prefix + target.toFixed(1).toLocaleString('ar-SA') + suffix;
        } else {
          el.textContent = prefix + target.toLocaleString('ar-SA') + suffix;
        }
      }
    }

    requestAnimationFrame(update);
  }

  if (counterElements.length > 0 && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    counterElements.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  /* ---------- Navbar Scroll Effect ---------- */
  var navbar = document.querySelector('.navbar');

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Run on load

  /* ---------- Active Section Highlighting ---------- */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a');

  if (sections.length > 0 && navLinks.length > 0 && 'IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute('id');
            navLinks.forEach(function (link) {
              link.classList.remove('active');
              if (link.getAttribute('href') === '#' + id) {
                link.classList.add('active');
              }
            });
          }
        });
      },
      { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  /* ---------- Smooth Scroll ---------- */
  var smoothLinks = document.querySelectorAll('a[href^="#"]');

  smoothLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (href === '#') return;

      var targetEl = document.querySelector(href);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });

        // Close mobile menu after click
        var mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu) {
          mobileMenu.classList.remove('open');
        }
      }
    });
  });

  /* ---------- Mobile Menu Toggle ---------- */
  var mobileToggle = document.querySelector('.mobile-toggle');
  var mobileMenu = document.querySelector('.mobile-menu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      mobileMenu.classList.toggle('open');
    });

    // Close on window resize > 1024px
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1024) {
        mobileMenu.classList.remove('open');
      }
    });

    // Close on click outside
    document.addEventListener('click', function (e) {
      if (!mobileMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileMenu.classList.remove('open');
      }
    });
  }

  /* ---------- Pricing Toggle ---------- */
  var toggleSwitch = document.querySelector('.toggle-switch');
  var toggleLabels = document.querySelectorAll('.pricing-toggle span');
  var pricingAmounts = document.querySelectorAll('.amount');

  if (toggleSwitch) {
    toggleSwitch.addEventListener('click', function () {
      toggleSwitch.classList.toggle('active');

      var isYearly = toggleSwitch.classList.contains('active');

      // Toggle active label
      toggleLabels.forEach(function (label) {
        label.classList.toggle('active');
      });

      // Swap prices
      pricingAmounts.forEach(function (el) {
        var monthly = el.getAttribute('data-monthly');
        var yearly = el.getAttribute('data-yearly');
        if (monthly && yearly) {
          el.textContent = isYearly ? yearly : monthly;
        }
      });
    });
  }
})();

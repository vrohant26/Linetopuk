export function commonCarousel() {
  const swipers = document.querySelectorAll(".common-swiper");

  swipers.forEach((swiperEl) => {
    const swiper = new Swiper(swiperEl, {
      slidesPerView: 2.2,
      spaceBetween: 0,
      loop: true,

      navigation: {
        nextEl: swiperEl.querySelector(".custom-next"),
        prevEl: swiperEl.querySelector(".custom-prev"),
      },

      pagination: {
        el: swiperEl.querySelector(".swiper-pagination"),
        type: "fraction",
        formatFractionCurrent: (number) =>
          number < 10 ? "0" + number : number,
        formatFractionTotal: (number) => (number < 10 ? "0" + number : number),
        renderFraction: (currentClass, totalClass) =>
          `<span class="${currentClass} fs-lg bold"></span> /<span class="${totalClass}"></span>`,
      },

      on: {
        init: function () {
          updateActiveClass(this);
        },
        slideChange: function () {
          updateActiveClass(this);
        },
      },

      breakpoints: {
        0: {
          slidesPerView: 1.1,
        },
        768: {
          slidesPerView: 1.1,
        },
        1024: {
          slidesPerView: 2.1,
        },
      },
    });

    // ✅ Helper: highlight first or second visible slide based on screen width
    function updateActiveClass(swiperInstance) {
      const slides = swiperInstance.slides;
      slides.forEach((slide) => slide.classList.remove("active"));

      const isMobile = window.innerWidth < 1024;
      let targetIndex;

      if (isMobile) {
        // below 768px — first visible slide
        targetIndex = swiperInstance.activeIndex;
      } else {
        // 768px+ — second visible slide
        targetIndex = (swiperInstance.activeIndex + 1) % slides.length;
      }

      const targetSlide = slides[targetIndex];
      if (targetSlide) targetSlide.classList.add("active");
    }
  });
}

export function fadeContentAnimation() {
  const section = document.querySelector("#our-mission");
  const infoItems = gsap.utils.toArray(".info-item");
  const imageItems = gsap.utils.toArray(".image-item");

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      // end: "+=80%", // controls scroll distance
      scrub: true,
      pin: true,
      anticipatePin: 1,
    },
  });

  // Loop through items and swap "active" class as we scroll
  infoItems.forEach((item, i) => {
    tl.to(
      {},
      {
        onStart: () => {
          // Activate this item
          infoItems.forEach((el, j) => el.classList.toggle("active", j === i));
          imageItems.forEach((el, j) => el.classList.toggle("active", j === i));
        },
        onReverseComplete: () => {
          // Revert back when scrolling up
          const prevIndex = i - 1;
          if (prevIndex >= 0) {
            infoItems.forEach((el, j) =>
              el.classList.toggle("active", j === prevIndex)
            );
            imageItems.forEach((el, j) =>
              el.classList.toggle("active", j === prevIndex)
            );
          }
        },
      }
    );
  });
}

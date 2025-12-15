gsap.registerPlugin(ScrollTrigger);

export function carousels() {
  const monitoringSwiper = new Swiper("#selectMonitoringArea .swiper", {
    direction: "horizontal",
    loop: false,
    slidesPerView: 3, // show 3 slides at a time
    spaceBetween: 16, // space between slides in px

    navigation: {
      nextEl: ".custom-next",
      prevEl: ".custom-prev",
    },
    // Responsive breakpoints
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 16,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 16,
      },
    },
  });
}

gsap.registerPlugin(ScrollTrigger);

export function gsapAnimation() {
  // Why section animation
  gsap.to("#why .why-banner", {
    scrollTrigger: {
      trigger: "#why",
      start: "top top", // start when top of why section hits top of viewport
      end: "+=100%", // end after scrolling 100% of the viewport height
      pin: true, // pin the section
      pinSpacing: true,
      scrub: 1, // smooth scrubbing
      markers: false, // set to true for debugging
    },
    clipPath: "circle(100% at 50% 50%)", // end state
    duration: 1,
    ease: "none",
  });
}

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

export function fallingBalls() {
  gsap.from(".item1, .item2, .item3, .item4", {
    scrollTrigger: {
      trigger: ".gravity",
      start: "top 80%",
      toggleActions: "play none none none",
      markers: true,
    },
    transform: "translateY(-200px)",
    duration: 1.2,
    ease: "bounce.out",
    stagger: 0.1,
  });
}

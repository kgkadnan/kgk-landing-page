// for sticky Header
let lastScrollTop = 0;
window.addEventListener("scroll", function () {
  let currentScrollTop = window.scrollY;
  const header = document.querySelector("header");
  if (!header) return;
  if (currentScrollTop < lastScrollTop) {
    header.classList.remove("active");
  } else {
    header.classList.add("active");
  }
  lastScrollTop = currentScrollTop;
});

// {{{{{{{{3}}}}}}}} for menubar
document.addEventListener("DOMContentLoaded", function () {
  const homeburg = document.querySelector(".homeburg");
  if (homeburg) {
    homeburg.addEventListener("click", function () {
      document.querySelector(".main-menu").classList.toggle("active");
    });
  }
});
// {{{{{{{1}}}}}}} for lazer video effect
const videoRef = document.querySelector("video");
const progressDots = document.querySelectorAll(".dot");
const steps = document.querySelectorAll(".step");
const stepCount = document.querySelector(".stepcount");
const laserImages = document.querySelectorAll(".laser-img");
const playPauseButtonToggle = document.querySelector(".videoplay");
const progressBarFill = document.querySelector(".progress-bar-fill");

let isPlaying = true;

// Function to calculate percentage completion
const calculatePercentage = (currentTime, totalDuration) => {
  return Math.min(Math.round((currentTime / totalDuration) * 100), 100);
};

const calculateProgressHeight = (timeStart, timeEnd, currentTime) => {
  if (currentTime >= timeStart && currentTime <= timeEnd) {
    const duration = timeEnd - timeStart;
    const elapsedTime = currentTime - timeStart;
    return `${(elapsedTime / duration) * 100}%`;
  }
  return "0%";
};

// Handle Play/Pause
const handlePlayPause = () => {
  if (videoRef.paused) {
    videoRef.play();
    isPlaying = true;
    playPauseButtonToggle.querySelector(".playbtn").style.display = "none";
    playPauseButtonToggle.querySelector(".Pausebtn").style.display = "block";
  } else {
    videoRef.pause();
    isPlaying = false;
    playPauseButtonToggle.querySelector(".playbtn").style.display = "block";
    playPauseButtonToggle.querySelector(".Pausebtn").style.display = "none";
  }
};

// Handle Dot Click
const handleDotClick = (event) => {
  const timeStart = parseFloat(event.target.dataset.timeStart);
  laserImages.forEach((laserImage) => laserImage.classList.remove("active"));
  const dotIndex = Array.from(progressDots).indexOf(event.target);
  for (let i = 0; i <= dotIndex; i++) {
    if (laserImages[i]) {
      laserImages[i].classList.add("active");
    }
  }

  videoRef.currentTime = timeStart;
  if (videoRef.paused) {
    videoRef.play();
    isPlaying = true;
  }
};

// Update progress bar inside dots
const updateDotProgress = () => {
  const currentTime = videoRef.currentTime;

  progressDots.forEach((dot, index) => {
    const timeStart = parseFloat(dot.dataset.timeStart);
    const timeEnd = parseFloat(dot.dataset.timeEnd);
    const progressBar = dot.querySelector(".progress-bar-line");

    if (currentTime >= timeStart && currentTime <= timeEnd) {
      const duration = timeEnd - timeStart;
      const elapsedTime = currentTime - timeStart;
      const progress = (elapsedTime / duration) * 100;

      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }
    } else {
      if (progressBar) {
        progressBar.style.width = "0%";
      }
    }
  });
};

// Update progress bar
const updateProgressBar = () => {
  const currentTime = videoRef.currentTime;
  const totalDuration = videoRef.duration;
  const percentage = calculatePercentage(currentTime, totalDuration);
  stepCount.textContent = `${percentage}%`;
  const isWideViewport = window.matchMedia("(max-width: 1024px)").matches;

  if (isWideViewport) {
    progressBarFill.style.width = `${percentage}%`;
    progressBarFill.style.height = "auto";
  } else {
    progressBarFill.style.height = `${percentage}%`;
    progressBarFill.style.width = "auto";
  }

  progressDots.forEach((dot, index) => {
    const timeStart = parseFloat(dot.dataset.timeStart);
    const timeEnd = parseFloat(dot.dataset.timeEnd);

    if (currentTime >= timeStart && currentTime <= timeEnd) {
      if (!dot.classList.contains("active")) {
        dot.classList.add("active");
      }

      const progressHeight = calculateProgressHeight(
        timeStart,
        timeEnd,
        currentTime
      );
      dot.style.height = progressHeight;
      dot.classList.add(`dot-${index + 1}`);

      if (steps[index]) {
        if (!steps[index].classList.contains("active")) {
          steps.forEach((step) => step.classList.remove("active"));
          steps[index].classList.add("active");
        }
      }

      if (laserImages[index]) {
        laserImages[index].classList.add("active");
        laserImages[index].classList.add("dummy-class");

        if (laserImages[index + 1]) {
          laserImages[index + 1].classList.add("next-dummy-class");
        }
      }
    } else {
      if (dot.classList.contains("active")) {
        dot.classList.remove("active");
        dot.style.height = "2px";
      }

      dot.classList.remove(`dot-${index + 1}`);
      if (steps[index] && steps[index].classList.contains("active")) {
        steps[index].classList.remove("active");
      }

      if (laserImages[index]) {
        laserImages[index].classList.remove("dummy-class");
        if (laserImages[index + 1]) {
          laserImages[index + 1].classList.remove("next-dummy-class");
        }
      }
    }
  });

  updateDotProgress();

  if (currentTime >= totalDuration) {
    steps.forEach((step) => step.classList.remove("active"));
    steps[0].classList.add("active");

    laserImages[0].classList.add("active");
    laserImages[0].classList.add("dummy-class");

    if (laserImages[1]) {
      laserImages[1].classList.add("next-dummy-class");
    }
  }
};

// Play/pause button click handler
const handlePlayPauseButtonClick = () => {
  handlePlayPause();
};

const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.5,
};

const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      if (videoRef.paused) {
        videoRef.play();
        isPlaying = true;
      }
    } else {
      if (!videoRef.paused) {
        videoRef.pause();
        isPlaying = false;
      }
    }
  });
}, observerOptions);

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  if (videoRef) {
    videoRef.addEventListener("click", handlePlayPause);
    videoRef.addEventListener("timeupdate", updateProgressBar);
    videoObserver.observe(videoRef);
  }

  if (playPauseButtonToggle) {
    playPauseButtonToggle.addEventListener("click", handlePlayPauseButtonClick);
  }

  progressDots.forEach((dot) => {
    dot.addEventListener("click", handleDotClick);
  });
});

// {{{{{{{2}}}}}}} for glob video
const videoElement = document.querySelector(".video-globe");
const playPauseButton = document.querySelector(".video-control");
const videoContainer = document.querySelector(".video-container");

if (videoElement && playPauseButton && videoContainer) {
  function togglePlayPause(play) {
    if (play) {
      playPauseButton.classList.add("playing", "active");
      videoElement.play().catch((err) => {});
    } else {
      playPauseButton.classList.remove("playing", "active");
      videoElement.pause();
    }
  }

  // Play/pause toggle on button click
  playPauseButton.addEventListener("click", () => {
    const isPlaying = playPauseButton.classList.contains("playing");
    togglePlayPause(!isPlaying);
  });

  // Play/pause toggle on video click
  videoElement.addEventListener("click", () => {
    const isPlaying = playPauseButton.classList.contains("playing");
    togglePlayPause(!isPlaying);
  });

  // Reset button state when the video ends
  videoElement.addEventListener("ended", () => {
    playPauseButton.classList.remove("playing", "active");
  });

  // Play/pause based on viewport visibility
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoContainer.style.transition = "padding 1s ease";
          videoContainer.style.padding = "2rem";
          videoElement.style.transition = "border-radius 1s ease";
          videoElement.style.borderRadius = "16px";
          togglePlayPause(true);
        } else {
          // Revert styles when the video leaves the viewport
          videoContainer.style.transition = "padding 1s ease";
          videoContainer.style.padding = "";
          videoElement.style.transition = "border-radius 1s ease";
          videoElement.style.borderRadius = "";
          togglePlayPause(false);
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(videoElement);
}

// {{{{{{{{4}}}}}}}} for dropdown menubar
function toggleDropdown(event) {
  const menu = document.getElementById("dropdown-menu");
  const expanded =
    document.getElementById("menu-button").getAttribute("aria-expanded") ===
    "true";

  menu.classList.toggle("hidden", expanded);
  document
    .getElementById("menu-button")
    .setAttribute("aria-expanded", !expanded);

  document.addEventListener("click", (e) => {
    if (
      !menu.contains(e.target) &&
      !document.getElementById("menu-button").contains(e.target)
    ) {
      menu.classList.add("hidden");
      document
        .getElementById("menu-button")
        .setAttribute("aria-expanded", "false");
    }
  });
}

// {{{{{{{{5}}}}}}}} for mobile image slider
document.addEventListener("DOMContentLoaded", () => {
  const imageList = [
    "static/images/usa.png",
    "static/images/india.png",
    "static/images/belgium.png",
    "static/images/hongkong-1.png",
    "static/images/dubai.png",
  ];

  let scrollIndex = 0;
  const slider = document.getElementById("imageSlider");
  const totalImages = imageList.length;

  // Ensure the slider element exists before proceeding
  if (slider) {
    function updateSlider() {
      slider.style.transform = `translateY(-${
        scrollIndex * (100 / totalImages)
      }%)`;
      slider.style.transition = "transform 0.7s ease-in-out";
    }

    function startSlider() {
      const interval = setInterval(() => {
        scrollIndex = (scrollIndex + 1) % totalImages;
        updateSlider();
        if (scrollIndex === totalImages - 1) {
          clearInterval(interval);
        }
      }, 2000);
    }

    startSlider();
  }
});

// <!-- tabination js -->
function openTab(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "flex";
  evt.currentTarget.className += " active";
}
// <!-- tabination js -->

// {{{{{{{8}}}}}}} menu active
document.addEventListener("DOMContentLoaded", function () {
  const homeburg = document.querySelector(".homeburg");
  const menuOverlay = document.querySelector(".menu-overlay");
  const navbar = document.querySelector(".navbar");

  if (homeburg && menuOverlay && navbar) {
    homeburg.addEventListener("click", function () {
      this.classList.toggle("active");
      menuOverlay.classList.toggle("active");
      navbar.classList.toggle("active");
    });

    menuOverlay.addEventListener("click", function () {
      this.classList.remove("active");
      homeburg.classList.remove("active");
      navbar.classList.remove("active");
    });
  }
});

// menu active link
var currentPath = window.location.pathname;
var menuLinks = document.querySelectorAll(".menu-link");
menuLinks.forEach(function (link) {
  var linkPath = link.getAttribute("href");

  if (currentPath.endsWith(linkPath)) {
    link.classList.add("active");
  }
});

// copy paste text
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".copyPaste").forEach((copyButton) => {
    const tooltip = copyButton.nextElementSibling;
    const svg = tooltip.querySelector("svg");
    const textElement = copyButton.previousElementSibling.querySelector(".copyedText");

    const toggleTooltip = () => {
      const isVisible = tooltip.classList.contains("visible");
      tooltip.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      tooltip.style.transform = isVisible ? 'translateX(100%)' : 'translateY(0)';
      tooltip.style.opacity = isVisible ? '0' : '1';
      tooltip.classList.toggle("visible", !isVisible);
      setTimeout(() => tooltip.classList.toggle("hidden", isVisible), 300);
    };

    copyButton.addEventListener("click", () => {
      navigator.clipboard.writeText(textElement.textContent);
      toggleTooltip();
    });

    svg.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleTooltip();
    });

    copyButton.addEventListener("mouseenter", () => {
      const { left, top } = copyButton.getBoundingClientRect();
      Object.assign(tooltip.style, {
        left: `${left + window.pageXOffset}px`,
        top: `${top + window.pageYOffset - tooltip.offsetHeight}px`,
      });
    });
  });
});


// world map location
document.querySelectorAll(".kgk-locate").forEach((element) => {
  const handleMouseEnter = function () {
    document.querySelectorAll(".active-location").forEach((activeElement) => {
      activeElement.classList.remove("active-location");
    });
    this.classList.add("active-location");
  };

  const handleMouseLeave = function () {};
  const handleClick = function () {
    document.querySelectorAll(".active-location").forEach((activeElement) => {
      activeElement.classList.remove("active-location");
    });
    this.classList.add("active-location");
  };

  element.addEventListener("mouseenter", handleMouseEnter);
  element.addEventListener("mouseleave", handleMouseLeave);
  element.addEventListener("click", handleClick);
});

// password visible
const passwordFields = document.querySelectorAll(".password-input");
const showHideIcons = document.querySelectorAll(".show-hide-eye");

showHideIcons.forEach((icon, index) => {
  icon.addEventListener("click", function () {
    const passwordInput = passwordFields[index];
    const closeEye = this.querySelector(".close-eye");
    const showEye = this.querySelector(".show-eye");

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      closeEye.classList.add("hidden");
      showEye.classList.remove("hidden");
    } else {
      passwordInput.type = "password";
      closeEye.classList.remove("hidden");
      showEye.classList.add("hidden");
    }
  });
});

/// for top head animation text H1tag
document.addEventListener("DOMContentLoaded", () => {
  const textElement = document.querySelector(".typing-text");
  const lines = textElement.querySelectorAll(".line");
  let delay = 0;
  lines.forEach((line, lineIndex) => {
    const text = line.textContent;
    line.textContent = "";

    setTimeout(() => {
      line.style.opacity = 1;
    }, delay + lineIndex * 10);

    const letters = text.split("");
    letters.forEach((letter, index) => {
      const letterSpan = document.createElement("span");
      letterSpan.textContent = letter;
      line.appendChild(letterSpan);

      setTimeout(() => {
        letterSpan.style.opacity = 1;
      }, delay + lineIndex * 10 + index * 40);
    });

    delay += text.length * 40;
  });
});

// for top head animation text P tag
document.addEventListener("DOMContentLoaded", () => {
  const paragraphElement = document.querySelector(".ptag");
  const text = paragraphElement.textContent;
  paragraphElement.textContent = "";

  let delay = 0;

  const letters = text.split("");
  letters.forEach((letter, index) => {
    const letterSpan = document.createElement("span");
    letterSpan.textContent = letter;
    paragraphElement.appendChild(letterSpan);

    setTimeout(() => {
      letterSpan.style.opacity = 1;
    }, delay + index * 10);

    delay += 0;
  });

  setTimeout(() => {
    paragraphElement.style.opacity = 1;
  }, delay + 100);
});

// timeline text animation
document.addEventListener("DOMContentLoaded", () => {
  const textElements = document.querySelectorAll(".timelineText");

  textElements.forEach((textElement) => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            !textElement.classList.contains("visible")
          ) {
            const line = entry.target;
            line.classList.add("visible"); // Fade in the element

            const text = line.textContent;
            line.innerHTML = ""; // Clear content only once for animation

            let delay = 0;
            const letters = text.split("");
            letters.forEach((letter, index) => {
              const letterSpan = document.createElement("span");
              letterSpan.textContent = letter;
              line.appendChild(letterSpan);

              setTimeout(() => {
                letterSpan.style.opacity = 1;
              }, delay + index * 20);
            });

            // Stop observing the element once animation starts
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    ); // Trigger when 50% of the element is in the viewport

    observer.observe(textElement);
  });
});

// {{{{{{{{1}}}}}}}} for menubar
document.addEventListener("DOMContentLoaded", function () {
  const homeburg = document.querySelector(".homeburg");
  if (homeburg) {
    homeburg.addEventListener("click", function () {
      document.querySelector(".main-menu").classList.toggle("active");
    });
  }
});

// for sticky Header
let lastScrollTop = 0;
window.addEventListener("scroll", function () {
  if (window.innerWidth <= 1200) return;

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
    playPauseButtonToggle.querySelector(".restartbtn").style.display = "none";
  } else {
    videoRef.pause();
    isPlaying = false;
    playPauseButtonToggle.querySelector(".playbtn").style.display = "block";
    playPauseButtonToggle.querySelector(".Pausebtn").style.display = "none";
    playPauseButtonToggle.querySelector(".restartbtn").style.display = "none";
  }
};

// Handle Restart
const handleRestart = () => {
  videoRef.currentTime = 0;
  videoRef.play();
  isPlaying = true;

  // Reset Progress and Classes
  steps.forEach((step) => step.classList.remove("active"));
  progressDots.forEach((dot) => dot.classList.remove("active"));
  laserImages.forEach((laserImage) => laserImage.classList.remove("active"));

  playPauseButtonToggle.querySelector(".playbtn").style.display = "none";
  playPauseButtonToggle.querySelector(".Pausebtn").style.display = "block";
  playPauseButtonToggle.querySelector(".restartbtn").style.display = "none";

  // Activate the first step and laser image
  if (steps[0]) steps[0].classList.add("active");
  if (laserImages[0]) laserImages[0].classList.add("active");
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

// Update Dot Progress
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

// Update Progress Bar
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
};

// Handle Video End Event
const handleVideoEnd = () => {
  isPlaying = false;

  // Show Restart Button
  playPauseButtonToggle.querySelector(".restartbtn").style.display = "block";
  playPauseButtonToggle.querySelector(".Pausebtn").style.display = "none";
  playPauseButtonToggle.querySelector(".playbtn").style.display = "none";

  // Activate the last step and dot
  if (steps.length > 0) {
    steps.forEach((step) => step.classList.remove("active"));
    steps[steps.length - 1].classList.add("active");
  }

  if (progressDots.length > 0) {
    progressDots.forEach((dot) => dot.classList.remove("active"));
    const lastDot = progressDots[progressDots.length - 1];
    lastDot.classList.add("active");

    const progressBar = lastDot.querySelector(".progress-bar-line");
    if (progressBar) {
      progressBar.style.width = "100%";
    }
  }
};

// Intersection Observer for play/pause based on visibility
const handleIntersection = (entries) => {
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
};

document.addEventListener("DOMContentLoaded", () => {
  if (videoRef) {
    // Create and observe video element when it is valid
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.5,
    });
    observer.observe(videoRef);

    videoRef.addEventListener("click", handlePlayPause);
    videoRef.addEventListener("timeupdate", updateProgressBar);
    videoRef.addEventListener("ended", handleVideoEnd);
  }

  if (playPauseButtonToggle) {
    playPauseButtonToggle.addEventListener("click", (event) => {
      if (event.target.classList.contains("restartbtn")) {
        handleRestart();
      } else {
        handlePlayPause();
      }
    });
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
    const textElement =
      copyButton.previousElementSibling.querySelector(".copyedText");

    const toggleTooltip = () => {
      const isVisible = tooltip.classList.contains("visible");
      tooltip.style.transition = "transform 0.3s ease, opacity 0.3s ease";
      tooltip.style.transform = isVisible
        ? "translateX(100%)"
        : "translateY(0)";
      tooltip.style.opacity = isVisible ? "0" : "1";
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
  const observer = new MutationObserver(() => {
    const textElement = document.querySelector(".typing-text");
    if (textElement) {
      observer.disconnect(); // Stop observing after the element is found

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
    }
  });

  // Start observing for added child nodes
  observer.observe(document.body, { childList: true, subtree: true });
});

// for top head animation text P tag
document.addEventListener("DOMContentLoaded", () => {
  const paragraphElement = document.querySelector(".ptag");
  if (!paragraphElement) return;
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

// tree nation
document.addEventListener("DOMContentLoaded", () => {
  // Delay the execution to ensure all elements are available
  setTimeout(() => {
    if (window.TreeNationOffsetWebsite) {
      // Select the Tree Nation widget container
      const element = document.querySelector("#tree-nation-offset-website");

      // Render the widget if the container is empty
      if (!element || !element.hasChildNodes()) {
        window
          .TreeNationOffsetWebsite({
            code: "0f021e268485267a", // Replace with your Tree Nation code
            lang: "en",
            theme: "light",
          })
          .render("#tree-nation-offset-website");
      }
    } else {
      console.log(
        "Tree Nation widget not loaded: Mobile screen detected or widget not available."
      );
    }
  }, 1000);

  // Dynamically add the Tree Nation script
  const script = document.createElement("script");
  script.src =
    "https://widgets.tree-nation.com/js/widgets/v1/widgets.min.js?v=1.0";
  script.async = true;
  document.head.appendChild(script);
});

// cookie bot
document.addEventListener("DOMContentLoaded", () => {
  // Dynamically add the CookieBot script
  const script = document.createElement("script");
  script.src = "https://consent.cookiebot.com/uc.js";
  script.async = true;
  script.dataset.cbid = "86ce1cb4-4338-418c-acca-d54a1b81cccc"; // Replace with your CookieBot Domain Group ID
  script.dataset.blockingmode = "auto"; // Specify the blocking mode if needed
  document.head.appendChild(script);

  // Implement custom GTAG consent functionality
  const cookieConsentScript = document.createElement("script");
  cookieConsentScript.id = "cookie-consent";
  cookieConsentScript.dataset.cookieconsent = "ignore";
  cookieConsentScript.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("consent", "default", {
      ad_personalization: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      analytics_storage: "denied",
      functionality_storage: "denied",
      personalization_storage: "denied",
      security_storage: "granted",
      wait_for_update: 500,
    });
    gtag("set", "ads_data_redaction", true);
    gtag("set", "url_passthrough", false);
  `;
  document.head.appendChild(cookieConsentScript);
});

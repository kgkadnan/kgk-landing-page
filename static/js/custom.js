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
  return Math.min(Math.round((currentTime / totalDuration) * 100), 100); // Ensure it does not exceed 100%
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

  // Remove the 'active' class from all laser-img elements first
  laserImages.forEach((laserImage) => laserImage.classList.remove("active"));

  const dotIndex = Array.from(progressDots).indexOf(event.target);

  // Add 'active' class for all previous laser-images up to and including the clicked dot
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

// Intersection Observer for video visibility
const observerOptions = {
  root: null, // Use the viewport as the root
  rootMargin: "0px", // No margin around the viewport
  threshold: 0.5, // Trigger when 50% of the video is in the viewport
};

const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Play the video when it comes into the viewport
      if (videoRef.paused) {
        videoRef.play();
        isPlaying = true;
      }
    } else {
      // Pause the video when it goes out of the viewport
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
// Select elements
const videoElement = document.querySelector(".video-globe");
const playPauseButton = document.querySelector(".video-control");

// Ensure both elements exist before proceeding
if (videoElement && playPauseButton) {
  // Function to handle play/pause logic
  function togglePlayPause(play) {
    if (play) {
      playPauseButton.classList.add("playing", "active");
      videoElement.play().catch((err) => {}); // Safeguard for potential errors
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
          togglePlayPause(true);
        } else {
          togglePlayPause(false);
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(videoElement); // Observe the video element only if it exists
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
          clearInterval(interval); // Stop the animation after the last slide
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
    link.classList.add("active"); // Add the 'active' class if there's a match
  }
});

// copy paste text
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".copyPaste").forEach((copyButton) => {
    const textElement =
      copyButton.previousElementSibling.querySelector(".copyedText");
    const tooltip = copyButton.nextElementSibling;

    copyButton.addEventListener("click", () => {
      navigator.clipboard.writeText(textElement.textContent).then(() => {
        tooltip.classList.replace("hidden", "visible");
        setTimeout(() => tooltip.classList.replace("visible", "hidden"), 2000);
      });
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

// Loop through all the password fields and add event listeners to each show-hide-eye container
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

// top text Animation
document.addEventListener("DOMContentLoaded", () => {
  const textElement = document.querySelector(".typing-text");
  const lines = textElement.querySelectorAll(".line"); // Get all the lines
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

document.addEventListener("DOMContentLoaded", () => {
  const paragraphElement = document.querySelector(".ptag");
  const text = paragraphElement.textContent;
  paragraphElement.textContent = ""; // Clear the paragraph

  let delay = 0;

  // Split the text into individual letters
  const letters = text.split("");
  letters.forEach((letter, index) => {
    const letterSpan = document.createElement("span");
    letterSpan.textContent = letter; // Set the letter text
    paragraphElement.appendChild(letterSpan);

    // Add animation delay for each letter
    setTimeout(() => {
      letterSpan.style.opacity = 1;
    }, delay + index * 10); // Adjust typing speed here

    // Increment delay for the next letter
    delay += 0; // Adjust speed of the typing effect here
  });

  // Animate the entire paragraph's opacity
  setTimeout(() => {
    paragraphElement.style.opacity = 1;
  }, delay + 100); // Delay the opacity of the paragraph as a whole
});

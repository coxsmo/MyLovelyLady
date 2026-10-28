"use strict";

// The page is intentionally dependency-free so it stays easy to edit from a phone.
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const openingScene = document.querySelector("#opening");
  const envelopeTrigger = document.querySelector(".envelope-trigger");
  const openLetterButton = document.querySelector(".open-letter-button");
  const returnEnvelopeButton = document.querySelector(".return-envelope-button");
  const readAgainButton = document.querySelector(".read-again-button");
  const letterExperience = document.querySelector("#letter-experience");
  const letterStart = document.querySelector("#letter-start");
  const letterHeading = document.querySelector("#letter-heading");
  const paragraphs = [...document.querySelectorAll(".letter-paragraph")];
  const progressCurrent = document.querySelector("#progress-current");
  const progressFill = document.querySelector("#progress-fill");
  const progressBar = document.querySelector(".progress-track");

  const audio = document.querySelector("#love-audio");
  const musicDock = document.querySelector(".music-dock");
  const musicToggle = document.querySelector("#music-toggle");
  const musicStatus = document.querySelector("#music-status");
  const volumeSlider = document.querySelector("#volume-slider");

  const memoriesSection = document.querySelector("#memories-section");
  const memoryGrid = document.querySelector("#memory-grid");
  const lightbox = document.querySelector("#lightbox");
  const lightboxImage = document.querySelector("#lightbox-image");
  const lightboxCaption = document.querySelector("#lightbox-caption");
  const lightboxClose = document.querySelector("#lightbox-close");
  const lightboxBackdrop = document.querySelector(".lightbox-backdrop");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let openingHasBeenSeen = false;
  let audioUnavailable = false;
  let autoplayAttempted = false;
  let lastFocusedElement = null;

  if ("inert" in letterExperience) {
    letterExperience.inert = true;
  }

  // ----- Envelope and reading flow -----
  function openLetter() {
    if (body.classList.contains("is-open")) {
      return;
    }

    openingHasBeenSeen = true;
    body.classList.add("is-opening");

    // Let the envelope respond for one frame before the letter scene starts to unfold.
    window.requestAnimationFrame(() => {
      body.classList.add("is-open");
      letterExperience.setAttribute("aria-hidden", "false");
      if ("inert" in letterExperience) {
        letterExperience.inert = false;
      }
      playAudioFromInteraction();

      window.setTimeout(() => {
        body.classList.remove("is-opening");
      }, prefersReducedMotion ? 0 : 900);

      const focusDelay = prefersReducedMotion ? 0 : 620;
      window.setTimeout(() => {
        letterHeading.focus({ preventScroll: true });
      }, focusDelay);
    });
  }

  function returnToEnvelope() {
    body.classList.remove("is-open", "is-opening");
    letterExperience.setAttribute("aria-hidden", "true");
    if ("inert" in letterExperience) {
      letterExperience.inert = true;
    }
    envelopeTrigger.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  }

  function readAgain() {
    if (!body.classList.contains("is-open")) {
      openLetter();
      return;
    }

    letterStart.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    updateProgress(1);
  }

  envelopeTrigger.addEventListener("click", openLetter);
  openLetterButton.addEventListener("click", openLetter);
  returnEnvelopeButton.addEventListener("click", returnToEnvelope);
  readAgainButton.addEventListener("click", readAgain);

  // A small keyboard shortcut keeps the envelope interaction comfortable on desktop.
  openingScene.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      const target = event.target;
      if (target === openingScene) {
        event.preventDefault();
        openLetter();
      }
    }
  });

  // ----- Truthful audio controls -----
  audio.volume = Number(volumeSlider.value);
  audio.loop = true;
  audio.autoplay = true;
  audio.load();

  function setMusicMessage(message) {
    musicStatus.textContent = message;
  }

  function setPlayingState(isPlaying) {
    musicDock.classList.toggle("is-playing", isPlaying);
    musicToggle.setAttribute("aria-pressed", String(isPlaying));
    musicToggle.setAttribute("aria-label", isPlaying ? "Pause our song" : "Play our song");
    if (isPlaying) {
      setMusicMessage("Playing softly for us");
    } else if (!audioUnavailable) {
      setMusicMessage("Tap to play our song ♡");
    }
  }

  function playAudioFromInteraction() {
    if (audioUnavailable || !audio.paused) {
      return;
    }

    autoplayAttempted = true;
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        setPlayingState(false);
      });
    }
  }

  audio.addEventListener("play", () => setPlayingState(true));
  audio.addEventListener("pause", () => setPlayingState(false));
  audio.addEventListener("ended", () => setPlayingState(false));
  audio.addEventListener("error", () => {
    audioUnavailable = true;
    musicToggle.disabled = true;
    volumeSlider.disabled = true;
    setPlayingState(false);
    setMusicMessage("Add assets/our-song.mp3 when you are ready");
  });

  musicToggle.addEventListener("click", () => {
    if (audioUnavailable) {
      return;
    }

    if (audio.paused) {
      playAudioFromInteraction();
    } else {
      audio.pause();
    }
  });

  volumeSlider.addEventListener("input", () => {
    audio.volume = Number(volumeSlider.value);
  });

  // One honest autoplay attempt. If the browser blocks it, a genuine first tap can retry it.
  window.setTimeout(() => {
    if (!autoplayAttempted) {
      autoplayAttempted = true;
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => setMusicMessage("Tap to play our song ♡"));
      }
    }
  }, 0);

  document.addEventListener(
    "pointerdown",
    () => {
      if (!autoplayAttempted || audioUnavailable) {
        return;
      }
      playAudioFromInteraction();
    },
    { once: true, passive: true }
  );

  // ----- Real paragraph visibility progress -----
  function updateProgress(number) {
    const safeNumber = Math.min(Math.max(number, 1), paragraphs.length);
    progressCurrent.textContent = String(safeNumber);
    progressBar.setAttribute("aria-valuenow", String(safeNumber));
    progressFill.style.transform = `scaleX(${safeNumber / paragraphs.length})`;
  }

  if ("IntersectionObserver" in window) {
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          updateProgress(Number(visibleEntries[0].target.dataset.paragraph));
        }
      },
      { root: null, rootMargin: "-18% 0px -48% 0px", threshold: [0.15, 0.35, 0.6, 0.85] }
    );

    paragraphs.forEach((paragraph) => visibilityObserver.observe(paragraph));
  } else {
    const fallbackProgress = () => {
      const current = paragraphs.reduce((closest, paragraph) => {
        const distance = Math.abs(paragraph.getBoundingClientRect().top - window.innerHeight * 0.28);
        return distance < closest.distance ? { distance, number: Number(paragraph.dataset.paragraph) } : closest;
      }, { distance: Number.POSITIVE_INFINITY, number: 1 });
      updateProgress(current.number);
    };

    window.addEventListener("scroll", fallbackProgress, { passive: true });
    fallbackProgress();
  }

  // ----- Optional personal memories and accessible lightbox -----
  function updateMemoryVisibility() {
    const cards = [...memoryGrid.querySelectorAll(".memory-card")];
    memoriesSection.hidden = cards.length === 0;
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  function openLightbox(card) {
    const image = card.querySelector("img");
    const button = card.querySelector("button");
    const caption = card.querySelector("figcaption");
    if (!image) {
      return;
    }

    lastFocusedElement = button || card;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = caption ? caption.textContent : "A little memory of us";
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    lightboxClose.focus();
  }

  function wireMemoryCard(card) {
    const image = card.querySelector("img");
    const button = card.querySelector("button");
    if (!image || !button) {
      card.remove();
      return;
    }

    image.addEventListener("error", () => {
      card.remove();
      updateMemoryVisibility();
    });
    button.addEventListener("click", () => openLightbox(card));
  }

  [...memoryGrid.querySelectorAll(".memory-card")].forEach(wireMemoryCard);
  updateMemoryVisibility();
  lightboxClose.addEventListener("click", closeLightbox);
  lightboxBackdrop.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) {
      closeLightbox();
    }

    if (event.key === "Tab" && !lightbox.hidden) {
      const focusableElements = [...lightbox.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])")]
        .filter((element) => !element.disabled && element.offsetParent !== null);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) {
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  });

  // Hide optional lily images cleanly when the user has not added the local files yet.
  document.querySelectorAll(".lily-image").forEach((image) => {
    const parent = image.closest(".hero-botanical, .ending-floral");
    const markImageAvailable = () => {
      if (image.naturalWidth > 0) {
        parent.classList.add("has-image");
      }
    };
    image.addEventListener("load", markImageAvailable);
    image.addEventListener("error", () => {
      image.hidden = true;
    });
    if (image.complete) {
      markImageAvailable();
    }
  });

  // Keep the optional opening flower calm when the tab is not visible.
  document.addEventListener("visibilitychange", () => {
    document.body.classList.toggle("is-background-tab", document.hidden);
  });

  // Prevent a stale focus ring from being mistaken for a missing interaction after returning.
  if (openingHasBeenSeen) {
    envelopeTrigger.blur();
  }
});

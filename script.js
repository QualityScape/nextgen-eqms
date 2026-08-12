document.addEventListener("DOMContentLoaded", () => {

  const storySteps = document.querySelectorAll(".story-step");
  const mediaLayers = document.querySelectorAll(".media-layer");

  const docVideo = document.getElementById("doc-control-video");
  const docStep = document.querySelector(
    '.story-step[data-media="media-document-control"]'
  );
  const docCard = docStep
    ? docStep.querySelector(".story-card")
    : null;

  const mobileQuery = window.matchMedia("(max-width: 768px)");

  let activeMediaId = "media-document-control";
  let currentDocSource = "";
  let scrollTicking = false;


  /* =========================================================
     CHOOSE THE CORRECT DOCUMENT CONTROL VIDEO
  ========================================================= */

  function setDocumentControlSource() {
    if (!docVideo) {
      return;
    }

    const desiredSource = mobileQuery.matches
      ? docVideo.dataset.mobileSrc
      : docVideo.dataset.desktopSrc;

    if (currentDocSource === desiredSource) {
      return;
    }

    currentDocSource = desiredSource;

    const shouldResume =
      activeMediaId === "media-document-control";

    docVideo.pause();
    docVideo.src = desiredSource;
    docVideo.load();

    if (shouldResume) {
      docVideo.play().catch(() => {
        // Muted inline playback should normally be allowed.
      });
    }
  }


  /* =========================================================
     MOBILE ONLY — FREEZE DOC CONTROL ZOOM WHEN
     THE TEXT CARD REACHES THE SCREEN MIDDLE
  ========================================================= */

  function updateDocMobileFreeze() {
    if (!docStep || !docCard) {
      document.body.classList.remove("doc-mobile-freeze");
      return;
    }

    if (!mobileQuery.matches) {
      document.body.classList.remove("doc-mobile-freeze");
      return;
    }

    if (activeMediaId !== "media-document-control") {
      document.body.classList.remove("doc-mobile-freeze");
      return;
    }

    const stepRect = docStep.getBoundingClientRect();

    const stepVisible =
      stepRect.bottom > 0 &&
      stepRect.top < window.innerHeight;

    if (!stepVisible) {
      document.body.classList.remove("doc-mobile-freeze");
      return;
    }

    const cardRect = docCard.getBoundingClientRect();
    const viewportMiddle = window.innerHeight * 0.5;
    const cardCenter = cardRect.top + (cardRect.height / 2);

    /*
      Freeze once the card's center reaches the middle
      of the screen, so the user can read without the
      background zoom continuing.
    */
    const shouldFreeze = cardCenter <= (viewportMiddle + 20);

    document.body.classList.toggle(
      "doc-mobile-freeze",
      shouldFreeze
    );
  }

  function requestDocMobileFreezeUpdate() {
    if (scrollTicking) {
      return;
    }

    scrollTicking = true;

    window.requestAnimationFrame(() => {
      updateDocMobileFreeze();
      scrollTicking = false;
    });
  }


  /* =========================================================
     ACTIVATE STORY MEDIA
  ========================================================= */

  function activateMedia(mediaId) {
    activeMediaId = mediaId;

    mediaLayers.forEach((layer) => {
      const videos = layer.querySelectorAll("video");

      if (layer.id === mediaId) {
        layer.classList.add("active");

        videos.forEach((video) => {
          video.play().catch(() => {
            // Ignore temporary autoplay restrictions.
          });
        });

      } else {
        layer.classList.remove("active");

        videos.forEach((video) => {
          video.pause();

          try {
            video.currentTime = 0;
          } catch (error) {
            // Ignore if metadata is not ready.
          }
        });
      }
    });

    requestDocMobileFreezeUpdate();
  }


  /* =========================================================
     STORY STEP OBSERVER
  ========================================================= */

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const mediaId = entry.target.dataset.media;

        if (mediaId) {
          activateMedia(mediaId);
        }
      });
    },
    {
      root: null,
      rootMargin: "-35% 0px -35% 0px",
      threshold: 0
    }
  );

  storySteps.forEach((step) => {
    observer.observe(step);
  });


  /* =========================================================
     DESKTOP / MOBILE SWITCH
  ========================================================= */

  function handleViewportChange() {
    setDocumentControlSource();
    requestDocMobileFreezeUpdate();
  }

  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener(
      "change",
      handleViewportChange
    );
  } else {
    mobileQuery.addListener(handleViewportChange);
  }


  /* =========================================================
     SCROLL / RESIZE
  ========================================================= */

  window.addEventListener(
    "scroll",
    requestDocMobileFreezeUpdate,
    { passive: true }
  );

  window.addEventListener(
    "resize",
    requestDocMobileFreezeUpdate
  );


  /* =========================================================
     TAB VISIBILITY
  ========================================================= */

  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) {
        mediaLayers.forEach((layer) => {
          layer
            .querySelectorAll("video")
            .forEach((video) => {
              video.pause();
            });
        });

      } else {
        activateMedia(activeMediaId);
      }

      requestDocMobileFreezeUpdate();
    }
  );


  /* =========================================================
     INITIAL STATE
  ========================================================= */

  setDocumentControlSource();
  activateMedia("media-document-control");
  requestDocMobileFreezeUpdate();

});

document.addEventListener("DOMContentLoaded", () => {

  const storySteps = Array.from(
    document.querySelectorAll(".story-step")
  );

  const mediaLayers = Array.from(
    document.querySelectorAll(".media-layer")
  );

  const docVideo =
    document.getElementById("doc-control-video");

  const docStep =
    document.querySelector(
      '.story-step[data-media="media-document-control"]'
    );

  const docCard =
    docStep
      ? docStep.querySelector(".story-card")
      : null;

  const mobileQuery =
    window.matchMedia("(max-width: 768px)");

  let activeMediaId = null;

  let currentDocSource = "";

  let mobileScrollTicking = false;

  let docAnimationFrozen = false;



  /* =========================================================
     CHOOSE DOCUMENT CONTROL VIDEO
  ========================================================= */

  function setDocumentControlSource() {

    if (!docVideo) {
      return;
    }


    const desiredSource =
      mobileQuery.matches
        ? docVideo.dataset.mobileSrc
        : docVideo.dataset.desktopSrc;


    if (
      currentDocSource === desiredSource
    ) {
      return;
    }


    currentDocSource = desiredSource;


    docVideo.pause();

    docVideo.src = desiredSource;

    docVideo.load();


    if (
      activeMediaId ===
      "media-document-control"
    ) {

      docVideo.play().catch(() => {
        // Muted autoplay should normally work.
      });

    }

  }



  /* =========================================================
     RESET / START MOBILE DOCUMENT CONTROL ANIMATION
  ========================================================= */

  function startDocumentControlAnimation() {

    if (!docVideo) {
      return;
    }


    /*
      Absolutely no zoom animation on desktop.
    */

    if (!mobileQuery.matches) {

      docVideo.classList.remove(
        "doc-mobile-zoom"
      );

      document.body.classList.remove(
        "doc-mobile-freeze"
      );

      docAnimationFrozen = false;

      return;
    }


    /*
      Clear the previous frozen state.
    */

    document.body.classList.remove(
      "doc-mobile-freeze"
    );

    docAnimationFrozen = false;


    /*
      Restart animation from the beginning.
    */

    docVideo.classList.remove(
      "doc-mobile-zoom"
    );


    void docVideo.offsetWidth;


    docVideo.classList.add(
      "doc-mobile-zoom"
    );

  }



  /* =========================================================
     FREEZE DOCUMENT CONTROL ANIMATION
     WHEN CARD REACHES SCREEN MIDDLE
  ========================================================= */

  function updateDocumentControlFreeze() {

    if (
      !mobileQuery.matches ||
      !docCard ||
      activeMediaId !==
        "media-document-control"
    ) {

      return;

    }


    /*
      Once frozen, leave it frozen.

      This prevents the background from starting
      to move again while the user is reading.
    */

    if (docAnimationFrozen) {
      return;
    }


    const cardRect =
      docCard.getBoundingClientRect();


    const cardCenter =
      cardRect.top +
      cardRect.height / 2;


    const screenMiddle =
      window.innerHeight / 2;


    /*
      As soon as the centre of the card reaches
      the centre of the mobile screen:
      STOP the zoom animation.
    */

    if (
      cardCenter <= screenMiddle
    ) {

      document.body.classList.add(
        "doc-mobile-freeze"
      );

      docAnimationFrozen = true;

    }

  }



  /* =========================================================
     ACTIVATE MEDIA
  ========================================================= */

  function activateMedia(
    mediaId,
    force = false
  ) {

    const mediaChanged =
      activeMediaId !== mediaId;


    if (
      !force &&
      !mediaChanged
    ) {
      return;
    }


    activeMediaId = mediaId;


    mediaLayers.forEach((layer) => {

      const videos =
        layer.querySelectorAll("video");


      if (
        layer.id === mediaId
      ) {

        layer.classList.add(
          "active"
        );


        videos.forEach((video) => {

          video.play().catch(() => {
            // Ignore temporary autoplay restriction.
          });

        });


      } else {

        layer.classList.remove(
          "active"
        );


        videos.forEach((video) => {

          video.pause();


          try {

            video.currentTime = 0;

          } catch (error) {

            // Metadata may not yet be loaded.

          }

        });

      }

    });


    /*
      Entering Document Control on mobile:
      start its zoom animation.
    */

    if (
      mediaId ===
        "media-document-control" &&
      mediaChanged
    ) {

      startDocumentControlAnimation();

    }


    /*
      Leaving Document Control:
      clean up its mobile animation state.
    */

    if (
      mediaId !==
      "media-document-control"
    ) {

      document.body.classList.remove(
        "doc-mobile-freeze"
      );

      docAnimationFrozen = false;


      if (docVideo) {

        docVideo.classList.remove(
          "doc-mobile-zoom"
        );

      }

    }

  }



  /* =========================================================
     DESKTOP STORY OBSERVER

     DESKTOP BEHAVIOUR REMAINS AS BEFORE.
  ========================================================= */

  const desktopObserver =
    new IntersectionObserver(

      (entries) => {

        if (mobileQuery.matches) {
          return;
        }


        entries.forEach((entry) => {

          if (
            !entry.isIntersecting
          ) {
            return;
          }


          const mediaId =
            entry.target.dataset.media;


          if (mediaId) {

            activateMedia(mediaId);

          }

        });

      },

      {
        root: null,

        rootMargin:
          "-35% 0px -35% 0px",

        threshold: 0
      }

    );


  storySteps.forEach((step) => {

    desktopObserver.observe(step);

  });



  /* =========================================================
     MOBILE MEDIA SWITCHING

     CONNECTED PLATFORM APPEARS ONLY AFTER
     DOCUMENT CONTROL CARD HAS COMPLETELY
     PASSED THE TOP OF THE SCREEN.
  ========================================================= */

  function updateMobileMedia() {

    if (!mobileQuery.matches) {
      return;
    }


    if (
      storySteps.length === 0
    ) {
      return;
    }


    let activeIndex = 0;


    for (
      let i = 1;
      i < storySteps.length;
      i++
    ) {

      const previousStep =
        storySteps[i - 1];


      const previousCard =
        previousStep.querySelector(
          ".story-card"
        );


      if (!previousCard) {
        break;
      }


      const previousCardRect =
        previousCard.getBoundingClientRect();


      /*
        FINISH LINE:

        The next media does not appear until
        the previous card's BOTTOM has passed
        the TOP of the viewport.
      */

      if (
        previousCardRect.bottom <= 0
      ) {

        activeIndex = i;

      } else {

        break;

      }

    }


    const activeStep =
      storySteps[activeIndex];


    const mediaId =
      activeStep.dataset.media;


    if (mediaId) {

      activateMedia(mediaId);

    }


    /*
      Independently check whether the
      Document Control animation should freeze.
    */

    updateDocumentControlFreeze();

  }



  /* =========================================================
     MOBILE SCROLL HANDLER
  ========================================================= */

  function handleMobileScroll() {

    if (!mobileQuery.matches) {
      return;
    }


    if (mobileScrollTicking) {
      return;
    }


    mobileScrollTicking = true;


    window.requestAnimationFrame(
      () => {

        updateMobileMedia();

        mobileScrollTicking = false;

      }
    );

  }


  window.addEventListener(
    "scroll",
    handleMobileScroll,
    {
      passive: true
    }
  );



  /* =========================================================
     DESKTOP / MOBILE CHANGE
  ========================================================= */

  function handleViewportChange() {

    setDocumentControlSource();


    if (mobileQuery.matches) {

      activeMediaId = null;

      updateMobileMedia();


    } else {


      /*
        Remove every mobile-only animation state.
      */

      document.body.classList.remove(
        "doc-mobile-freeze"
      );

      docAnimationFrozen = false;


      if (docVideo) {

        docVideo.classList.remove(
          "doc-mobile-zoom"
        );

      }


      /*
        Determine which desktop step currently
        occupies the centre of the viewport.
      */

      let closestStep = null;

      let closestDistance =
        Infinity;


      const viewportCenter =
        window.innerHeight / 2;


      storySteps.forEach((step) => {

        const rect =
          step.getBoundingClientRect();


        if (
          rect.bottom <= 0 ||
          rect.top >=
            window.innerHeight
        ) {
          return;
        }


        const stepCenter =
          rect.top +
          rect.height / 2;


        const distance =
          Math.abs(
            stepCenter -
            viewportCenter
          );


        if (
          distance <
          closestDistance
        ) {

          closestDistance =
            distance;

          closestStep =
            step;

        }

      });


      if (closestStep) {

        const mediaId =
          closestStep.dataset.media;


        if (mediaId) {

          activeMediaId = null;

          activateMedia(mediaId);

        }

      }

    }

  }



  if (
    mobileQuery.addEventListener
  ) {

    mobileQuery.addEventListener(
      "change",
      handleViewportChange
    );


  } else {

    mobileQuery.addListener(
      handleViewportChange
    );

  }



  /* =========================================================
     TAB VISIBILITY
  ========================================================= */

  document.addEventListener(
    "visibilitychange",
    () => {

      if (document.hidden) {

        mediaLayers.forEach(
          (layer) => {

            layer
              .querySelectorAll("video")
              .forEach((video) => {

                video.pause();

              });

          }
        );


      } else {


        mediaLayers.forEach(
          (layer) => {

            if (
              layer.id ===
              activeMediaId
            ) {

              layer
                .querySelectorAll("video")
                .forEach((video) => {

                  video
                    .play()
                    .catch(() => {});

                });

            }

          }
        );

      }

    }
  );



  /* =========================================================
     INITIAL STATE
  ========================================================= */

  setDocumentControlSource();


  if (mobileQuery.matches) {

    updateMobileMedia();

  } else {

    activateMedia(
      "media-document-control"
    );

  }

});

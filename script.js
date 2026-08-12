document.addEventListener("DOMContentLoaded", () => {

  const storySteps = Array.from(
    document.querySelectorAll(".story-step")
  );

  const mediaLayers = Array.from(
    document.querySelectorAll(".media-layer")
  );


  const docVideo =
    document.getElementById(
      "doc-control-video"
    );


  const docStep =
    document.querySelector(
      '.story-step[data-media="media-document-control"]'
    );


  const docCard =
    docStep
      ? docStep.querySelector(
          ".story-card"
        )
      : null;


  const connectedPlatformLayer =
    document.getElementById(
      "media-connected-platform"
    );


  const connectedPlatformStep =
    document.querySelector(
      '.story-step[data-media="media-connected-platform"]'
    );


  const connectedPlatformCard =
    connectedPlatformStep
      ? connectedPlatformStep.querySelector(
          ".story-card"
        )
      : null;


  const mobileQuery =
    window.matchMedia(
      "(max-width: 768px)"
    );


  let activeMediaId = null;

  let currentDocSource = "";

  let mobileScrollTicking = false;

  let docAnimationSettled = false;

  let docSettleTimer = null;



  /* =========================================================
     DOCUMENT CONTROL VIDEO SOURCE
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
      currentDocSource ===
      desiredSource
    ) {
      return;
    }


    currentDocSource =
      desiredSource;


    docVideo.pause();

    docVideo.src =
      desiredSource;

    docVideo.load();


    if (
      activeMediaId ===
      "media-document-control"
    ) {

      docVideo
        .play()
        .catch(() => {});

    }

  }



  /* =========================================================
     CLEAR DOCUMENT CONTROL MOBILE VISUAL STATE
  ========================================================= */

  function clearDocumentControlVisualState() {

    if (!docVideo) {
      return;
    }


    if (docSettleTimer) {

      window.clearTimeout(
        docSettleTimer
      );

      docSettleTimer = null;

    }


    docVideo.classList.remove(
      "doc-mobile-zoom",
      "doc-mobile-returning",
      "doc-mobile-settled"
    );


    docVideo.style.animation =
      "";

    docVideo.style.transition =
      "";

    docVideo.style.transform =
      "";

    docVideo.style.transformOrigin =
      "";


    docAnimationSettled =
      false;

  }



  /* =========================================================
     START MOBILE DOCUMENT CONTROL ZOOM
  ========================================================= */

  function startDocumentControlAnimation() {

    if (!docVideo) {
      return;
    }


    /*
      Desktop / laptop must never receive
      the mobile zoom effect.
    */

    if (
      !mobileQuery.matches
    ) {

      clearDocumentControlVisualState();

      return;

    }


    clearDocumentControlVisualState();


    /*
      Force browser reflow so animation
      genuinely starts again from 0%.
    */

    void docVideo.offsetWidth;


    docVideo.classList.add(
      "doc-mobile-zoom"
    );

  }



  /* =========================================================
     RETURN DOCUMENT CONTROL TO ORIGINAL FULL PAGE
  ========================================================= */

  function settleDocumentControlToFullPage() {

    if (
      !docVideo ||
      !mobileQuery.matches ||
      docAnimationSettled
    ) {
      return;
    }


    docAnimationSettled =
      true;


    /*
      Capture the exact current position
      of the running animation.
    */

    const currentStyle =
      window.getComputedStyle(
        docVideo
      );


    const currentTransform =
      currentStyle.transform;


    const currentOrigin =
      currentStyle.transformOrigin;


    docVideo.style.transform =
      currentTransform;


    docVideo.style.transformOrigin =
      currentOrigin;


    /*
      Stop animation at its current position.
    */

    docVideo.classList.remove(
      "doc-mobile-zoom"
    );


    docVideo.classList.add(
      "doc-mobile-returning"
    );


    docVideo.style.animation =
      "none";


    void docVideo.offsetWidth;


    /*
      Smoothly return to the original
      full-page composition.
    */

    docVideo.style.transition =
      "transform 500ms ease-in-out";


    window.requestAnimationFrame(
      () => {

        docVideo.style.transform =
          "none";

      }
    );


    /*
      Lock the video at the original
      full-page composition.
    */

    docSettleTimer =
      window.setTimeout(
        () => {

          if (!docVideo) {
            return;
          }


          docVideo.classList.remove(
            "doc-mobile-returning"
          );


          docVideo.classList.add(
            "doc-mobile-settled"
          );


          docVideo.style.animation =
            "";

          docVideo.style.transition =
            "";

          docVideo.style.transform =
            "";

          docVideo.style.transformOrigin =
            "";


          docSettleTimer =
            null;

        },

        560
      );

  }



  /* =========================================================
     CHECK DOCUMENT CONTROL READING POSITION
  ========================================================= */

  function updateDocumentControlReadingState() {

    if (
      !mobileQuery.matches ||
      !docCard ||
      activeMediaId !==
        "media-document-control" ||
      docAnimationSettled
    ) {
      return;
    }


    const cardRect =
      docCard.getBoundingClientRect();


    const viewportHeight =
      window.visualViewport
        ? window.visualViewport.height
        : window.innerHeight;


    const viewportMiddle =
      viewportHeight / 2;


    const cardMiddle =
      cardRect.top +
      cardRect.height / 2;


    /*
      When the centre of the card reaches
      the centre of the screen, return
      Document Control to its original
      full-page view.
    */

    if (
      cardMiddle <=
      viewportMiddle
    ) {

      settleDocumentControlToFullPage();

    }

  }



  /* =========================================================
     ACTIVATE STORY MEDIA
  ========================================================= */

  function activateMedia(
    mediaId,
    force = false,
    restartDocumentAnimation = true
  ) {

    const mediaChanged =
      activeMediaId !==
      mediaId;


    if (
      !force &&
      !mediaChanged
    ) {
      return;
    }


    activeMediaId =
      mediaId;


    mediaLayers.forEach(
      (layer) => {

        const videos =
          layer.querySelectorAll(
            "video"
          );


        if (
          layer.id ===
          mediaId
        ) {

          layer.classList.add(
            "active"
          );


          videos.forEach(
            (video) => {

              video
                .play()
                .catch(() => {});

            }
          );


        } else {

          layer.classList.remove(
            "active"
          );


          videos.forEach(
            (video) => {

              video.pause();


              try {

                video.currentTime =
                  0;

              } catch (error) {

                /*
                  Video metadata may not
                  have loaded yet.
                */

              }

            }
          );

        }

      }
    );


    /* =====================================================
       ENTERING DOCUMENT CONTROL
    ===================================================== */

    if (
      mediaId ===
        "media-document-control" &&
      mediaChanged &&
      restartDocumentAnimation
    ) {

      startDocumentControlAnimation();

    }


    /* =====================================================
       LEAVING DOCUMENT CONTROL
    ===================================================== */

    if (
      mediaId !==
      "media-document-control"
    ) {

      clearDocumentControlVisualState();

    }

  }



  /* =========================================================
     DESKTOP STORY OBSERVER

     LAPTOP / DESKTOP BEHAVIOUR REMAINS UNCHANGED.
  ========================================================= */

  const desktopObserver =
    new IntersectionObserver(

      (entries) => {

        if (
          mobileQuery.matches
        ) {
          return;
        }


        entries.forEach(
          (entry) => {

            if (
              !entry.isIntersecting
            ) {
              return;
            }


            const mediaId =
              entry.target.dataset.media;


            if (
              mediaId
            ) {

              activateMedia(
                mediaId
              );

            }

          }
        );

      },

      {
        root: null,

        rootMargin:
          "-35% 0px -35% 0px",

        threshold: 0
      }

    );


  storySteps.forEach(
    (step) => {

      desktopObserver.observe(
        step
      );

    }
  );



  /* =========================================================
     MOBILE CONNECTED PLATFORM HANDOFF

     MOBILE ONLY.

     REQUIRED SEQUENCE:

     1. Document Control card completely leaves the top.
     2. Connected Platform starts below the viewport.
     3. Connected Platform rises 1:1 with scrolling.
     4. It stops when it reaches the ceiling.
     5. Only after that does the Quality Management
        card come upward from below.
  ========================================================= */

  function getMobileViewportHeight() {

    return window.visualViewport
      ? window.visualViewport.height
      : window.innerHeight;

  }



  /* =========================================================
     RESET CONNECTED PLATFORM MOBILE STATE
  ========================================================= */

  function resetConnectedPlatformMobileState() {

    if (
      connectedPlatformLayer
    ) {

      connectedPlatformLayer
        .style
        .transform =
          "";

    }


    if (
      connectedPlatformStep
    ) {

      connectedPlatformStep
        .classList
        .remove(
          "copy-scroll-active"
        );

    }


    if (
      connectedPlatformCard
    ) {

      connectedPlatformCard
        .style
        .transform =
          "";

    }

  }



  /* =========================================================
     UPDATE MOBILE MEDIA
  ========================================================= */

  function updateMobileMedia() {

    if (
      !mobileQuery.matches
    ) {
      return;
    }


    if (
      !docCard ||
      !connectedPlatformLayer ||
      !connectedPlatformStep ||
      !connectedPlatformCard
    ) {

      updateDocumentControlReadingState();

      return;

    }


    const viewportHeight =
      getMobileViewportHeight();


    const docCardRect =
      docCard.getBoundingClientRect();



    /* =====================================================
       CONNECTED PLATFORM SCREEN MOVEMENT

       Before the Document Control card leaves the top,
       Connected Platform remains exactly one screen below.

       At:

       docCardRect.bottom === 0

       Connected Platform begins at the bottom edge.

       Every additional pixel of scroll moves
       Connected Platform upward by one pixel.
    ===================================================== */

    const connectedPlatformOffset =
      Math.max(
        0,
        Math.min(
          viewportHeight,
          viewportHeight +
            docCardRect.bottom
        )
      );


    connectedPlatformLayer
      .style
      .transform =
        `translate3d(
          0,
          ${connectedPlatformOffset}px,
          0
        )`;



    /* =====================================================
       CONNECTED PLATFORM IS STILL MOVING UP
    ===================================================== */

    if (
      connectedPlatformOffset >
      0
    ) {

      connectedPlatformStep
        .classList
        .remove(
          "copy-scroll-active"
        );


      connectedPlatformCard
        .style
        .transform =
          "";


      /*
        Document Control stays underneath
        while Connected Platform slides upward.
      */

      if (
        activeMediaId !==
        "media-document-control"
      ) {

        const reversingFromConnectedPlatform =
          activeMediaId ===
          "media-connected-platform";


        activateMedia(
          "media-document-control",
          false,
          !reversingFromConnectedPlatform
        );

      }


      updateDocumentControlReadingState();

      return;

    }



    /* =====================================================
       CONNECTED PLATFORM HAS HIT THE CEILING

       It is now fully covering the viewport.

       Switching the active media layer at this point
       produces no visual jump.
    ===================================================== */

    if (
      activeMediaId !==
      "media-connected-platform"
    ) {

      activateMedia(
        "media-connected-platform"
      );

    }



    /* =====================================================
       DISTANCE SCROLLED AFTER THE SCREEN HIT THE TOP
    ===================================================== */

    const postHandoffScroll =
      Math.max(
        0,
        -docCardRect.bottom -
          viewportHeight
      );



    /* =====================================================
       QUALITY MANAGEMENT CARD

       At the exact moment Connected Platform reaches
       the ceiling, place the card just below the screen.

       Continued scrolling then moves the card upward
       one pixel for every pixel scrolled.
    ===================================================== */

    connectedPlatformCard
      .style
      .transform =
        "none";


    const naturalCardRect =
      connectedPlatformCard
        .getBoundingClientRect();


    const desiredCardTop =
      viewportHeight +
      24 -
      postHandoffScroll;


    const cardOffset =
      desiredCardTop -
      naturalCardRect.top;


    connectedPlatformCard
      .style
      .transform =
        `translate3d(
          0,
          ${cardOffset}px,
          0
        )`;


    connectedPlatformStep
      .classList
      .add(
        "copy-scroll-active"
      );


    updateDocumentControlReadingState();

  }



  /* =========================================================
     MOBILE SCROLL HANDLER
  ========================================================= */

  function handleMobileScroll() {

    if (
      !mobileQuery.matches ||
      mobileScrollTicking
    ) {
      return;
    }


    mobileScrollTicking =
      true;


    window.requestAnimationFrame(
      () => {

        updateMobileMedia();

        mobileScrollTicking =
          false;

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
     MOBILE SAFARI VIEWPORT CHANGES
  ========================================================= */

  if (
    window.visualViewport
  ) {

    window.visualViewport
      .addEventListener(
        "resize",
        () => {

          if (
            mobileQuery.matches
          ) {

            updateMobileMedia();

          }

        }
      );

  }



  /* =========================================================
     DESKTOP / MOBILE CHANGE
  ========================================================= */

  function handleViewportChange() {

    setDocumentControlSource();


    /* =========================
       MOBILE
    ========================= */

    if (
      mobileQuery.matches
    ) {

      activeMediaId =
        null;


      resetConnectedPlatformMobileState();


      updateMobileMedia();


      return;

    }



    /* =========================
       DESKTOP / LAPTOP
    ========================= */

    /*
      Remove all mobile-only
      Connected Platform styles.
    */

    resetConnectedPlatformMobileState();


    /*
      Remove all mobile-only
      Document Control transforms.
    */

    clearDocumentControlVisualState();


    let closestStep =
      null;


    let closestDistance =
      Infinity;


    const viewportCenter =
      window.innerHeight /
      2;


    storySteps.forEach(
      (step) => {

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

      }
    );


    if (
      closestStep
    ) {

      const mediaId =
        closestStep.dataset.media;


      if (
        mediaId
      ) {

        activeMediaId =
          null;


        activateMedia(
          mediaId
        );

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

      if (
        document.hidden
      ) {

        mediaLayers.forEach(
          (layer) => {

            layer
              .querySelectorAll(
                "video"
              )
              .forEach(
                (video) => {

                  video.pause();

                }
              );

          }
        );


        return;

      }


      mediaLayers.forEach(
        (layer) => {

          if (
            layer.id !==
            activeMediaId
          ) {
            return;
          }


          layer
            .querySelectorAll(
              "video"
            )
            .forEach(
              (video) => {

                video
                  .play()
                  .catch(
                    () => {}
                  );

              }
            );

        }
      );

    }
  );



  /* =========================================================
     INITIAL STATE
  ========================================================= */

  setDocumentControlSource();


  if (
    mobileQuery.matches
  ) {

    updateMobileMedia();

  } else {

    activateMedia(
      "media-document-control"
    );

  }

});

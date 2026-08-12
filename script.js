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
        // Muted inline autoplay should normally work.
      });

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


    /*
      Remove temporary inline styles created
      during the return-to-full-page transition.
    */

    docVideo.style.animation = "";
    docVideo.style.transition = "";
    docVideo.style.transform = "";
    docVideo.style.transformOrigin = "";


    docAnimationSettled = false;

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

    if (!mobileQuery.matches) {

      clearDocumentControlVisualState();

      return;

    }


    clearDocumentControlVisualState();


    /*
      Force browser reflow so the animation
      genuinely restarts at 0%.
    */

    void docVideo.offsetWidth;


    docVideo.classList.add(
      "doc-mobile-zoom"
    );

  }



  /* =========================================================
     RETURN DOCUMENT CONTROL TO ORIGINAL FULL PAGE

     THIS REPLACES THE OLD "PAUSE THE ANIMATION" LOGIC.
  ========================================================= */

  function settleDocumentControlToFullPage() {

    if (
      !docVideo ||
      !mobileQuery.matches ||
      docAnimationSettled
    ) {
      return;
    }


    docAnimationSettled = true;


    /*
      Read the EXACT transform currently produced
      by the running CSS animation.

      This is important:
      otherwise removing the animation would cause
      the image to jump immediately.
    */

    const currentStyle =
      window.getComputedStyle(
        docVideo
      );


    const currentTransform =
      currentStyle.transform;


    const currentOrigin =
      currentStyle.transformOrigin;


    /*
      Preserve the current visible zoom position
      as inline CSS.
    */

    docVideo.style.transform =
      currentTransform;


    docVideo.style.transformOrigin =
      currentOrigin;


    /*
      Disable the animation while retaining
      that exact visible position.
    */

    docVideo.classList.remove(
      "doc-mobile-zoom"
    );


    docVideo.classList.add(
      "doc-mobile-returning"
    );


    docVideo.style.animation =
      "none";


    /*
      Force Safari/browser to acknowledge
      the current frozen transform.
    */

    void docVideo.offsetWidth;


    /*
      Now smoothly return from the current
      zoom/pan position to the ORIGINAL FULL PAGE.
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
      After the zoom-out finishes,
      lock the background permanently
      at the original full-page composition.
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


          docVideo.style.animation = "";
          docVideo.style.transition = "";
          docVideo.style.transform = "";
          docVideo.style.transformOrigin = "";


          docSettleTimer = null;

        },

        560
      );

  }



  /* =========================================================
     CHECK WHETHER DOCUMENT CONTROL CARD HAS
     REACHED THE MIDDLE OF THE MOBILE SCREEN
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


    /*
      Use the visual viewport on mobile where possible.

      This is more dependable on Safari when the
      browser toolbar expands / collapses.
    */

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
      When the CARD'S CENTRE reaches
      the SCREEN'S CENTRE:

      1. Kill the zoom animation.
      2. Smoothly zoom back out.
      3. Lock at the original full page.
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


    activeMediaId =
      mediaId;


    /*
      MOBILE COPY VISIBILITY

      Connected Platform card must stay hidden until
      Connected Platform is the active mobile media.

      Desktop / laptop is intentionally untouched.
    */

    const connectedPlatformStep =
      document.querySelector(
        '.story-step[data-media="media-connected-platform"]'
      );


    if (connectedPlatformStep) {

      if (
        mobileQuery.matches &&
        mediaId ===
          "media-connected-platform"
      ) {

        connectedPlatformStep.classList.add(
          "copy-media-active"
        );


      } else {

        connectedPlatformStep.classList.remove(
          "copy-media-active"
        );

      }

    }


    mediaLayers.forEach(
      (layer) => {

        const videos =
          layer.querySelectorAll(
            "video"
          );


        if (
          layer.id === mediaId
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

                video.currentTime = 0;

              } catch (error) {

                /*
                  Video metadata may not yet
                  have loaded.
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
      mediaChanged
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

     PRESERVES EXISTING LAPTOP BEHAVIOUR.
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


            if (mediaId) {

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
     MOBILE MEDIA SWITCHING

     THE CONNECTED PLATFORM DOES NOT APPEAR UNTIL
     THE DOCUMENT CONTROL CARD HAS COMPLETELY
     CROSSED ABOVE THE TOP OF THE SCREEN.
  ========================================================= */

  function updateMobileMedia() {

    if (
      !mobileQuery.matches
    ) {
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
        FINISH LINE = TOP OF SCREEN

        Only advance after the WHOLE previous
        card has left the viewport.
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
      storySteps[
        activeIndex
      ];


    const mediaId =
      activeStep.dataset.media;


    if (mediaId) {

      activateMedia(
        mediaId
      );

    }


    /*
      Separate from the media-switch logic,
      check whether the Document Control
      card has reached reading position.
    */

    updateDocumentControlReadingState();

  }



  /* =========================================================
     MOBILE SCROLL HANDLER
  ========================================================= */

  function handleMobileScroll() {

    if (
      !mobileQuery.matches
    ) {
      return;
    }


    if (
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

    window.visualViewport.addEventListener(
      "resize",
      () => {

        if (
          mobileQuery.matches
        ) {

          updateDocumentControlReadingState();

        }

      }
    );

  }



  /* =========================================================
     DESKTOP / MOBILE CHANGE
  ========================================================= */

  function handleViewportChange() {

    setDocumentControlSource();


    if (
      mobileQuery.matches
    ) {

      activeMediaId = null;

      updateMobileMedia();


    } else {


      /*
        Strip ALL mobile-only Document
        Control transforms from desktop.
      */

      clearDocumentControlVisualState();


      let closestStep = null;

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


      if (closestStep) {

        const mediaId =
          closestStep.dataset.media;


        if (mediaId) {

          activeMediaId = null;

          activateMedia(
            mediaId
          );

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


      } else {


        mediaLayers.forEach(
          (layer) => {

            if (
              layer.id ===
              activeMediaId
            ) {

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

          }
        );

      }

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

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


  const supplierVideo =
    document.getElementById(
      "supplier-management-video"
    );


  const supplierLayer =
    document.getElementById(
      "media-supplier-management"
    );


  const supplierStep =
    document.querySelector(
      '.story-step[data-media="media-supplier-management"]'
    );


  const supplierCard =
    supplierStep
      ? supplierStep.querySelector(
          ".story-card"
        )
      : null;


  const freeTrialLayer =
    document.getElementById(
      "media-free-trial"
    );


  const freeTrialStep =
    document.querySelector(
      '.story-step[data-media="media-free-trial"]'
    );


  const freeTrialCard =
    freeTrialStep
      ? freeTrialStep.querySelector(
          ".story-card"
        )
      : null;


  const mobileQuery =
    window.matchMedia(
      "(max-width: 768px)"
    );


  let activeMediaId = null;

  let currentDocSource = "";

  let currentSupplierSource = "";

  let mobileScrollTicking = false;


  /* =========================================================
     DOCUMENT CONTROL MOBILE ANIMATION STATE
  ========================================================= */

  let docAnimationSettled = false;

  let docSettleTimer = null;

  let docCardWasAtOrAboveMiddle = null;


  /* =========================================================
     SUPPLIER MANAGEMENT MOBILE ANIMATION STATE
  ========================================================= */

  let supplierZoomTimer = null;

  let supplierReturnTimer = null;

  let supplierAtCeiling = false;

  let supplierAnimationSettled = false;

  let supplierCardWasAtOrAboveMiddle = null;



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
     SUPPLIER MANAGEMENT VIDEO SOURCE
  ========================================================= */

  function setSupplierManagementSource() {

    if (!supplierVideo) {
      return;
    }


    const desiredSource =
      mobileQuery.matches
        ? supplierVideo.dataset.mobileSrc
        : supplierVideo.dataset.desktopSrc;


    if (
      currentSupplierSource ===
      desiredSource
    ) {
      return;
    }


    currentSupplierSource =
      desiredSource;


    supplierVideo.pause();

    supplierVideo.src =
      desiredSource;

    supplierVideo.load();


    if (
      activeMediaId ===
      "media-supplier-management"
    ) {

      supplierVideo
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
     START / RESUME MOBILE DOCUMENT CONTROL ZOOM
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
      Force browser reflow so the animation
      genuinely starts again from 0%.

      This is also what lets the animation
      restart when reverse-scrolling across
      the card-middle trigger.
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

     BIDIRECTIONAL RULE:

     DOWN:
     Card crosses the screen middle upward
     → return to full-page view.

     UP:
     Card crosses the screen middle downward
     → restart the zoom / pan animation.
  ========================================================= */

  function updateDocumentControlReadingState() {

    if (
      !mobileQuery.matches ||
      !docCard ||
      activeMediaId !==
        "media-document-control"
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


    const cardAtOrAboveMiddle =
      cardMiddle <=
      viewportMiddle;


    /*
      First reading establishes which side
      of the trigger the card is currently on.
    */

    if (
      docCardWasAtOrAboveMiddle ===
      null
    ) {

      docCardWasAtOrAboveMiddle =
        cardAtOrAboveMiddle;


      if (
        cardAtOrAboveMiddle &&
        !docAnimationSettled
      ) {

        settleDocumentControlToFullPage();

      }


      return;

    }


    /*
      DOWN-SCROLL:
      card crosses upward through the middle.
    */

    if (
      cardAtOrAboveMiddle &&
      !docCardWasAtOrAboveMiddle
    ) {

      settleDocumentControlToFullPage();

    }


    /*
      UP-SCROLL:
      card crosses downward through the middle.
    */

    if (
      !cardAtOrAboveMiddle &&
      docCardWasAtOrAboveMiddle
    ) {

      startDocumentControlAnimation();

    }


    docCardWasAtOrAboveMiddle =
      cardAtOrAboveMiddle;

  }



  /* =========================================================
     SUPPLIER MANAGEMENT ZOOM HELPERS
  ========================================================= */

  function clearSupplierZoomTimer() {

    if (!supplierZoomTimer) {
      return;
    }


    window.clearTimeout(
      supplierZoomTimer
    );

    supplierZoomTimer = null;

  }


  function clearSupplierReturnTimer() {

    if (!supplierReturnTimer) {
      return;
    }


    window.clearTimeout(
      supplierReturnTimer
    );

    supplierReturnTimer = null;

  }


  function clearSupplierManagementVisualState() {

    clearSupplierZoomTimer();

    clearSupplierReturnTimer();


    supplierAnimationSettled =
      false;


    if (!supplierVideo) {
      return;
    }


    supplierVideo.classList.remove(
      "supplier-mobile-zoom",
      "supplier-mobile-returning",
      "supplier-mobile-settled"
    );

  }



  /* =========================================================
     START SUPPLIER MANAGEMENT ZOOM
  ========================================================= */

  function startSupplierManagementZoom() {

    if (
      !supplierVideo ||
      !mobileQuery.matches ||
      !supplierAtCeiling
    ) {
      return;
    }


    clearSupplierZoomTimer();

    clearSupplierReturnTimer();


    supplierAnimationSettled =
      false;


    supplierVideo.classList.remove(
      "supplier-mobile-returning",
      "supplier-mobile-settled"
    );


    /*
      Force the browser to register the
      non-zoom state first so reverse-scroll
      can animate smoothly back into zoom.
    */

    void supplierVideo.offsetWidth;


    supplierVideo.classList.add(
      "supplier-mobile-zoom"
    );

  }



  /* =========================================================
     DELAYED SUPPLIER MANAGEMENT ZOOM

     Only the first arrival at the ceiling uses
     the 1.5-second delay.
  ========================================================= */

  function scheduleSupplierManagementZoom() {

    if (
      !supplierVideo ||
      !supplierCard ||
      !mobileQuery.matches ||
      !supplierAtCeiling ||
      supplierZoomTimer ||
      supplierVideo.classList.contains(
        "supplier-mobile-zoom"
      ) ||
      supplierAnimationSettled
    ) {
      return;
    }


    supplierZoomTimer =
      window.setTimeout(
        () => {

          supplierZoomTimer =
            null;


          if (
            !mobileQuery.matches ||
            !supplierAtCeiling ||
            activeMediaId !==
              "media-supplier-management" ||
            !supplierCard
          ) {
            return;
          }


          const viewportHeight =
            getMobileViewportHeight();


          const cardRect =
            supplierCard.getBoundingClientRect();


          const cardMiddle =
            cardRect.top +
            cardRect.height / 2;


          /*
            If the reader has already brought
            the card to the middle, do not zoom.
          */

          if (
            cardMiddle <=
            viewportHeight / 2
          ) {
            return;
          }


          startSupplierManagementZoom();

        },

        1500
      );

  }



  /* =========================================================
     RETURN SUPPLIER MANAGEMENT TO FULL PAGE
  ========================================================= */

  function settleSupplierManagementToFullPage() {

    if (
      !supplierVideo ||
      !mobileQuery.matches
    ) {
      return;
    }


    clearSupplierZoomTimer();

    clearSupplierReturnTimer();


    supplierAnimationSettled =
      true;


    /*
      If the 1.5-second zoom has not started yet,
      simply lock the already-full-page view.
    */

    if (
      !supplierVideo.classList.contains(
        "supplier-mobile-zoom"
      )
    ) {

      supplierVideo.classList.remove(
        "supplier-mobile-returning"
      );

      supplierVideo.classList.add(
        "supplier-mobile-settled"
      );

      return;

    }


    /*
      Smooth return from zoom to full page.
    */

    supplierVideo.classList.remove(
      "supplier-mobile-zoom",
      "supplier-mobile-settled"
    );


    supplierVideo.classList.add(
      "supplier-mobile-returning"
    );


    supplierReturnTimer =
      window.setTimeout(
        () => {

          if (!supplierVideo) {
            return;
          }


          supplierVideo.classList.remove(
            "supplier-mobile-returning"
          );


          supplierVideo.classList.add(
            "supplier-mobile-settled"
          );


          supplierReturnTimer =
            null;

        },

        760
      );

  }



  /* =========================================================
     CHECK SUPPLIER MANAGEMENT READING POSITION

     DOWN:
     Card reaches / passes middle
     → return to full page.

     UP:
     Card crosses back below middle
     → restore zoom immediately.
  ========================================================= */

  function updateSupplierManagementReadingState(
    viewportHeight
  ) {

    if (
      !mobileQuery.matches ||
      !supplierCard ||
      !supplierVideo ||
      !supplierAtCeiling ||
      activeMediaId !==
        "media-supplier-management"
    ) {
      return;
    }


    const cardRect =
      supplierCard.getBoundingClientRect();


    const viewportMiddle =
      viewportHeight / 2;


    const cardMiddle =
      cardRect.top +
      cardRect.height / 2;


    const cardAtOrAboveMiddle =
      cardMiddle <=
      viewportMiddle;


    if (
      supplierCardWasAtOrAboveMiddle ===
      null
    ) {

      supplierCardWasAtOrAboveMiddle =
        cardAtOrAboveMiddle;


      if (
        cardAtOrAboveMiddle
      ) {

        settleSupplierManagementToFullPage();

      }


      return;

    }


    /* DOWN-SCROLL */

    if (
      cardAtOrAboveMiddle &&
      !supplierCardWasAtOrAboveMiddle
    ) {

      settleSupplierManagementToFullPage();

    }


    /* UP-SCROLL */

    if (
      !cardAtOrAboveMiddle &&
      supplierCardWasAtOrAboveMiddle
    ) {

      startSupplierManagementZoom();

    }


    supplierCardWasAtOrAboveMiddle =
      cardAtOrAboveMiddle;

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
     MOBILE STORY HANDOFFS

     STAGE 1:
     DOCUMENT CONTROL
     →
     CONNECTED PLATFORM
     →
     QUALITY MANAGEMENT CARD

     STAGE 2:
     QUALITY MANAGEMENT CARD
     →
     SUPPLIER MANAGEMENT
     →
     SUPPLIER MANAGEMENT CARD

     STAGE 3:
     SUPPLIER MANAGEMENT CARD
     →
     FREE TRIAL
     →
     FREE TRIAL CARD
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
     RESET SUPPLIER MANAGEMENT MOBILE STATE
  ========================================================= */

  function resetSupplierManagementMobileState() {

    clearSupplierManagementVisualState();


    supplierAtCeiling =
      false;

    supplierCardWasAtOrAboveMiddle =
      null;


    if (
      supplierLayer
    ) {

      supplierLayer
        .style
        .transform =
          "";

    }


    if (
      supplierStep
    ) {

      supplierStep
        .classList
        .remove(
          "copy-scroll-active"
        );

    }


    if (
      supplierCard
    ) {

      supplierCard
        .style
        .transform =
          "";

    }

  }



  /* =========================================================
     RESET FREE TRIAL MOBILE STATE
  ========================================================= */

  function resetFreeTrialMobileState() {

    if (
      freeTrialLayer
    ) {

      freeTrialLayer
        .style
        .transform =
          "";

    }


    if (
      freeTrialStep
    ) {

      freeTrialStep
        .classList
        .remove(
          "copy-scroll-active"
        );

    }


    if (
      freeTrialCard
    ) {

      freeTrialCard
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
      !connectedPlatformCard ||
      !supplierLayer ||
      !supplierStep ||
      !supplierCard ||
      !freeTrialLayer ||
      !freeTrialStep ||
      !freeTrialCard
    ) {

      updateDocumentControlReadingState();

      return;

    }


    const viewportHeight =
      getMobileViewportHeight();


    const docCardRect =
      docCard.getBoundingClientRect();



    /* =====================================================
       STAGE 1 — CONNECTED PLATFORM SCREEN MOVEMENT

       Before the Document Control card leaves the top,
       Connected Platform remains exactly one screen below.

       When the Document Control card has fully left:
       Connected Platform rises 1:1 with scrolling.
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


      supplierLayer
        .style
        .transform =
          `translate3d(
            0,
            ${viewportHeight}px,
            0
          )`;


      supplierStep
        .classList
        .remove(
          "copy-scroll-active"
        );


      supplierCard
        .style
        .transform =
          "";


      freeTrialLayer
        .style
        .transform =
          `translate3d(
            0,
            ${viewportHeight}px,
            0
          )`;


      freeTrialStep
        .classList
        .remove(
          "copy-scroll-active"
        );


      freeTrialCard
        .style
        .transform =
          "";


      /*
        Supplier is not at its ceiling here.
        Cancel/reset any Supplier zoom state.
      */

      if (
        supplierAtCeiling ||
        supplierZoomTimer ||
        supplierReturnTimer ||
        (
          supplierVideo &&
          (
            supplierVideo.classList.contains(
              "supplier-mobile-zoom"
            ) ||
            supplierVideo.classList.contains(
              "supplier-mobile-returning"
            ) ||
            supplierVideo.classList.contains(
              "supplier-mobile-settled"
            )
          )
        )
      ) {

        clearSupplierManagementVisualState();

      }


      supplierAtCeiling =
        false;

      supplierCardWasAtOrAboveMiddle =
        null;


      if (
        activeMediaId !==
        "media-document-control"
      ) {

        const reversingFromLaterSection =
          activeMediaId ===
            "media-connected-platform" ||
          activeMediaId ===
            "media-supplier-management" ||
          activeMediaId ===
            "media-free-trial";


        activateMedia(
          "media-document-control",
          false,
          !reversingFromLaterSection
        );

      }


      updateDocumentControlReadingState();

      return;

    }



    /* =====================================================
       CONNECTED PLATFORM HAS HIT THE CEILING
    ===================================================== */

    if (
      activeMediaId ===
      "media-document-control"
    ) {

      activateMedia(
        "media-connected-platform"
      );

    }



    /* =====================================================
       QUALITY MANAGEMENT CARD

       Once Connected Platform is fixed at the ceiling,
       continued scrolling brings the card up from below.
    ===================================================== */

    const connectedPostHandoffScroll =
      Math.max(
        0,
        -docCardRect.bottom -
          viewportHeight
      );


    connectedPlatformCard
      .style
      .transform =
        "none";


    const connectedNaturalCardRect =
      connectedPlatformCard
        .getBoundingClientRect();


    const connectedDesiredCardTop =
      viewportHeight +
      24 -
      connectedPostHandoffScroll;


    const connectedCardOffset =
      connectedDesiredCardTop -
      connectedNaturalCardRect.top;


    connectedPlatformCard
      .style
      .transform =
        `translate3d(
          0,
          ${connectedCardOffset}px,
          0
        )`;


    connectedPlatformStep
      .classList
      .add(
        "copy-scroll-active"
      );



    /* =====================================================
       STAGE 2 — SUPPLIER MANAGEMENT SCREEN MOVEMENT

       Supplier Management remains one screen below until
       the Quality Management card has completely left the top.

       Then the Supplier Management video rises 1:1 with
       scrolling and stops when it reaches the ceiling.
    ===================================================== */

    const connectedCardRect =
      connectedPlatformCard
        .getBoundingClientRect();


    const supplierOffset =
      Math.max(
        0,
        Math.min(
          viewportHeight,
          viewportHeight +
            connectedCardRect.bottom
        )
      );


    supplierLayer
      .style
      .transform =
        `translate3d(
          0,
          ${supplierOffset}px,
          0
        )`;



    /* =====================================================
       SUPPLIER MANAGEMENT IS STILL BELOW / MOVING UP
    ===================================================== */

    if (
      supplierOffset >
      0
    ) {

      supplierStep
        .classList
        .remove(
          "copy-scroll-active"
        );


      supplierCard
        .style
        .transform =
          "";


      freeTrialLayer
        .style
        .transform =
          `translate3d(
            0,
            ${viewportHeight}px,
            0
          )`;


      freeTrialStep
        .classList
        .remove(
          "copy-scroll-active"
        );


      freeTrialCard
        .style
        .transform =
          "";


      /*
        The Supplier screen has left its ceiling position.
        Reset the zoom so reverse-scroll shows the original
        full-page Supplier composition while it slides down.
      */

      if (
        supplierAtCeiling ||
        supplierZoomTimer ||
        supplierReturnTimer ||
        (
          supplierVideo &&
          (
            supplierVideo.classList.contains(
              "supplier-mobile-zoom"
            ) ||
            supplierVideo.classList.contains(
              "supplier-mobile-returning"
            ) ||
            supplierVideo.classList.contains(
              "supplier-mobile-settled"
            )
          )
        )
      ) {

        clearSupplierManagementVisualState();

      }


      supplierAtCeiling =
        false;

      supplierCardWasAtOrAboveMiddle =
        null;


      /*
        If the user scrolls backwards from Supplier
        Management, restore Connected Platform as
        the active section.
      */

      if (
        activeMediaId ===
          "media-supplier-management" ||
        activeMediaId ===
          "media-free-trial"
      ) {

        activateMedia(
          "media-connected-platform"
        );

      }


      /*
        Start the Supplier video while it is physically
        rising into view, rather than waiting until
        it has already reached the ceiling.
      */

      if (
        supplierOffset <
        viewportHeight &&
        supplierVideo
      ) {

        supplierVideo
          .play()
          .catch(() => {});

      }


      /*
        When Supplier Management is completely below
        the viewport, return its video to the beginning.
      */

      if (
        supplierOffset >=
        viewportHeight &&
        supplierVideo &&
        activeMediaId !==
          "media-supplier-management"
      ) {

        supplierVideo.pause();


        try {

          supplierVideo.currentTime =
            0;

        } catch (error) {

          /*
            Video metadata may not
            have loaded yet.
          */

        }

      }


      return;

    }



    /* =====================================================
       SUPPLIER MANAGEMENT HAS HIT THE CEILING

       At this point it completely covers Connected Platform,
       so changing the active media creates no visual jump.
    ===================================================== */

    const supplierJustReachedCeiling =
      !supplierAtCeiling;


    supplierAtCeiling =
      true;


    if (
      activeMediaId !==
      "media-supplier-management"
    ) {

      activateMedia(
        "media-supplier-management"
      );

    }


    /*
      The first arrival at the ceiling starts
      the 1.5-second zoom delay.
    */

    if (
      supplierJustReachedCeiling
    ) {

      supplierCardWasAtOrAboveMiddle =
        null;

      scheduleSupplierManagementZoom();

    }



    /* =====================================================
       SUPPLIER MANAGEMENT CARD

       Only after the Supplier video has reached the ceiling
       does its card begin moving upward from below.
    ===================================================== */

    const supplierPostHandoffScroll =
      Math.max(
        0,
        -connectedCardRect.bottom -
          viewportHeight
      );


    supplierCard
      .style
      .transform =
        "none";


    const supplierNaturalCardRect =
      supplierCard
        .getBoundingClientRect();


    const supplierDesiredCardTop =
      viewportHeight +
      24 -
      supplierPostHandoffScroll;


    const supplierCardOffset =
      supplierDesiredCardTop -
      supplierNaturalCardRect.top;


    supplierCard
      .style
      .transform =
        `translate3d(
          0,
          ${supplierCardOffset}px,
          0
        )`;


    supplierStep
      .classList
      .add(
        "copy-scroll-active"
      );


    updateSupplierManagementReadingState(
      viewportHeight
    );



    /* =====================================================
       STAGE 3 — FREE TRIAL SCREEN MOVEMENT

       Free Trial remains one screen below until
       the Supplier Management card has completely left the top.

       Then the Free Trial still image rises 1:1 with scrolling
       and stops when it reaches the ceiling.
    ===================================================== */

    const supplierCardRect =
      supplierCard
        .getBoundingClientRect();


    const freeTrialOffset =
      Math.max(
        0,
        Math.min(
          viewportHeight,
          viewportHeight +
            supplierCardRect.bottom
        )
      );


    freeTrialLayer
      .style
      .transform =
        `translate3d(
          0,
          ${freeTrialOffset}px,
          0
        )`;



    /* =====================================================
       FREE TRIAL IS STILL BELOW / MOVING UP
    ===================================================== */

    if (
      freeTrialOffset >
      0
    ) {

      freeTrialStep
        .classList
        .remove(
          "copy-scroll-active"
        );


      freeTrialCard
        .style
        .transform =
          "";


      /*
        Reverse-scrolling from Free Trial restores
        Supplier Management as the active section.
      */

      if (
        activeMediaId ===
        "media-free-trial"
      ) {

        activateMedia(
          "media-supplier-management"
        );

      }


      /*
        Keep Supplier's existing bidirectional
        card-middle zoom behaviour alive while
        reverse-scrolling back into that section.
      */

      updateSupplierManagementReadingState(
        viewportHeight
      );


      return;

    }



    /* =====================================================
       FREE TRIAL HAS HIT THE CEILING

       The still image now completely covers Supplier Management.
    ===================================================== */

    if (
      activeMediaId !==
      "media-free-trial"
    ) {

      activateMedia(
        "media-free-trial"
      );

    }



    /* =====================================================
       FREE TRIAL CARD

       Only after the Free Trial image reaches the ceiling
       does its text card begin moving upward from below.
    ===================================================== */

    const freeTrialPostHandoffScroll =
      Math.max(
        0,
        -supplierCardRect.bottom -
          viewportHeight
      );


    freeTrialCard
      .style
      .transform =
        "none";


    const freeTrialNaturalCardRect =
      freeTrialCard
        .getBoundingClientRect();


    const freeTrialDesiredCardTop =
      viewportHeight +
      24 -
      freeTrialPostHandoffScroll;


    const freeTrialCardOffset =
      freeTrialDesiredCardTop -
      freeTrialNaturalCardRect.top;


    freeTrialCard
      .style
      .transform =
        `translate3d(
          0,
          ${freeTrialCardOffset}px,
          0
        )`;


    freeTrialStep
      .classList
      .add(
        "copy-scroll-active"
      );

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

    setSupplierManagementSource();


    /*
      Re-establish card-crossing state for the
      newly selected viewport mode.
    */

    docCardWasAtOrAboveMiddle =
      null;


    /* =========================
       MOBILE
    ========================= */

    if (
      mobileQuery.matches
    ) {

      activeMediaId =
        null;


      resetConnectedPlatformMobileState();

      resetSupplierManagementMobileState();

      resetFreeTrialMobileState();


      updateMobileMedia();


      return;

    }



    /* =========================
       DESKTOP / LAPTOP
    ========================= */

    resetConnectedPlatformMobileState();

    resetSupplierManagementMobileState();

    resetFreeTrialMobileState();


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

  setSupplierManagementSource();


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

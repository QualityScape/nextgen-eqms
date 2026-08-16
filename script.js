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


  const complaintsVideo =
    document.getElementById(
      "customer-complaints-video"
    );


  const complaintsLayer =
    document.getElementById(
      "media-customer-complaints"
    );


  const complaintsStep =
    document.querySelector(
      '.story-step[data-media="media-customer-complaints"]'
    );


  const complaintsCard =
    complaintsStep
      ? complaintsStep.querySelector(
          ".story-card"
        )
      : null;


  const customersLayer =
    document.getElementById(
      "media-customers"
    );


  const customersStep =
    document.querySelector(
      '.story-step[data-media="media-customers"]'
    );


  const customersCard =
    customersStep
      ? customersStep.querySelector(
          ".story-card"
        )
      : null;


  const matrixAcquisitionLayer =
    document.getElementById(
      "media-matrix-acquisition"
    );


  const matrixAcquisitionStep =
    document.querySelector(
      '.story-step[data-media="media-matrix-acquisition"]'
    );


  const matrixAcquisitionCard =
    matrixAcquisitionStep
      ? matrixAcquisitionStep.querySelector(
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

  let currentComplaintsSource = "";

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
     CUSTOMER COMPLAINTS VIDEO SOURCE
  ========================================================= */

  function setCustomerComplaintsSource() {

    if (!complaintsVideo) {
      return;
    }


    const desiredSource =
      mobileQuery.matches
        ? complaintsVideo.dataset.mobileSrc
        : complaintsVideo.dataset.desktopSrc;


    if (
      currentComplaintsSource ===
      desiredSource
    ) {
      return;
    }


    currentComplaintsSource =
      desiredSource;


    complaintsVideo.pause();

    complaintsVideo.src =
      desiredSource;

    complaintsVideo.load();


    if (
      activeMediaId ===
      "media-customer-complaints"
    ) {

      complaintsVideo
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

     STAGE 4:
     FREE TRIAL CARD
     →
     CUSTOMER COMPLAINTS
     →
     CUSTOMER COMPLAINTS CARD

     STAGE 5:
     CUSTOMER COMPLAINTS CARD
     →
     CUSTOMERS
     →
     CUSTOMERS CARD

     STAGE 6:
     CUSTOMERS CARD
     →
     MATRIX ACQUISITION
     →
     MATRIX ACQUISITION CARD
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
     RESET CUSTOMER COMPLAINTS MOBILE STATE
  ========================================================= */

  function resetCustomerComplaintsMobileState() {

    if (
      complaintsLayer
    ) {

      complaintsLayer
        .style
        .transform =
          "";

    }


    if (
      complaintsStep
    ) {

      complaintsStep
        .classList
        .remove(
          "copy-scroll-active"
        );

    }


    if (
      complaintsCard
    ) {

      complaintsCard
        .style
        .transform =
          "";

    }

  }



  /* =========================================================
     RESET CUSTOMERS MOBILE STATE
  ========================================================= */

  function resetCustomersMobileState() {

    if (
      customersLayer
    ) {

      customersLayer
        .style
        .transform =
          "";

    }


    if (
      customersStep
    ) {

      customersStep
        .classList
        .remove(
          "copy-scroll-active"
        );

    }


    if (
      customersCard
    ) {

      customersCard
        .style
        .transform =
          "";

    }

  }



  /* =========================================================
     RESET MATRIX ACQUISITION MOBILE STATE
  ========================================================= */

  function resetMatrixAcquisitionMobileState() {

    if (
      matrixAcquisitionLayer
    ) {

      matrixAcquisitionLayer
        .style
        .transform =
          "";

    }


    if (
      matrixAcquisitionStep
    ) {

      matrixAcquisitionStep
        .classList
        .remove(
          "copy-scroll-active"
        );

    }


    if (
      matrixAcquisitionCard
    ) {

      matrixAcquisitionCard
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
      !freeTrialCard ||
      !complaintsLayer ||
      !complaintsStep ||
      !complaintsCard ||
      !customersLayer ||
      !customersStep ||
      !customersCard ||
      !matrixAcquisitionLayer ||
      !matrixAcquisitionStep ||
      !matrixAcquisitionCard
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
        `translate3d(0, ${connectedPlatformOffset}px, 0)`;


    if (
      connectedPlatformOffset >
      0
    ) {

      connectedPlatformStep
        .classList
        .remove(
          "copy-scroll-active"
        );


      connectedPlatformCard.style.transform =
        "";


      supplierLayer.style.transform =
        `translate3d(0, ${viewportHeight}px, 0)`;

      supplierStep.classList.remove(
        "copy-scroll-active"
      );

      supplierCard.style.transform =
        "";


      freeTrialLayer.style.transform =
        `translate3d(0, ${viewportHeight}px, 0)`;

      freeTrialStep.classList.remove(
        "copy-scroll-active"
      );

      freeTrialCard.style.transform =
        "";


      complaintsLayer.style.transform =
        `translate3d(0, ${viewportHeight}px, 0)`;

      complaintsStep.classList.remove(
        "copy-scroll-active"
      );

      complaintsCard.style.transform =
        "";


      customersLayer.style.transform =
        `translate3d(0, ${viewportHeight}px, 0)`;

      customersStep.classList.remove(
        "copy-scroll-active"
      );

      customersCard.style.transform =
        "";


      matrixAcquisitionLayer.style.transform =
        `translate3d(0, ${viewportHeight}px, 0)`;

      matrixAcquisitionStep.classList.remove(
        "copy-scroll-active"
      );

      matrixAcquisitionCard.style.transform =
        "";


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


      supplierAtCeiling = false;

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
            "media-free-trial" ||
          activeMediaId ===
            "media-customer-complaints" ||
          activeMediaId ===
            "media-customers" ||
          activeMediaId ===
            "media-matrix-acquisition";


        activateMedia(
          "media-document-control",
          false,
          !reversingFromLaterSection
        );

      }


      updateDocumentControlReadingState();

      return;

    }


    if (
      activeMediaId ===
        "media-document-control"
    ) {

      activateMedia(
        "media-connected-platform"
      );

    }


    const connectedPostHandoffScroll =
      Math.max(
        0,
        -docCardRect.bottom -
          viewportHeight
      );


    connectedPlatformCard.style.transform =
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


    connectedPlatformCard.style.transform =
      `translate3d(0, ${connectedCardOffset}px, 0)`;


    connectedPlatformStep.classList.add(
      "copy-scroll-active"
    );



    /* =====================================================
       STAGE 2 — SUPPLIER MANAGEMENT
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


    supplierLayer.style.transform =
      `translate3d(0, ${supplierOffset}px, 0)`;


    if (
      supplierOffset >
      0
    ) {

      supplierStep.classList.remove(
        "copy-scroll-active"
      );

      supplierCard.style.transform =
        "";


      freeTrialLayer.style.transform =
        `translate3d(0, ${viewportHeight}px, 0)`;

      freeTrialStep.classList.remove(
        "copy-scroll-active"
      );

      freeTrialCard.style.transform =
        "";


      complaintsLayer.style.transform =
        `translate3d(0, ${viewportHeight}px, 0)`;

      complaintsStep.classList.remove(
        "copy-scroll-active"
      );

      complaintsCard.style.transform =
        "";


      customersLayer.style.transform =
        `translate3d(0, ${viewportHeight}px, 0)`;

      customersStep.classList.remove(
        "copy-scroll-active"
      );

      customersCard.style.transform =
        "";


      matrixAcquisitionLayer.style.transform =
        `translate3d(0, ${viewportHeight}px, 0)`;

      matrixAcquisitionStep.classList.remove(
        "copy-scroll-active"
      );

      matrixAcquisitionCard.style.transform =
        "";


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


      supplierAtCeiling = false;

      supplierCardWasAtOrAboveMiddle =
        null;


      if (
        activeMediaId ===
          "media-supplier-management" ||
        activeMediaId ===
          "media-free-trial" ||
        activeMediaId ===
          "media-customer-complaints" ||
        activeMediaId ===
          "media-customers" ||
        activeMediaId ===
          "media-matrix-acquisition"
      ) {

        activateMedia(
          "media-connected-platform"
        );

      }


      if (
        supplierOffset <
          viewportHeight &&
        supplierVideo
      ) {

        supplierVideo
          .play()
          .catch(() => {});

      }


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

          /* metadata not ready */

        }

      }


      return;

    }


    const supplierJustReachedCeiling =
      !supplierAtCeiling;


    supplierAtCeiling =
      true;


    if (
      activeMediaId !==
        "media-supplier-management" &&
      activeMediaId !==
        "media-free-trial" &&
      activeMediaId !==
        "media-customer-complaints" &&
      activeMediaId !==
        "media-customers" &&
      activeMediaId !==
        "media-matrix-acquisition"
    ) {

      activateMedia(
        "media-supplier-management"
      );

    }


    if (
      supplierJustReachedCeiling
    ) {

      supplierCardWasAtOrAboveMiddle =
        null;

      scheduleSupplierManagementZoom();

    }


    const supplierPostHandoffScroll =
      Math.max(
        0,
        -connectedCardRect.bottom -
          viewportHeight
      );


    supplierCard.style.transform =
      "none";


    const supplierNaturalCardRect =
      supplierCard.getBoundingClientRect();


    const supplierDesiredCardTop =
      viewportHeight +
      24 -
      supplierPostHandoffScroll;


    const supplierCardOffset =
      supplierDesiredCardTop -
      supplierNaturalCardRect.top;


    supplierCard.style.transform =
      `translate3d(0, ${supplierCardOffset}px, 0)`;


    supplierStep.classList.add(
      "copy-scroll-active"
    );


    updateSupplierManagementReadingState(
      viewportHeight
    );



    /* =====================================================
       STAGE 3 — FREE TRIAL
    ===================================================== */

    const supplierCardRect =
      supplierCard.getBoundingClientRect();


    const freeTrialOffset =
      Math.max(
        0,
        Math.min(
          viewportHeight,
          viewportHeight +
            supplierCardRect.bottom
        )
      );


    freeTrialLayer.style.transform =
      `translate3d(0, ${freeTrialOffset}px, 0)`;


    if (
      freeTrialOffset >
      0
    ) {

      freeTrialStep.classList.remove(
        "copy-scroll-active"
      );

      freeTrialCard.style.transform =
        "";


      complaintsLayer.style.transform =
        `translate3d(0, ${viewportHeight}px, 0)`;

      complaintsStep.classList.remove(
        "copy-scroll-active"
      );

      complaintsCard.style.transform =
        "";


      customersLayer.style.transform =
        `translate3d(0, ${viewportHeight}px, 0)`;

      customersStep.classList.remove(
        "copy-scroll-active"
      );

      customersCard.style.transform =
        "";


      matrixAcquisitionLayer.style.transform =
        `translate3d(0, ${viewportHeight}px, 0)`;

      matrixAcquisitionStep.classList.remove(
        "copy-scroll-active"
      );

      matrixAcquisitionCard.style.transform =
        "";


      if (
        activeMediaId ===
          "media-free-trial" ||
        activeMediaId ===
          "media-customer-complaints" ||
        activeMediaId ===
          "media-customers" ||
        activeMediaId ===
          "media-matrix-acquisition"
      ) {

        activateMedia(
          "media-supplier-management"
        );

      }


      updateSupplierManagementReadingState(
        viewportHeight
      );


      return;

    }


    if (
      activeMediaId !==
        "media-free-trial" &&
      activeMediaId !==
        "media-customer-complaints" &&
      activeMediaId !==
        "media-customers" &&
      activeMediaId !==
        "media-matrix-acquisition"
    ) {

      activateMedia(
        "media-free-trial"
      );

    }


    const freeTrialPostHandoffScroll =
      Math.max(
        0,
        -supplierCardRect.bottom -
          viewportHeight
      );


    freeTrialCard.style.transform =
      "none";


    const freeTrialNaturalCardRect =
      freeTrialCard.getBoundingClientRect();


    const freeTrialDesiredCardTop =
      viewportHeight +
      24 -
      freeTrialPostHandoffScroll;


    const freeTrialCardOffset =
      freeTrialDesiredCardTop -
      freeTrialNaturalCardRect.top;


    freeTrialCard.style.transform =
      `translate3d(0, ${freeTrialCardOffset}px, 0)`;


    freeTrialStep.classList.add(
      "copy-scroll-active"
    );



    /* =====================================================
       STAGE 4 — CUSTOMER COMPLAINTS
    ===================================================== */

    const freeTrialCardRect =
      freeTrialCard.getBoundingClientRect();


    const complaintsOffset =
      Math.max(
        0,
        Math.min(
          viewportHeight,
          viewportHeight +
            freeTrialCardRect.bottom
        )
      );


    complaintsLayer.style.transform =
      `translate3d(0, ${complaintsOffset}px, 0)`;


    if (
      complaintsOffset >
      0
    ) {

      complaintsStep.classList.remove(
        "copy-scroll-active"
      );

      complaintsCard.style.transform =
        "";


      customersLayer.style.transform =
        `translate3d(0, ${viewportHeight}px, 0)`;

      customersStep.classList.remove(
        "copy-scroll-active"
      );

      customersCard.style.transform =
        "";


      matrixAcquisitionLayer.style.transform =
        `translate3d(0, ${viewportHeight}px, 0)`;

      matrixAcquisitionStep.classList.remove(
        "copy-scroll-active"
      );

      matrixAcquisitionCard.style.transform =
        "";


      if (
        activeMediaId ===
          "media-customer-complaints" ||
        activeMediaId ===
          "media-customers" ||
        activeMediaId ===
          "media-matrix-acquisition"
      ) {

        activateMedia(
          "media-free-trial"
        );

      }


      return;

    }


    if (
      activeMediaId !==
        "media-customer-complaints" &&
      activeMediaId !==
        "media-customers" &&
      activeMediaId !==
        "media-matrix-acquisition"
    ) {

      activateMedia(
        "media-customer-complaints"
      );

    }


    const complaintsPostHandoffScroll =
      Math.max(
        0,
        -freeTrialCardRect.bottom -
          viewportHeight
      );


    complaintsCard.style.transform =
      "none";


    const complaintsNaturalCardRect =
      complaintsCard.getBoundingClientRect();


    const complaintsDesiredCardTop =
      viewportHeight +
      24 -
      complaintsPostHandoffScroll;


    const complaintsCardOffset =
      complaintsDesiredCardTop -
      complaintsNaturalCardRect.top;


    complaintsCard.style.transform =
      `translate3d(0, ${complaintsCardOffset}px, 0)`;


    complaintsStep.classList.add(
      "copy-scroll-active"
    );



    /* =====================================================
       STAGE 5 — CUSTOMERS
    ===================================================== */

    const complaintsCardRect =
      complaintsCard.getBoundingClientRect();


    const customersOffset =
      Math.max(
        0,
        Math.min(
          viewportHeight,
          viewportHeight +
            complaintsCardRect.bottom
        )
      );


    customersLayer.style.transform =
      `translate3d(0, ${customersOffset}px, 0)`;


    if (
      customersOffset >
      0
    ) {

      customersStep.classList.remove(
        "copy-scroll-active"
      );

      customersCard.style.transform =
        "";


      matrixAcquisitionLayer.style.transform =
        `translate3d(0, ${viewportHeight}px, 0)`;

      matrixAcquisitionStep.classList.remove(
        "copy-scroll-active"
      );

      matrixAcquisitionCard.style.transform =
        "";


      if (
        activeMediaId ===
          "media-customers" ||
        activeMediaId ===
          "media-matrix-acquisition"
      ) {

        activateMedia(
          "media-customer-complaints"
        );

      }


      return;

    }


    if (
      activeMediaId !==
        "media-customers" &&
      activeMediaId !==
        "media-matrix-acquisition"
    ) {

      activateMedia(
        "media-customers"
      );

    }


    const customersPostHandoffScroll =
      Math.max(
        0,
        -complaintsCardRect.bottom -
          viewportHeight
      );


    customersCard.style.transform =
      "none";


    const customersNaturalCardRect =
      customersCard.getBoundingClientRect();


    const customersDesiredCardTop =
      viewportHeight +
      24 -
      customersPostHandoffScroll;


    const customersCardOffset =
      customersDesiredCardTop -
      customersNaturalCardRect.top;


    customersCard.style.transform =
      `translate3d(0, ${customersCardOffset}px, 0)`;


    customersStep.classList.add(
      "copy-scroll-active"
    );



    /* =====================================================
       STAGE 6 — MATRIX ACQUISITION
    ===================================================== */

    const customersCardRect =
      customersCard.getBoundingClientRect();


    const matrixAcquisitionOffset =
      Math.max(
        0,
        Math.min(
          viewportHeight,
          viewportHeight +
            customersCardRect.bottom
        )
      );


    matrixAcquisitionLayer.style.transform =
      `translate3d(0, ${matrixAcquisitionOffset}px, 0)`;


    if (
      matrixAcquisitionOffset >
      0
    ) {

      matrixAcquisitionStep.classList.remove(
        "copy-scroll-active"
      );

      matrixAcquisitionCard.style.transform =
        "";


      if (
        activeMediaId ===
          "media-matrix-acquisition"
      ) {

        activateMedia(
          "media-customers"
        );

      }


      return;

    }


    if (
      activeMediaId !==
        "media-matrix-acquisition"
    ) {

      activateMedia(
        "media-matrix-acquisition"
      );

    }


    const matrixAcquisitionPostHandoffScroll =
      Math.max(
        0,
        -customersCardRect.bottom -
          viewportHeight
      );


    matrixAcquisitionCard.style.transform =
      "none";


    const matrixAcquisitionNaturalCardRect =
      matrixAcquisitionCard
        .getBoundingClientRect();


    const matrixAcquisitionDesiredCardTop =
      viewportHeight +
      24 -
      matrixAcquisitionPostHandoffScroll;


    const matrixAcquisitionCardOffset =
      matrixAcquisitionDesiredCardTop -
      matrixAcquisitionNaturalCardRect.top;


    matrixAcquisitionCard.style.transform =
      `translate3d(0, ${matrixAcquisitionCardOffset}px, 0)`;


    matrixAcquisitionStep.classList.add(
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

    setCustomerComplaintsSource();


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

      resetCustomerComplaintsMobileState();

      resetCustomersMobileState();

      resetMatrixAcquisitionMobileState();


      updateMobileMedia();


      return;

    }



    /* =========================
       DESKTOP / LAPTOP
    ========================= */

    resetConnectedPlatformMobileState();

    resetSupplierManagementMobileState();

    resetFreeTrialMobileState();

    resetCustomerComplaintsMobileState();

    resetCustomersMobileState();

    resetMatrixAcquisitionMobileState();


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

  setCustomerComplaintsSource();


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

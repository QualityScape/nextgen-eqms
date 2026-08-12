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


  const mobileQuery =
    window.matchMedia(
      "(max-width: 768px)"
    );


  let activeMediaId = null;

  let currentDocSource = "";

  let currentSupplierSource = "";

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
      !supplierCard
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


      if (
        activeMediaId !==
        "media-document-control"
      ) {

        const reversingFromLaterSection =
          activeMediaId ===
            "media-connected-platform" ||
          activeMediaId ===
            "media-supplier-management";


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


      /*
        If the user scrolls backwards from Supplier
        Management, restore Connected Platform as
        the active section.
      */

      if (
        activeMediaId ===
        "media-supplier-management"
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

    if (
      activeMediaId !==
      "media-supplier-management"
    ) {

      activateMedia(
        "media-supplier-management"
      );

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

    resetSupplierManagementMobileState();


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

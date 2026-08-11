document.addEventListener("DOMContentLoaded", () => {

  const storySteps = Array.from(
    document.querySelectorAll(".story-step")
  );

  const mediaLayers = Array.from(
    document.querySelectorAll(".media-layer")
  );

  const docVideo =
    document.getElementById("doc-control-video");

  const mobileQuery =
    window.matchMedia("(max-width: 768px)");

  let activeMediaId = null;

  let currentDocSource = "";

  let mobileScrollTicking = false;



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
     MOBILE DOCUMENT CONTROL CAMERA ANIMATION
  ========================================================= */

  function restartDocumentControlAnimation() {

    if (!docVideo) {
      return;
    }


    /*
      Laptop / desktop remains completely untouched.
    */

    if (!mobileQuery.matches) {

      docVideo.classList.remove(
        "doc-mobile-zoom"
      );

      return;
    }


    /*
      Remove the class first.
    */

    docVideo.classList.remove(
      "doc-mobile-zoom"
    );


    /*
      Force browser reflow.
    */

    void docVideo.offsetWidth;


    /*
      Restart the animation.
    */

    docVideo.classList.add(
      "doc-mobile-zoom"
    );

  }



  /* =========================================================
     ACTIVATE STORY MEDIA
  ========================================================= */

  function activateMedia(mediaId, force = false) {

    if (
      !force &&
      activeMediaId === mediaId
    ) {
      return;
    }


    activeMediaId = mediaId;


    mediaLayers.forEach((layer) => {

      const videos =
        layer.querySelectorAll("video");


      if (layer.id === mediaId) {

        layer.classList.add("active");


        videos.forEach((video) => {

          video.play().catch(() => {
            // Ignore temporary autoplay restrictions.
          });

        });


        /*
          Only Document Control receives
          the mobile camera movement.
        */

        if (
          mediaId === "media-document-control"
        ) {

          restartDocumentControlAnimation();

        }


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

  }



  /* =========================================================
     DESKTOP STORY OBSERVER

     This preserves the laptop behaviour that already
     works correctly.
  ========================================================= */

  const desktopObserver =
    new IntersectionObserver(

      (entries) => {

        /*
          Do not use this switching logic on mobile.
        */

        if (mobileQuery.matches) {
          return;
        }


        entries.forEach((entry) => {

          if (!entry.isIntersecting) {
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

     IMPORTANT:

     The next background does NOT activate merely because
     the next story section has entered the viewport.

     Instead, it waits until the PREVIOUS story card
     has completely travelled beyond the TOP edge.

     Think of y = 0 as the finish line.
  ========================================================= */

  function updateMobileMedia() {

    if (!mobileQuery.matches) {
      return;
    }


    if (storySteps.length === 0) {
      return;
    }


    /*
      Start with the first media section.
    */

    let activeIndex = 0;


    /*
      For each following section:

      Only advance once the previous card's BOTTOM
      has crossed the top of the viewport.
    */

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
        FINISH LINE = top of screen.

        bottom <= 0 means the ENTIRE card
        has disappeared above the viewport.
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

  }



  /* =========================================================
     MOBILE SCROLL LISTENER
  ========================================================= */

  function handleMobileScroll() {

    if (!mobileQuery.matches) {
      return;
    }


    if (mobileScrollTicking) {
      return;
    }


    mobileScrollTicking = true;


    window.requestAnimationFrame(() => {

      updateMobileMedia();

      mobileScrollTicking = false;

    });

  }


  window.addEventListener(
    "scroll",
    handleMobileScroll,
    {
      passive: true
    }
  );



  /* =========================================================
     DESKTOP / MOBILE VIEWPORT CHANGE
  ========================================================= */

  function handleViewportChange() {

    setDocumentControlSource();


    if (mobileQuery.matches) {

      /*
        Entering mobile:
        immediately calculate which background
        should currently be active.
      */

      updateMobileMedia();


    } else {


      /*
        Entering desktop:
        completely remove the mobile-only
        camera animation.
      */

      if (docVideo) {

        docVideo.classList.remove(
          "doc-mobile-zoom"
        );

      }


      /*
        Determine which desktop story section
        is closest to the centre of the viewport.
      */

      let closestStep = null;

      let closestDistance = Infinity;

      const viewportCenter =
        window.innerHeight / 2;


      storySteps.forEach((step) => {

        const rect =
          step.getBoundingClientRect();


        if (
          rect.bottom <= 0 ||
          rect.top >= window.innerHeight
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

          activateMedia(
            mediaId,
            true
          );

        }

      }

    }

  }



  if (mobileQuery.addEventListener) {

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


        /*
          Resume whichever media section
          was active before leaving the tab.
        */

        if (activeMediaId) {

          activateMedia(
            activeMediaId,
            true
          );

        }

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

document.addEventListener("DOMContentLoaded", () => {

  const storySteps = document.querySelectorAll(".story-step");
  const mediaLayers = document.querySelectorAll(".media-layer");

  const docVideo = document.getElementById("doc-control-video");

  const mobileQuery = window.matchMedia("(max-width: 768px)");

  let activeMediaId = "media-document-control";

  let currentDocSource = "";


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

    }
  );



  /* =========================================================
     INITIAL STATE
  ========================================================= */

  setDocumentControlSource();

  activateMedia("media-document-control");

});

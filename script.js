document.addEventListener("DOMContentLoaded", () => {

  const storySteps = document.querySelectorAll(".story-step");
  const mediaLayers = document.querySelectorAll(".media-layer");

  let activeMediaId = "media-document-control";


  /* =========================================================
     PLAY / PAUSE THE CORRECT MEDIA
  ========================================================= */

  function activateMedia(mediaId) {

    activeMediaId = mediaId;

    mediaLayers.forEach((layer) => {

      const videos = layer.querySelectorAll("video");


      /* ACTIVE MEDIA LAYER */

      if (layer.id === mediaId) {

        layer.classList.add("active");

        videos.forEach((video) => {

          /*
            Only play the video that is actually visible.

            Desktop:
            doc-control.mp4 plays.

            Mobile:
            doc-control-mobile.mp4 plays.
          */

          const isVisible =
            window.getComputedStyle(video).display !== "none";

          if (isVisible) {

            video.play().catch(() => {
              /*
                Some browsers may delay autoplay briefly.
                The video is muted and playsinline, so normal
                mobile browsers should allow playback.
              */
            });

          } else {

            video.pause();

          }

        });


      /* INACTIVE MEDIA LAYERS */

      } else {

        layer.classList.remove("active");

        videos.forEach((video) => {

          video.pause();

          /*
            Reset inactive videos so they start from the
            beginning when the visitor scrolls back to them.
          */

          try {
            video.currentTime = 0;
          } catch (error) {
            // Ignore if the video metadata is not ready yet.
          }

        });

      }

    });

  }



  /* =========================================================
     WATCH STORY CARDS AS THEY MOVE THROUGH THE VIEWPORT
  ========================================================= */

  const observer = new IntersectionObserver(

    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          const mediaId = entry.target.dataset.media;

          if (mediaId) {
            activateMedia(mediaId);
          }

        }

      });

    },

    {
      root: null,

      /*
        The active story changes when its card enters
        the central portion of the screen.

        This creates the CNA / NDP-style transition:
        card moves upward while the background media
        remains pinned behind it.
      */

      rootMargin: "-35% 0px -35% 0px",

      threshold: 0
    }

  );



  /* =========================================================
     OBSERVE EACH STORY STEP
  ========================================================= */

  storySteps.forEach((step) => {
    observer.observe(step);
  });



  /* =========================================================
     HANDLE DESKTOP ↔ MOBILE WIDTH CHANGES
  ========================================================= */

  let resizeTimer;

  window.addEventListener("resize", () => {

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {

      /*
        Re-evaluate which version of the current video
        should play after the viewport changes.
      */

      activateMedia(activeMediaId);

    }, 150);

  });



  /* =========================================================
     PAGE VISIBILITY
  ========================================================= */

  document.addEventListener("visibilitychange", () => {

    if (document.hidden) {

      mediaLayers.forEach((layer) => {

        layer.querySelectorAll("video").forEach((video) => {
          video.pause();
        });

      });

    } else {

      activateMedia(activeMediaId);

    }

  });



  /* =========================================================
     INITIAL STATE
  ========================================================= */

  activateMedia("media-document-control");

});

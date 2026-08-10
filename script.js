document.addEventListener("DOMContentLoaded", () => {

  const storySteps = document.querySelectorAll(".story-step");
  const mediaLayers = document.querySelectorAll(".media-layer");


  function activateMedia(mediaId) {

    mediaLayers.forEach((layer) => {

      const video = layer.querySelector("video");

      if (layer.id === mediaId) {

        layer.classList.add("active");

        if (video) {
          video.play().catch(() => {
            // Browser may temporarily block playback.
          });
        }

      } else {

        layer.classList.remove("active");

        if (video) {
          video.pause();
        }

      }

    });

  }


  const observer = new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          const mediaId = entry.target.dataset.media;

          activateMedia(mediaId);

        }

      });

    },
    {
      root: null,

      /*
        A story step becomes active when it occupies
        the central portion of the screen.
      */
      rootMargin: "-35% 0px -35% 0px",

      threshold: 0
    }
  );


  storySteps.forEach((step) => {
    observer.observe(step);
  });


  /*
    Start with Document Control.
  */

  activateMedia("media-document-control");

});

/** Single-player policy: pause every other <video> element on the page. */
export function pauseOtherVideos(except?: HTMLVideoElement | null) {
  if (typeof document === 'undefined') return;
  document.querySelectorAll('video').forEach((el) => {
    if (el !== except && !el.paused) el.pause();
  });
}

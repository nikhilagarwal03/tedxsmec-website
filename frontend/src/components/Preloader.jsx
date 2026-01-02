// import React, { useRef, useEffect } from "react";

// const VIDEO_SOURCE = "/preloader.mp4";

// export default function Preloader({ onFinish }) {
//   const videoRef = useRef(null);

//   useEffect(() => {
//     // iOS autoplay fix
//     if (videoRef.current) {
//       videoRef.current.play().catch(() => {});
//     }
//   }, []);

//   return (
//     <div className="fixed inset-0 z-[9999] bg-black">
//       <div className="w-full h-[100dvh] flex items-center justify-center">
//         <video
//           ref={videoRef}
//           src={VIDEO_SOURCE}
//           autoPlay
//           muted
//           playsInline
//           preload="auto"
//           onEnded={onFinish}
//           className="
//             w-full h-full
//             object-contain     /* ✅ MOBILE: entire video visible */
//             sm:object-cover    /* ✅ DESKTOP: fill screen */
//           "
//         />
//       </div>
//     </div>
//   );
// }


import React, { useRef, useEffect } from "react";

const VIDEO_SOURCE = "/preloader.mp4";

export default function Preloader({ onFinish }) {
  const videoRef = useRef(null);
  const finishedRef = useRef(false);

  const finishOnce = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinish();
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // iOS / Safari autoplay fix
    video.play().catch(() => {});

    // 🛡️ HARD FALLBACK (in case video never ends)
    const forceExit = setTimeout(() => {
      finishOnce();
    }, 3500);

    return () => clearTimeout(forceExit);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-black">
      <div className="w-full h-[100dvh] flex items-center justify-center">
        <video
          ref={videoRef}
          src={VIDEO_SOURCE}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={finishOnce}
          onError={finishOnce} // 🔥 important for prod safety
          className="
            w-full h-full
            object-contain
            sm:object-cover
          "
        />
      </div>
    </div>
  );
}



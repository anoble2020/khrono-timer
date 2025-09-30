import React from 'react';

const CSSGradientBackground: React.FC = () => {
  return (
    <>
      <style>{`
        .gradient-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #0a0a0a;
          z-index: -1;
          overflow: hidden;
        }

        .blob {
          position: absolute;
          border-radius: 20% 80% 60% 40% / 30% 70% 50% 60%;
          filter: blur(15px);
          opacity: 0;
          mix-blend-mode: screen;
          animation: fadeInOut 8s ease-in-out infinite;
        }

        .blob1 {
          width: 80vw;
          height: 40vw;
          max-width: 400px;
          max-height: 200px;
          top: 20%;
          left: 10%;
          background: radial-gradient(ellipse, #5a5a5a 0%, #2a2a2a 60%);
          border-radius: 10% 90% 70% 30% / 20% 80% 60% 40%;
          animation: morph1 25s ease-in-out infinite, move1 30s ease-in-out infinite, fadeInOut 12s ease-in-out infinite;
          animation-delay: 0s, 0s, 0s;
        }

        .blob2 {
          width: 60vw;
          height: 30vw;
          max-width: 300px;
          max-height: 150px;
          top: 50%;
          right: 15%;
          background: radial-gradient(ellipse, #4a4a4a 0%, #252525 60%);
          border-radius: 30% 70% 40% 60% / 60% 40% 70% 30%;
          animation: morph2 28s ease-in-out infinite, move2 35s ease-in-out infinite, fadeInOut 15s ease-in-out infinite;
          animation-delay: -5s, -5s, -2s;
        }

        .blob3 {
          width: 70vw;
          height: 35vw;
          max-width: 350px;
          max-height: 175px;
          bottom: 10%;
          left: 40%;
          background: radial-gradient(ellipse, #555555 0%, #2a2a2a 60%);
          border-radius: 50% 50% 80% 20% / 30% 70% 40% 60%;
          animation: morph3 32s ease-in-out infinite, move3 40s ease-in-out infinite, fadeInOut 18s ease-in-out infinite;
          animation-delay: -10s, -10s, -4s;
        }

        .blob4 {
          width: 55vw;
          height: 28vw;
          max-width: 275px;
          max-height: 140px;
          top: 10%;
          right: 25%;
          background: radial-gradient(ellipse, #505050 0%, #282828 60%);
          border-radius: 70% 30% 50% 50% / 40% 60% 30% 70%;
          animation: morph1 29s ease-in-out infinite, move1 33s ease-in-out infinite, fadeInOut 14s ease-in-out infinite;
          animation-delay: -15s, -15s, -6s;
        }

        .blob5 {
          width: 65vw;
          height: 32vw;
          max-width: 325px;
          max-height: 160px;
          bottom: 20%;
          right: 10%;
          background: radial-gradient(ellipse, #4d4d4d 0%, #262626 60%);
          border-radius: 40% 60% 30% 70% / 70% 30% 60% 40%;
          animation: morph2 34s ease-in-out infinite, move2 38s ease-in-out infinite, fadeInOut 16s ease-in-out infinite;
          animation-delay: -20s, -20s, -8s;
        }

        .blob6 {
          width: 60vw;
          height: 30vw;
          max-width: 300px;
          max-height: 150px;
          top: 60%;
          left: 5%;
          background: radial-gradient(ellipse, #525252 0%, #292929 60%);
          border-radius: 60% 40% 70% 30% / 50% 50% 40% 60%;
          animation: morph3 27s ease-in-out infinite, move3 36s ease-in-out infinite, fadeInOut 13s ease-in-out infinite;
          animation-delay: -8s, -8s, -3s;
        }

        .blob7 {
          width: 65vw;
          height: 32vw;
          max-width: 325px;
          max-height: 160px;
          top: 35%;
          left: 50%;
          background: radial-gradient(ellipse, #585858 0%, #2b2b2b 60%);
          border-radius: 80% 20% 60% 40% / 40% 60% 20% 80%;
          animation: morph1 31s ease-in-out infinite, move1 42s ease-in-out infinite, fadeInOut 17s ease-in-out infinite;
          animation-delay: -12s, -12s, -5s;
        }

        .grain {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMS4yIiBudW1PY3RhdmVzPSI1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjciIGQ9Ik0wIDBoMzAwdjMwMEgweiIvPjwvc3ZnPg==');
          opacity: 0.5;
          pointer-events: none;
          mix-blend-mode: overlay;
        }

        @keyframes fadeInOut {
          0%, 100% {
            opacity: 0;
            transform: scale(0.8);
          }
          20%, 80% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        @keyframes morph1 {
          0%, 100% {
            border-radius: 5% 95% 85% 15% / 10% 90% 70% 30%;
          }
          12.5% {
            border-radius: 25% 75% 95% 5% / 30% 70% 90% 10%;
          }
          25% {
            border-radius: 45% 55% 75% 25% / 50% 50% 80% 20%;
          }
          37.5% {
            border-radius: 65% 35% 55% 45% / 70% 30% 60% 40%;
          }
          50% {
            border-radius: 85% 15% 35% 65% / 90% 10% 40% 60%;
          }
          62.5% {
            border-radius: 75% 25% 15% 85% / 70% 30% 20% 80%;
          }
          75% {
            border-radius: 55% 45% 5% 95% / 50% 50% 10% 90%;
          }
          87.5% {
            border-radius: 35% 65% 25% 75% / 30% 70% 30% 70%;
          }
        }

        @keyframes morph2 {
          0%, 100% {
            border-radius: 15% 85% 75% 25% / 40% 60% 80% 20%;
          }
          12.5% {
            border-radius: 35% 65% 95% 5% / 60% 40% 90% 10%;
          }
          25% {
            border-radius: 55% 45% 85% 15% / 80% 20% 70% 30%;
          }
          37.5% {
            border-radius: 75% 25% 65% 35% / 90% 10% 50% 50%;
          }
          50% {
            border-radius: 95% 5% 45% 55% / 80% 20% 30% 70%;
          }
          62.5% {
            border-radius: 85% 15% 25% 75% / 60% 40% 10% 90%;
          }
          75% {
            border-radius: 65% 35% 5% 95% / 40% 60% 20% 80%;
          }
          87.5% {
            border-radius: 45% 55% 35% 65% / 20% 80% 40% 60%;
          }
        }

        @keyframes morph3 {
          0%, 100% {
            border-radius: 25% 75% 65% 35% / 20% 80% 60% 40%;
          }
          12.5% {
            border-radius: 45% 55% 85% 15% / 40% 60% 80% 20%;
          }
          25% {
            border-radius: 65% 35% 95% 5% / 60% 40% 90% 10%;
          }
          37.5% {
            border-radius: 85% 15% 75% 25% / 80% 20% 70% 30%;
          }
          50% {
            border-radius: 95% 5% 55% 45% / 90% 10% 50% 50%;
          }
          62.5% {
            border-radius: 75% 25% 35% 65% / 70% 30% 30% 70%;
          }
          75% {
            border-radius: 55% 45% 15% 85% / 50% 50% 10% 90%;
          }
          87.5% {
            border-radius: 35% 65% 45% 55% / 30% 70% 30% 70%;
          }
        }

        @keyframes move1 {
          0%, 100% {
            transform: translate(0%, 0%) rotate(0deg) scale(1);
          }
          12.5% {
            transform: translate(8%, 5%) rotate(2deg) scale(1.05);
          }
          25% {
            transform: translate(15%, 10%) rotate(5deg) scale(1.1);
          }
          37.5% {
            transform: translate(12%, 15%) rotate(3deg) scale(1.08);
          }
          50% {
            transform: translate(-5%, 20%) rotate(-2deg) scale(1.12);
          }
          62.5% {
            transform: translate(-10%, 15%) rotate(-4deg) scale(1.06);
          }
          75% {
            transform: translate(20%, 5%) rotate(3deg) scale(1.09);
          }
          87.5% {
            transform: translate(18%, -3%) rotate(1deg) scale(1.03);
          }
        }

        @keyframes move2 {
          0%, 100% {
            transform: translate(0%, 0%) rotate(0deg) scale(1);
          }
          12.5% {
            transform: translate(-8%, -5%) rotate(-2deg) scale(1.04);
          }
          25% {
            transform: translate(-15%, -10%) rotate(-4deg) scale(1.08);
          }
          37.5% {
            transform: translate(-12%, -15%) rotate(-2deg) scale(1.06);
          }
          50% {
            transform: translate(10%, -20%) rotate(3deg) scale(1.1);
          }
          62.5% {
            transform: translate(15%, -15%) rotate(5deg) scale(1.07);
          }
          75% {
            transform: translate(-5%, 8%) rotate(-1deg) scale(1.05);
          }
          87.5% {
            transform: translate(-8%, 12%) rotate(-3deg) scale(1.02);
          }
        }

        @keyframes move3 {
          0%, 100% {
            transform: translate(0%, 0%) rotate(0deg) scale(1);
          }
          12.5% {
            transform: translate(-12%, 4%) rotate(-3deg) scale(1.06);
          }
          25% {
            transform: translate(-20%, 8%) rotate(-6deg) scale(1.1);
          }
          37.5% {
            transform: translate(-18%, 12%) rotate(-4deg) scale(1.08);
          }
          50% {
            transform: translate(10%, -8%) rotate(2deg) scale(1.12);
          }
          62.5% {
            transform: translate(15%, -12%) rotate(4deg) scale(1.09);
          }
          75% {
            transform: translate(-6%, -15%) rotate(-2deg) scale(1.07);
          }
          87.5% {
            transform: translate(-10%, -8%) rotate(-1deg) scale(1.04);
          }
        }
      `}</style>
      <div className="gradient-container">
        <div className="blob blob1"></div>
        <div className="blob blob2"></div>
        <div className="blob blob3"></div>
        <div className="blob blob4"></div>
        <div className="blob blob5"></div>
        <div className="blob blob6"></div>
        <div className="blob blob7"></div>
        <div className="grain"></div>
      </div>
    </>
  );
};

export default CSSGradientBackground;

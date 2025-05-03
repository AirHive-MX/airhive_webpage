import { useState } from "react";

const videoSlides = [
  {
    video: "/mavic_bosquencinos.mp4",
    title: "Grabado con Air Hive X1",
    description: "Potencia y precisión aérea al alcance de tu misión.",
  },
  {
    video: "/video2.mp4",
    title: "Explora sin límites",
    description: "Captura cada rincón con autonomía y estabilidad.",
  },
  {
    video: "/video3.mp4",
    title: "Tecnología para crear historias",
    description: "Una nueva forma de ver el mundo desde el aire.",
  },
];

const VideoSlider = () => {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % videoSlides.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + videoSlides.length) % videoSlides.length);
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <video
        key={index}
        src={videoSlides[index].video}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      <div className="absolute inset-0  z-10" />

      {/* Text Overlay */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h2 className="text-4xl md:text-6xl font-bold mb-4">{videoSlides[index].title}</h2>
        <p className="text-lg md:text-xl text-gray-200">{videoSlides[index].description}</p>
      </div>

      {/* Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white text-4xl z-30 opacity-60 hover:opacity-100"
      >
        ❮
      </button>
      <button
        onClick={handleNext}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white text-4xl z-30 opacity-60 hover:opacity-100"
      >
        ❯
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {videoSlides.map((_, i) => (
          <div
            key={i}
            className={`w-4 h-1 rounded-full ${
              i === index ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default VideoSlider;

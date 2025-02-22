import React, { useState, useRef, useEffect } from "react";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import { songs } from "../../../utils/helpers";

const Playlist = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setDuration(audio.duration || 0);
    const updateProgress = () => setCurrentTime(audio.currentTime);
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", () =>
        setDuration(audio.duration)
      );
    };
  }, [currentSongIndex]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      cancelAnimationFrame(animationFrameRef.current);
    } else {
      audioRef.current
        .play()
        .catch((error) => console.error("Autoplay blocked:", error));
      setupAudioVisualizer();
    }
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % songs.length);
  };

  const prevSong = () => {
    setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
  };

  const setupAudioVisualizer = () => {
    if (!audioRef.current) return;
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 128;
      const source = audioContextRef.current.createMediaElementSource(
        audioRef.current
      );
      source.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
      dataArrayRef.current = new Uint8Array(
        analyserRef.current.frequencyBinCount
      );
    }
    drawVisualizer();
  };

  const drawVisualizer = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const renderFrame = () => {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / dataArrayRef.current.length) * 1.5;
      let x = 0;

      dataArrayRef.current.forEach((value) => {
        const barHeight = (value / 255) * canvas.height;
        ctx.fillStyle = `rgb(${value}, ${100}, ${255 - value})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      });

      animationFrameRef.current = requestAnimationFrame(renderFrame);
    };

    renderFrame();
  };

  return (
    <div className="w-full md:w-[400px] lg:w-[500px] xl:w-[600px] bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-2xl text-white shadow-lg">
      <h2 className="text-xl md:text-2xl font-bold mb-3 flex items-center gap-2">
        <MusicNoteIcon className="text-white" /> Relaxing Music 🎵
      </h2>
      <h3 className="text-lg font-semibold text-center mb-4">
        {songs[currentSongIndex].title}
      </h3>
      <div className="grid grid-cols-3 gap-4 items-center justify-center mb-4">
        <button
          onClick={prevSong}
          className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow-md hover:bg-gray-100"
        >
          <SkipPreviousIcon />
        </button>
        <button
          onClick={toggleMusic}
          className="flex items-center justify-center gap-2 bg-white text-blue-600 px-5 py-3 rounded-xl font-semibold shadow-md hover:bg-gray-100"
        >
          {isPlaying ? <StopCircleIcon /> : <PlayCircleIcon />}{" "}
          {isPlaying ? "Stop" : "Play"}
        </button>
        <button
          onClick={nextSong}
          className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow-md hover:bg-gray-100"
        >
          <SkipNextIcon />
        </button>
      </div>
      <input
        type="range"
        min="0"
        max={duration}
        value={currentTime}
        onChange={(e) => {
          if (audioRef.current) audioRef.current.currentTime = e.target.value;
        }}
        className="w-full cursor-pointer mb-4"
      />
      <canvas
        ref={canvasRef}
        className="w-full h-20 mt-4 bg-black rounded-lg"
      />
      <audio ref={audioRef} src={songs[currentSongIndex].src} loop />
    </div>
  );
};

export default Playlist;

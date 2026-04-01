import { useState, useCallback } from "react";
import SCENES from "./data/scenes";
import HomeScreen from "./components/HomeScreen";
import ModeSelector from "./components/ModeSelector";
import RepetitionMode from "./components/RepetitionMode";
import MicMode from "./components/MicMode";
import RecordMode from "./components/RecordMode";

export default function App() {
  const [screen, setScreen] = useState("home"); // home | modeSelect | play
  const [selectedSceneId, setSelectedSceneId] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const [progress, setProgress] = useState({}); // { sceneId: stars }
  const [filageIndex, setFilageIndex] = useState(null); // null = not in filage mode

  const selectedScene = SCENES.find((s) => s.id === selectedSceneId);

  const handleSelectScene = useCallback((id) => {
    setSelectedSceneId(id);
    setScreen("modeSelect");
  }, []);

  const handleSelectMode = useCallback((mode) => {
    setSelectedMode(mode);
    setScreen("play");
  }, []);

  const handleBack = useCallback(() => {
    if (screen === "play") {
      // If in filage mode, go back to home
      if (filageIndex !== null) {
        setFilageIndex(null);
        setScreen("home");
      } else {
        setScreen("modeSelect");
      }
    } else if (screen === "modeSelect") {
      setScreen("home");
    }
  }, [screen, filageIndex]);

  const handleMicComplete = useCallback(
    (stars) => {
      if (selectedSceneId == null) return;
      setProgress((prev) => {
        const current = prev[selectedSceneId] || 0;
        if (stars > current) {
          return { ...prev, [selectedSceneId]: stars };
        }
        return prev;
      });
    },
    [selectedSceneId]
  );

  const handleFilage = useCallback(() => {
    setFilageIndex(0);
    setSelectedSceneId(SCENES[0].id);
    setSelectedMode("repetition");
    setScreen("play");
  }, []);

  const handleFilageNext = useCallback(() => {
    const nextIndex = filageIndex + 1;
    if (nextIndex < SCENES.length) {
      setFilageIndex(nextIndex);
      setSelectedSceneId(SCENES[nextIndex].id);
    } else {
      setFilageIndex(null);
      setScreen("home");
    }
  }, [filageIndex]);

  // Wrap onBack for filage: when a scene ends, go to next scene
  const filageBackHandler = useCallback(() => {
    if (filageIndex !== null) {
      handleFilageNext();
    } else {
      handleBack();
    }
  }, [filageIndex, handleFilageNext, handleBack]);

  if (screen === "home") {
    return (
      <HomeScreen
        onSelectScene={handleSelectScene}
        onFilage={handleFilage}
        progress={progress}
      />
    );
  }

  if (screen === "modeSelect" && selectedScene) {
    return (
      <ModeSelector
        scene={selectedScene}
        onSelect={handleSelectMode}
        onBack={() => setScreen("home")}
      />
    );
  }

  if (screen === "play" && selectedScene && selectedMode) {
    const backFn = filageIndex !== null ? filageBackHandler : handleBack;

    if (selectedMode === "repetition") {
      return <RepetitionMode scene={selectedScene} onBack={backFn} />;
    }
    if (selectedMode === "micro") {
      return (
        <MicMode
          scene={selectedScene}
          onBack={backFn}
          onComplete={handleMicComplete}
        />
      );
    }
    if (selectedMode === "record") {
      return <RecordMode scene={selectedScene} onBack={backFn} />;
    }
  }

  // Fallback
  return (
    <HomeScreen
      onSelectScene={handleSelectScene}
      onFilage={handleFilage}
      progress={progress}
    />
  );
}

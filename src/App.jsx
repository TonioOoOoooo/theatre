import { useState, useCallback, useMemo } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import ActorSetup from "./components/ActorSetup";
import HomeScreen from "./components/HomeScreen";
import ModeSelector from "./components/ModeSelector";
import RepetitionMode from "./components/RepetitionMode";
import MicMode from "./components/MicMode";
import RecordMode from "./components/RecordMode";
import FullPlayScreen from "./components/FullPlayScreen";
import { playMusic, stopMusic } from "./utils/music";
import MusicToggle from "./components/MusicToggle";
import { getActorConfig } from "./utils/actorConfig";
import { buildScenesFromConfig } from "./utils/buildScenes";

export default function App() {
  const [screen, setScreen] = useState("welcome"); // welcome | actorSetup | home | modeSelect | play | fullPlay
  const [actorConfig, setActorConfig] = useState(getActorConfig);
  const [selectedSceneId, setSelectedSceneId] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const [progress, setProgress] = useState({}); // { sceneId: stars }
  const [filageIndex, setFilageIndex] = useState(null);

  const scenes = useMemo(() => buildScenesFromConfig(actorConfig), [actorConfig]);
  const selectedScene = scenes.find((s) => s.id === selectedSceneId);

  const handleActorDone = useCallback((config) => {
    setActorConfig(config);
    setProgress({});
    playMusic("/Game.mp3", { loop: true, volume: 0.25 });
    setScreen("home");
  }, []);

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
    if (scenes.length === 0) return;
    setFilageIndex(0);
    setSelectedSceneId(scenes[0].id);
    setSelectedMode("repetition");
    setScreen("play");
  }, [scenes]);

  const handleFilageNext = useCallback(() => {
    const nextIndex = filageIndex + 1;
    if (nextIndex < scenes.length) {
      setFilageIndex(nextIndex);
      setSelectedSceneId(scenes[nextIndex].id);
    } else {
      setFilageIndex(null);
      setScreen("home");
    }
  }, [filageIndex, scenes]);

  const filageBackHandler = useCallback(() => {
    if (filageIndex !== null) {
      handleFilageNext();
    } else {
      handleBack();
    }
  }, [filageIndex, handleFilageNext, handleBack]);

  const showMusicToggle = screen !== "welcome" && screen !== "actorSetup";
  const goWelcome = () => { stopMusic(); setScreen("welcome"); };

  if (screen === "welcome") {
    return (
      <WelcomeScreen
        onLecteurs={() => { stopMusic(); setScreen("fullPlay"); }}
        onActeurs={() => { stopMusic(); playMusic("/Game.mp3", { loop: true, volume: 0.25 }); setScreen("actorSetup"); }}
      />
    );
  }

  if (screen === "actorSetup") {
    return (
      <>
        {showMusicToggle && <MusicToggle />}
        <ActorSetup
          initialConfig={actorConfig}
          onDone={handleActorDone}
          onBack={goWelcome}
        />
      </>
    );
  }

  if (screen === "home") {
    return (
      <>
        {showMusicToggle && <MusicToggle />}
        <HomeScreen
          actorName={actorConfig.name}
          scenes={scenes}
          onSelectScene={handleSelectScene}
          onFilage={handleFilage}
          onBack={goWelcome}
          onReconfigure={() => setScreen("actorSetup")}
          progress={progress}
        />
      </>
    );
  }

  if (screen === "fullPlay") {
    return (
      <>
        {showMusicToggle && <MusicToggle />}
        <FullPlayScreen onBack={goWelcome} />
      </>
    );
  }

  if (screen === "modeSelect" && selectedScene) {
    return (
      <>
        {showMusicToggle && <MusicToggle />}
        <ModeSelector
          scene={selectedScene}
          onSelect={handleSelectMode}
          onBack={() => setScreen("home")}
        />
      </>
    );
  }

  if (screen === "play" && selectedScene && selectedMode) {
    const backFn = filageIndex !== null ? filageBackHandler : handleBack;

    if (selectedMode === "repetition") {
      return (
        <>
          {showMusicToggle && <MusicToggle />}
          <RepetitionMode scene={selectedScene} onBack={backFn} />
        </>
      );
    }
    if (selectedMode === "micro") {
      return (
        <>
          {showMusicToggle && <MusicToggle />}
          <MicMode
            scene={selectedScene}
            onBack={backFn}
            onComplete={handleMicComplete}
          />
        </>
      );
    }
    if (selectedMode === "record") {
      return (
        <>
          {showMusicToggle && <MusicToggle />}
          <RecordMode scene={selectedScene} onBack={backFn} />
        </>
      );
    }
  }

  // Fallback
  return (
    <WelcomeScreen
      onLecteurs={() => { stopMusic(); setScreen("fullPlay"); }}
      onActeurs={() => { stopMusic(); playMusic("/Game.mp3", { loop: true, volume: 0.25 }); setScreen("actorSetup"); }}
    />
  );
}

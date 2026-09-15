import { useState } from 'react';
import ConsentScreen from './components/ConsentScreen';
import InstructionsScreen from './components/InstructionsScreen';
import TrialScreen from './components/TrialScreen';
import CompletionScreen from './components/CompletionScreen';
import { buildTrials } from './data/stimuli';
import { saveSession } from './lib/saveSession';
import type { Screen, TrialConfig, TrialResult, SessionData } from './types';
import './App.css';

export default function App() {
  const [screen, setScreen] = useState<Screen>('consent');
  const [participantId, setParticipantId] = useState('');
  const [trials, setTrials] = useState<TrialConfig[]>([]);
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const [results, setResults] = useState<TrialResult[]>([]);
  const [startedAt, setStartedAt] = useState('');
  const [session, setSession] = useState<SessionData | null>(null);
  const [saveState, setSaveState] = useState<'saving' | 'saved' | 'error'>('saving');

  const handleStart = (id: string) => {
    setParticipantId(id);
    setTrials(buildTrials());
    setStartedAt(new Date().toISOString());
    setScreen('instructions');
  };

  const handleTrialSubmit = (result: TrialResult) => {
    const updatedResults = [...results, result];
    setResults(updatedResults);

    if (currentTrialIndex + 1 < trials.length) {
      setCurrentTrialIndex(currentTrialIndex + 1);
      return;
    }

    const finishedSession: SessionData = {
      participantId,
      startedAt,
      finishedAt: new Date().toISOString(),
      trials: updatedResults,
    };
    setSession(finishedSession);
    setScreen('complete');
    attemptSave(finishedSession);
  };

  const attemptSave = (data: SessionData) => {
    setSaveState('saving');
    saveSession(data)
      .then(() => setSaveState('saved'))
      .catch((error) => {
        console.error('[saveSession] failed', error);
        setSaveState('error');
      });
  };

  return (
    <div className="app-shell">
      {screen === 'consent' && <ConsentScreen onStart={handleStart} />}

      {screen === 'instructions' && (
        <InstructionsScreen
          trialCount={trials.length}
          onNext={() => setScreen('trial')}
        />
      )}

      {screen === 'trial' && trials[currentTrialIndex] && (
        <TrialScreen
          key={trials[currentTrialIndex].trialIndex}
          trial={trials[currentTrialIndex]}
          trialNumber={currentTrialIndex + 1}
          totalTrials={trials.length}
          onSubmit={handleTrialSubmit}
        />
      )}

      {screen === 'complete' && session && (
        <CompletionScreen
          session={session}
          saveState={saveState}
          onRetry={() => attemptSave(session)}
        />
      )}
    </div>
  );
}

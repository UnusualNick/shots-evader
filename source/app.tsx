import React, {useState} from 'react';
import {Box} from 'ink';
import UserNameEntry from './components/UserNameEntry.js';
import SetupPage from './components/SetupPage.js';
import GameplayPage from './components/GameplayPage.js';

interface Player {
	id: number;
	name: string;
	health: number;
	items: Record<string, number>; // item name -> quantity
	isUser: boolean;
}

type AppState = 'nameEntry' | 'setup' | 'gameplay';

export default function App() {
	const [appState, setAppState] = useState<AppState>('nameEntry');
	const [userName, setUserName] = useState('');
	const [players, setPlayers] = useState<Player[]>([]);
	const [liveAmmo, setLiveAmmo] = useState(0);
	const [blankAmmo, setBlankAmmo] = useState(0);

	const handleNameSubmit = (name: string) => {
		setUserName(name);
		setAppState('setup');
	};

	const handleGameStart = (newPlayers: Player[], live: number, blank: number) => {
		setPlayers(newPlayers);
		setLiveAmmo(live);
		setBlankAmmo(blank);
		setAppState('gameplay');
	};

	const handleBackToSetup = () => {
		setAppState('setup');
	};

	return (
		<Box width="100%" height="100%">
			{appState === 'nameEntry' ? (
				<UserNameEntry onNameSubmit={handleNameSubmit} />
			) : appState === 'setup' ? (
				<SetupPage userName={userName} onGameStart={handleGameStart} />
			) : (
				<GameplayPage
					userName={userName}
					players={players}
					initialLiveAmmo={liveAmmo}
					initialBlankAmmo={blankAmmo}
					onBackToSetup={handleBackToSetup}
				/>
			)}
		</Box>
	);
}

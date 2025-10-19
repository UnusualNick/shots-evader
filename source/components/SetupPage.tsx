import React, {useState} from 'react';
import {Box, Text, useInput} from 'ink';

interface Player {
	id: number;
	name: string;
	health: number;
	items: Record<string, number>; // item name -> quantity
	isUser: boolean;
}

interface SetupPageProps {
	userName: string;
	onGameStart: (players: Player[], liveAmmo: number, blankAmmo: number) => void;
}

export default function SetupPage({userName, onGameStart}: SetupPageProps) {
	const [step, setStep] = useState<'players' | 'naming' | 'health' | 'items' | 'ammo'>('players');
	const [numberOfPlayers, setNumberOfPlayers] = useState(2);
	const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
	const [players, setPlayers] = useState<Player[]>([]);
	const [liveAmmo, setLiveAmmo] = useState(0);
	const [blankAmmo, setBlankAmmo] = useState(0);
	const [selectedValue, setSelectedValue] = useState(0);

	const availableItems = [
		'Hand Saw', 'Magnifying Glass', 'Jammer', 'Cigarette Pack',
		'Beer', 'Burner Phone', 'Adrenaline', 'Inverter', 'Remote'
	];

	useInput((input, key) => {
		if (input === 'q' || (key.ctrl && input === 'c')) {
			process.exit(0);
		}

		if (step === 'players') {
			if (/^\d$/.test(input)) {
				const num = parseInt(input);
				if (num >= 2 && num <= 8) {
					setNumberOfPlayers(num);
				}
			} else if (key.upArrow && numberOfPlayers < 8) {
				setNumberOfPlayers(prev => prev + 1);
			} else if (key.downArrow && numberOfPlayers > 2) {
				setNumberOfPlayers(prev => prev - 1);
			} else if (key.return) {
				// Initialize players array
				const newPlayers: Player[] = Array.from({length: numberOfPlayers}, (_, i) => ({
					id: i + 1,
					name: i === 0 ? userName : `OPPONENT ${i}`,
					health: 0,
					items: {},
					isUser: i === 0,
				}));
				setPlayers(newPlayers);
				setStep('naming');
			}
		} else if (step === 'naming') {
			if (key.return) {
				if (currentPlayerIndex < numberOfPlayers - 1) {
					setCurrentPlayerIndex(prev => prev + 1);
				} else {
					setStep('health');
					setCurrentPlayerIndex(0);
					setSelectedValue(0);
				}
			}
		} else if (step === 'health') {
			if (/^\d$/.test(input)) {
				const num = parseInt(input);
				if (num >= 1 && num <= 6) {
					setSelectedValue(num);
				}
			} else if (key.upArrow && selectedValue > 1) {
				setSelectedValue(prev => prev - 1);
			} else if (key.downArrow && selectedValue < 6) {
				setSelectedValue(prev => prev + 1);
			} else if (key.return) {
				setPlayers(prev => prev.map((player, i) =>
					i === currentPlayerIndex ? {...player, health: selectedValue} : player
				));

				if (currentPlayerIndex < numberOfPlayers - 1) {
					setCurrentPlayerIndex(prev => prev + 1);
					setSelectedValue(0);
				} else {
					setStep('items');
					setCurrentPlayerIndex(0);
					setSelectedValue(0);
				}
			}
		} else if (step === 'items') {
			if (/^\d$/.test(input)) {
				const num = parseInt(input);
				const item = availableItems[selectedValue];
				if (item && num >= 0 && num <= 9) {
					setPlayers(prev => prev.map((player, i) => {
						if (i === currentPlayerIndex) {
							const newItems = {...player.items};
							if (num === 0) {
								delete newItems[item];
							} else {
								newItems[item] = num;
							}
							return {...player, items: newItems};
						}
						return player;
					}));
				}
			} else if (key.upArrow && selectedValue > 0) {
				setSelectedValue(prev => prev - 1);
			} else if (key.downArrow && selectedValue < availableItems.length - 1) {
				setSelectedValue(prev => prev + 1);
			} else if (input === ' ') {
				// Increase item quantity
				const item = availableItems[selectedValue];
				if (item) {
					setPlayers(prev => prev.map((player, i) => {
						if (i === currentPlayerIndex) {
							const currentQuantity = player.items[item] || 0;
							return {
								...player,
								items: {
									...player.items,
									[item]: currentQuantity + 1
								}
							};
						}
						return player;
					}));
				}
			} else if (input === 'x' || input === 'X') {
				// Decrease item quantity
				const item = availableItems[selectedValue];
				if (item) {
					setPlayers(prev => prev.map((player, i) => {
						if (i === currentPlayerIndex) {
							const currentQuantity = player.items[item] || 0;
							if (currentQuantity > 0) {
								const newItems = {...player.items};
								if (currentQuantity === 1) {
									delete newItems[item];
								} else {
									newItems[item] = currentQuantity - 1;
								}
								return {
									...player,
									items: newItems
								};
							}
						}
						return player;
					}));
				}
			} else if (key.return) {
				if (currentPlayerIndex < numberOfPlayers - 1) {
					setCurrentPlayerIndex(prev => prev + 1);
					setSelectedValue(0);
				} else {
					setStep('ammo');
					setSelectedValue(0);
				}
			}
		} else if (step === 'ammo') {
			if (/^\d$/.test(input)) {
				const num = parseInt(input);
				if (num >= 0 && num <= 8) {
					if (selectedValue === 0) {
						setLiveAmmo(num);
					} else {
						setBlankAmmo(num);
					}
				}
			} else if (key.leftArrow) {
				if (selectedValue === 0 && liveAmmo > 0) {
					setLiveAmmo(prev => prev - 1);
				} else if (selectedValue === 1 && blankAmmo > 0) {
					setBlankAmmo(prev => prev - 1);
				}
			} else if (key.rightArrow) {
				if (selectedValue === 0 && liveAmmo < 8) {
					setLiveAmmo(prev => prev + 1);
				} else if (selectedValue === 1 && blankAmmo < 8) {
					setBlankAmmo(prev => prev + 1);
				}
			} else if (key.upArrow && selectedValue > 0) {
				setSelectedValue(prev => prev - 1);
			} else if (key.downArrow && selectedValue < 1) {
				setSelectedValue(prev => prev + 1);
			} else if (key.return && liveAmmo > 0 && blankAmmo > 0) {
				onGameStart(players, liveAmmo, blankAmmo);
			}
		}
	});

	const renderPlayersStep = () => (
		<Box flexDirection="column" alignItems="center" justifyContent="center" width="100%">
			<Box borderStyle="single" borderColor="green" paddingX={2} paddingY={1} marginBottom={2}>
				<Text color="green" bold>SETUP: NUMBER OF PLAYERS</Text>
			</Box>
			<Box borderStyle="single" borderColor="greenBright" paddingX={4} paddingY={1} marginBottom={2}>
				<Text color="greenBright" bold>Players: {numberOfPlayers}</Text>
			</Box>
			<Box borderStyle="single" borderColor="greenBright" paddingX={2} paddingY={1}>
				<Text color="greenBright">Type number (2-8) or use ↑↓ arrows, Enter to confirm</Text>
			</Box>
		</Box>
	);

	const renderNamingStep = () => (
		<Box flexDirection="column" alignItems="center">
			<Box borderStyle="single" borderColor="green" paddingX={2} paddingY={1} marginBottom={2}>
				<Text color="green" bold>SETUP: PLAYER NAMES</Text>
			</Box>
			<Box borderStyle="single" borderColor={players[currentPlayerIndex]?.isUser ? 'green' : 'red'} paddingX={2} paddingY={1} marginBottom={2}>
				<Text color={players[currentPlayerIndex]?.isUser ? 'green' : 'red'}>
					{players[currentPlayerIndex]?.isUser ? 'USER' : 'OPPONENT'}: {players[currentPlayerIndex]?.name}
				</Text>
			</Box>
			<Box borderStyle="single" borderColor="greenBright" paddingX={2} paddingY={1}>
				<Text color="greenBright">Names are pre-set. Press Enter to continue</Text>
			</Box>
		</Box>
	);

	const renderHealthStep = () => {
		const currentPlayer = players[currentPlayerIndex];
		return (
			<Box flexDirection="column" alignItems="center">
				<Box borderStyle="single" borderColor="green" paddingX={2} paddingY={1} marginBottom={2}>
					<Text color="green" bold>SETUP: PLAYER HEALTH</Text>
				</Box>
				<Box borderStyle="single" borderColor={currentPlayer?.isUser ? 'green' : 'red'} paddingX={2} paddingY={1} marginBottom={2}>
					<Text color={currentPlayer?.isUser ? 'green' : 'red'}>
						Setting health for {currentPlayer?.name}
					</Text>
				</Box>
				<Box borderStyle="single" borderColor="greenBright" paddingX={4} paddingY={1} marginBottom={2}>
					<Text color="greenBright" bold>Health: {selectedValue}</Text>
				</Box>
				<Box borderStyle="single" borderColor="greenBright" paddingX={2} paddingY={1}>
					<Text color="greenBright">Type number (1-6) or use ↑↓ arrows, Enter to confirm</Text>
				</Box>
			</Box>
		);
	};

	const renderItemsStep = () => {
		const currentPlayer = players[currentPlayerIndex];
		return (
			<Box flexDirection="column" alignItems="center" width="100%">
				<Box borderStyle="single" borderColor="green" paddingX={2} paddingY={1} marginBottom={2}>
					<Text color="green" bold>SETUP: PLAYER ITEMS</Text>
				</Box>
				<Box borderStyle="single" borderColor={currentPlayer?.isUser ? 'green' : 'red'} paddingX={2} paddingY={1} marginBottom={2}>
					<Text color={currentPlayer?.isUser ? 'green' : 'red'}>
						Selecting items for {currentPlayer?.name}
					</Text>
				</Box>
				<Box flexDirection="column" marginTop={1} width="60%" borderStyle="single" borderColor="greenBright" paddingX={2} paddingY={1}>
					{availableItems.map((item, i) => {
						const isSelected = i === selectedValue;
						const quantity = currentPlayer?.items[item] || 0;
						const prefix = isSelected ? '>' : ' ';
						const display = quantity > 0 ? `[${quantity}x]` : '[--]';
						const color = isSelected ? 'greenBright' : 'green';

						return (
							<Box key={item}>
								<Text color={color}>{prefix} {display} {item}</Text>
							</Box>
						);
					})}
				</Box>
				<Box marginTop={2} borderStyle="single" borderColor="greenBright" paddingX={2} paddingY={1}>
					<Text color="greenBright">↑↓ navigate, Type numbers (0-9), Space +1, X -1, Enter next</Text>
				</Box>
			</Box>
		);
	};

	const renderAmmoStep = () => (
		<Box flexDirection="column" alignItems="center">
			<Box borderStyle="single" borderColor="green" paddingX={2} paddingY={1} marginBottom={2}>
				<Text color="green" bold>SETUP: SHOTGUN AMMO</Text>
			</Box>
			<Box flexDirection="column" marginTop={1} borderStyle="single" borderColor="greenBright" paddingX={4} paddingY={1}>
				<Box borderStyle="single" borderColor={selectedValue === 0 ? 'greenBright' : 'red'} paddingX={2} paddingY={1} marginBottom={1}>
					<Text color={selectedValue === 0 ? 'greenBright' : 'red'}>
						{selectedValue === 0 ? '> ' : '  '}LIVE ROUNDS: [{liveAmmo}]
					</Text>
				</Box>
				<Box borderStyle="single" borderColor={selectedValue === 1 ? 'greenBright' : 'cyan'} paddingX={2} paddingY={1}>
					<Text color={selectedValue === 1 ? 'greenBright' : 'cyan'}>
						{selectedValue === 1 ? '> ' : '  '}BLANK ROUNDS: [{blankAmmo}]
					</Text>
				</Box>
			</Box>
			<Box marginTop={2} borderStyle="single" borderColor="greenBright" paddingX={2} paddingY={1}>
				<Text color="greenBright">Type numbers, ↑↓ select, ←→ adjust, Enter to start</Text>
			</Box>
			{(liveAmmo === 0 || blankAmmo === 0) && (
				<Box marginTop={1} borderStyle="single" borderColor="red" paddingX={2} paddingY={1}>
					<Text color="red">Both ammo types must be greater than 0</Text>
				</Box>
			)}
		</Box>
	);

	return (
		<Box flexDirection="column" width="100%" height="100%" justifyContent="center" alignItems="center">
			<Box justifyContent="center" marginBottom={3} borderStyle="double" borderColor="red" paddingX={2} paddingY={1}>
				<Text color="red" bold>BUCKSHOT ROULETTE TACTICAL ASSISTANT</Text>
			</Box>

			<Box borderStyle="single" borderColor="green" paddingX={2} paddingY={1} width={80} justifyContent="center">
				{step === 'players' && renderPlayersStep()}
				{step === 'naming' && renderNamingStep()}
				{step === 'health' && renderHealthStep()}
				{step === 'items' && renderItemsStep()}
				{step === 'ammo' && renderAmmoStep()}
			</Box>

			<Box justifyContent="center" marginTop={3}>
				<Text color="green">Press Q to quit</Text>
			</Box>
		</Box>
	);
}

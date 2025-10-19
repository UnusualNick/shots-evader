import React, {useState} from 'react';
import {Box, Text, useInput} from 'ink';

interface Player {
	id: number;
	name: string;
	health: number;
	items: Record<string, number>; // item name -> quantity
	isUser: boolean;
}

interface GameAction {
	player: string;
	action: 'shoot' | 'item';
	target?: string;
	item?: string;
	result?: 'live' | 'blank';
	damage?: number;
}

interface GameplayPageProps {
	userName: string;
	players: Player[];
	initialLiveAmmo: number;
	initialBlankAmmo: number;
	onBackToSetup: () => void;
}

export default function GameplayPage({userName, players: initialPlayers, initialLiveAmmo, initialBlankAmmo, onBackToSetup}: GameplayPageProps) {
	const [players, setPlayers] = useState(initialPlayers);
	const [liveAmmo, setLiveAmmo] = useState(initialLiveAmmo);
	const [blankAmmo, setBlankAmmo] = useState(initialBlankAmmo);
	const [gameHistory, setGameHistory] = useState<GameAction[]>([]);
	const [phase, setPhase] = useState<'selectPlayer' | 'selectAction' | 'selectTarget' | 'selectItem' | 'selectResult'>('selectPlayer');
	const [selectedOption, setSelectedOption] = useState(0);
	const [currentAction, setCurrentAction] = useState<Partial<GameAction>>({});

	const totalAmmo = liveAmmo + blankAmmo;
	const livePercentage = totalAmmo > 0 ? (liveAmmo / totalAmmo) * 100 : 0;
	const blankPercentage = totalAmmo > 0 ? (blankAmmo / totalAmmo) * 100 : 0;

	// Check if game should end (only one player alive or no ammo left)
	const alivePlayers = players.filter(player => player.health > 0);
	if (alivePlayers.length <= 1 || totalAmmo === 0) {
		// Auto-return to setup after a brief moment
		setTimeout(() => {
			onBackToSetup();
		}, 2000);
	}

	useInput((input, key) => {
		if (input === 'q' || (key.ctrl && input === 'c')) {
			process.exit(0);
		}
		if (key.escape) {
			onBackToSetup();
			return;
		}

		if (phase === 'selectPlayer') {
			if (key.upArrow && selectedOption > 0) {
				setSelectedOption(prev => prev - 1);
			} else if (key.downArrow && selectedOption < players.length - 1) {
				setSelectedOption(prev => prev + 1);
			} else if (key.return) {
				const selectedPlayer = players[selectedOption];
				if (selectedPlayer) {
					setCurrentAction({player: selectedPlayer.name});
					setPhase('selectAction');
					setSelectedOption(0);
				}
			}
		} else if (phase === 'selectAction') {
			if (key.upArrow && selectedOption > 0) {
				setSelectedOption(prev => prev - 1);
			} else if (key.downArrow && selectedOption < 1) {
				setSelectedOption(prev => prev + 1);
			} else if (key.return) {
				const action = selectedOption === 0 ? 'shoot' : 'item';
				setCurrentAction(prev => ({...prev, action}));
				if (action === 'shoot') {
					setPhase('selectTarget');
				} else {
					setPhase('selectItem');
				}
				setSelectedOption(0);
			}
		} else if (phase === 'selectTarget') {
			if (key.upArrow && selectedOption > 0) {
				setSelectedOption(prev => prev - 1);
			} else if (key.downArrow && selectedOption < players.length - 1) {
				setSelectedOption(prev => prev + 1);
			} else if (key.return) {
				const targetPlayer = players[selectedOption];
				if (targetPlayer) {
					setCurrentAction(prev => ({...prev, target: targetPlayer.name}));
					setPhase('selectResult');
					setSelectedOption(0);
				}
			}
		} else if (phase === 'selectItem') {
			const currentPlayer = players.find(p => p.name === currentAction.player);
			const availableItems = currentPlayer ? Object.entries(currentPlayer.items).filter(([_, qty]) => qty > 0) : [];

			if (key.upArrow && selectedOption > 0) {
				setSelectedOption(prev => prev - 1);
			} else if (key.downArrow && selectedOption < availableItems.length - 1) {
				setSelectedOption(prev => prev + 1);
			} else if (key.return && availableItems.length > 0) {
				const selectedItem = availableItems[selectedOption];
				if (selectedItem) {
					const [itemName] = selectedItem;
					setCurrentAction(prev => ({...prev, item: itemName}));

					// Use the item immediately and record the action
					setPlayers(prev => prev.map(player =>
						player.name === currentAction.player
							? {
								...player,
								items: {
									...player.items,
									[itemName]: Math.max(0, (player.items[itemName] || 0) - 1)
								}
							}
							: player
					));

					const completeAction: GameAction = {
						...currentAction as GameAction,
						item: itemName,
					};
					setGameHistory(prev => [...prev, completeAction]);

					// Reset for next turn
					setCurrentAction({});
					setPhase('selectPlayer');
					setSelectedOption(0);
				}
			}
		} else if (phase === 'selectResult') {
			if (currentAction.action === 'shoot') {
				if (key.upArrow && selectedOption > 0) {
					setSelectedOption(prev => prev - 1);
				} else if (key.downArrow && selectedOption < 1) {
					setSelectedOption(prev => prev + 1);
				} else if (key.return) {
					const result = selectedOption === 0 ? 'live' : 'blank';

					// Update ammo counts
					if (result === 'live' && liveAmmo > 0) {
						setLiveAmmo(prev => prev - 1);

						// Damage the target if live round
						if (currentAction.target) {
							setPlayers(prev => prev.map(player =>
								player.name === currentAction.target
									? {...player, health: Math.max(0, player.health - 1)}
									: player
							));
						}
					} else if (result === 'blank' && blankAmmo > 0) {
						setBlankAmmo(prev => prev - 1);
					}

					// Record action
					const completeAction: GameAction = {
						...currentAction as GameAction,
						result,
						damage: result === 'live' ? 1 : 0,
					};
					setGameHistory(prev => [...prev, completeAction]);

					// Reset for next turn
					setCurrentAction({});
					setPhase('selectPlayer');
					setSelectedOption(0);
				}
			} else {
				// Item usage - skip result for now
				const completeAction: GameAction = {
					...currentAction as GameAction,
				};
				setGameHistory(prev => [...prev, completeAction]);

				setCurrentAction({});
				setPhase('selectPlayer');
				setSelectedOption(0);
			}
		}
	});

	const getRecommendation = (): string => {
		if (alivePlayers.length <= 1) {
			const winner = alivePlayers[0];
			return winner ? `GAME OVER - ${winner.name} WINS! Returning to setup...` : 'GAME OVER - Returning to setup...';
		}
		if (totalAmmo === 0) return `${userName}: MISSION COMPLETE - Return to setup`;
		if (liveAmmo === 0) return `${userName}: SAFE ZONE - Only blanks remaining, proceed with confidence`;
		if (blankAmmo === 0) return `${userName}: DANGER ZONE - Only live rounds left, extreme caution advised`;

		const userPlayer = players.find(p => p.isUser);
		const userHealth = userPlayer?.health || 0;

		if (livePercentage > 70) {
			if (userHealth <= 1) {
				return `${userName}: CRITICAL - High live chance (${livePercentage.toFixed(0)}%), you have ${userHealth} HP. AVOID SELF-TARGETING`;
			}
			return `${userName}: HIGH THREAT - ${livePercentage.toFixed(0)}% live chance. Target opponents, avoid yourself`;
		}

		if (livePercentage < 30) {
			return `${userName}: LOW THREAT - Only ${livePercentage.toFixed(0)}% live chance. Self-targeting is relatively safe`;
		}

		if (userHealth <= 1) {
			return `${userName}: CAUTION - You're at ${userHealth} HP with ${livePercentage.toFixed(0)}% live chance. Use items for intel`;
		}

		return `${userName}: MEDIUM THREAT - ${livePercentage.toFixed(0)}% live chance. Gather intelligence before deciding`;
	};

	const renderPlayerSelection = () => (
		<Box flexDirection="column" alignItems="center">
			<Text color="yellow" bold>SELECT CURRENT PLAYER</Text>
			<Box flexDirection="column" marginTop={1} alignItems="center">
				{players.map((player, i) => (
					<Text key={player.id} color={i === selectedOption ? 'yellow' : 'green'}>
						{i === selectedOption ? '► ' : '  '}{player.name} (Health: {player.health})
					</Text>
				))}
			</Box>
		</Box>
	);

	const renderActionSelection = () => (
		<Box flexDirection="column" alignItems="center">
			<Text color="yellow" bold>SELECT ACTION FOR {currentAction.player}</Text>
			<Box flexDirection="column" marginTop={1} alignItems="center">
				<Text color={selectedOption === 0 ? 'yellow' : 'green'}>
					{selectedOption === 0 ? '► ' : '  '}Shoot
				</Text>
				<Text color={selectedOption === 1 ? 'yellow' : 'green'}>
					{selectedOption === 1 ? '► ' : '  '}Use Item
				</Text>
			</Box>
		</Box>
	);

	const renderTargetSelection = () => (
		<Box flexDirection="column">
			<Text color="yellow" bold>SELECT TARGET FOR {currentAction.player}:</Text>
			<Box flexDirection="column" marginTop={1}>
				{players.map((player, i) => (
					<Text key={player.id} color={i === selectedOption ? 'yellow' : 'green'}>
						{i === selectedOption ? '► ' : '  '}{player.name} (Health: {player.health})
					</Text>
				))}
			</Box>
		</Box>
	);

	const renderItemSelection = () => {
		const currentPlayer = players.find(p => p.name === currentAction.player);
		const availableItems = currentPlayer ? Object.entries(currentPlayer.items).filter(([_, qty]) => qty > 0) : [];

		return (
			<Box flexDirection="column">
				<Box borderStyle="single" borderColor="white" paddingX={2} paddingY={1} marginBottom={1}>
					<Text color="white" bold>SELECT ITEM FOR {currentAction.player}:</Text>
				</Box>
				{availableItems.length === 0 ? (
					<Box borderStyle="single" borderColor="red" paddingX={2} paddingY={1}>
						<Text color="red">NO ITEMS AVAILABLE</Text>
					</Box>
				) : (
					<Box flexDirection="column" marginTop={1} borderStyle="single" borderColor="gray" paddingX={2} paddingY={1}>
						{availableItems.map(([itemName, quantity], i) => (
							<Box key={itemName} borderStyle="single" borderColor={i === selectedOption ? 'yellow' : 'green'} paddingX={1} marginBottom={1}>
								<Text color={i === selectedOption ? 'yellow' : 'green'}>
									{i === selectedOption ? '> ' : '  '}[{quantity}x] {itemName}
								</Text>
							</Box>
						))}
					</Box>
				)}
			</Box>
		);
	};

	const renderResultSelection = () => (
		<Box flexDirection="column">
			<Box borderStyle="single" borderColor="white" paddingX={2} paddingY={1} marginBottom={1}>
				<Text color="white" bold>SHOT RESULT:</Text>
			</Box>
			{currentAction.target && (
				<Box borderStyle="single" borderColor="cyan" paddingX={2} paddingY={1} marginBottom={1}>
					<Text color="cyan">TARGET: {currentAction.target}</Text>
				</Box>
			)}
			<Box flexDirection="column" marginTop={1} borderStyle="single" borderColor="gray" paddingX={2} paddingY={1}>
				<Box borderStyle="single" borderColor={selectedOption === 0 ? 'yellow' : 'red'} paddingX={1} marginBottom={1}>
					<Text color={selectedOption === 0 ? 'yellow' : 'red'}>
						{selectedOption === 0 ? '> ' : '  '}LIVE ROUND [DAMAGE]
					</Text>
				</Box>
				<Box borderStyle="single" borderColor={selectedOption === 1 ? 'yellow' : 'cyan'} paddingX={1}>
					<Text color={selectedOption === 1 ? 'yellow' : 'cyan'}>
						{selectedOption === 1 ? '> ' : '  '}BLANK ROUND [SAFE]
					</Text>
				</Box>
			</Box>
		</Box>
	);

	return (
		<Box flexDirection="column" width="100%" height="100%" justifyContent="center" alignItems="center">
			{/* Header */}
			<Box justifyContent="center" paddingY={1} marginBottom={1}>
				<Text color="cyan" bold>TACTICAL ASSISTANT - GAME IN PROGRESS</Text>
			</Box>

			{/* Main Content - Single Column Layout */}
			<Box flexDirection="column" alignItems="center" width="80%">

				{/* Ammo Status */}
				<Box flexDirection="column" alignItems="center" marginBottom={2} borderStyle="single" borderColor="gray" paddingX={3} paddingY={1}>
					<Text color="red" bold>AMMO STATUS</Text>
					<Box flexDirection="row" marginTop={1} gap={4}>
						<Box flexDirection="column" alignItems="center">
							<Text color="red">Live: {liveAmmo}/{initialLiveAmmo}</Text>
							<Text color="red">{livePercentage.toFixed(0)}%</Text>
						</Box>
						<Box flexDirection="column" alignItems="center">
							<Text color="cyan">Blank: {blankAmmo}/{initialBlankAmmo}</Text>
							<Text color="cyan">{blankPercentage.toFixed(0)}%</Text>
						</Box>
					</Box>
				</Box>

				{/* Recommendation */}
				<Box flexDirection="column" alignItems="center" marginBottom={2} borderStyle="single" borderColor="cyan" paddingX={3} paddingY={1} width="100%">
					<Text color="cyan" bold>TACTICAL RECOMMENDATION</Text>
					<Text color="cyan">
						{getRecommendation()}
					</Text>
				</Box>

				{/* Players Status */}
				<Box flexDirection="column" alignItems="center" marginBottom={2} borderStyle="single" borderColor="magenta" paddingX={3} paddingY={1}>
					<Text color="magenta" bold>PLAYER STATUS</Text>
					{players.map(player => {
						const itemCount = Object.values(player.items).reduce((sum, qty) => sum + qty, 0);
						return (
							<Text key={player.id} color="magenta">
								{player.name}: {player.health} HP, {itemCount} items
							</Text>
						);
					})}
				</Box>

				{/* Action Selection */}
				<Box flexDirection="column" alignItems="center" borderStyle="single" borderColor="yellow" paddingX={3} paddingY={1} width="100%">
					{phase === 'selectPlayer' && renderPlayerSelection()}
					{phase === 'selectAction' && renderActionSelection()}
					{phase === 'selectTarget' && renderTargetSelection()}
					{phase === 'selectItem' && renderItemSelection()}
					{phase === 'selectResult' && renderResultSelection()}
				</Box>

				{/* Controls */}
				<Box marginTop={2} justifyContent="center">
					<Text color="gray">↑↓ navigate, Enter confirm, Esc back to setup, Q quit</Text>
				</Box>

				{/* Recent History */}
				{gameHistory.length > 0 && (
					<Box flexDirection="column" alignItems="center" marginTop={2} borderStyle="single" borderColor="blue" paddingX={3} paddingY={1} width="100%">
						<Text color="blue" bold>RECENT ACTIONS</Text>
						{gameHistory.slice(-3).map((action, i) => {
							let actionText = `${action.player}: ${action.action}`;
							if (action.target) {
								actionText += ` → ${action.target}`;
							}
							if (action.result) {
								actionText += ` (${action.result})`;
								if (action.damage && action.damage > 0) {
									actionText += ` -${action.damage}HP`;
								}
							}
							return (
								<Text key={i} color="blue">
									{actionText}
								</Text>
							);
						})}
					</Box>
				)}

			</Box>
		</Box>
	);
}

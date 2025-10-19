import React, {useState} from 'react';
import {Box, Text, useInput} from 'ink';

interface UserNameEntryProps {
	onNameSubmit: (name: string) => void;
}

export default function UserNameEntry({onNameSubmit}: UserNameEntryProps) {
	const [userName, setUserName] = useState('');
	const isInputMode = true;

	useInput((input, key) => {
		if (input === 'q' || (key.ctrl && input === 'c')) {
			process.exit(0);
		}

		if (isInputMode) {
			if (key.return && userName.trim().length > 0) {
				onNameSubmit(userName.trim().toUpperCase());
			} else if (key.backspace || key.delete) {
				setUserName(prev => prev.slice(0, -1));
			} else if (input && input.match(/^[a-zA-Z0-9\s]$/)) {
				if (userName.length < 20) {
					setUserName(prev => prev + input);
				}
			}
		}
	});

	return (
		<Box flexDirection="column" width="100%" height="100%" justifyContent="center" alignItems="center">
			<Box borderStyle="double" borderColor="red" paddingX={4} paddingY={2} marginBottom={3}>
				<Text color="red" bold>BUCKSHOT ROULETTE TACTICAL ASSISTANT</Text>
			</Box>

			<Box borderStyle="single" borderColor="white" paddingX={3} paddingY={2} marginBottom={2}>
				<Text color="white" bold>OPERATOR IDENTIFICATION</Text>
			</Box>

			<Box borderStyle="single" borderColor="green" paddingX={4} paddingY={1} marginBottom={2}>
				<Text color="green">Enter your callsign: </Text>
			</Box>

			<Box borderStyle="single" borderColor="yellow" paddingX={2} paddingY={1} marginBottom={3} width={30}>
				<Text color="yellow" bold>
					{userName || '[TYPING...]'}
					{isInputMode && <Text color="cyan">_</Text>}
				</Text>
			</Box>

			<Box borderStyle="single" borderColor="gray" paddingX={2} paddingY={1} marginBottom={2}>
				<Text color="gray">Type your name and press ENTER to continue</Text>
			</Box>

			<Box borderStyle="single" borderColor="gray" paddingX={2} paddingY={1}>
				<Text color="gray">Maximum 20 characters - Letters, numbers, spaces only</Text>
			</Box>

			{userName.trim().length === 0 && (
				<Box marginTop={2} borderStyle="single" borderColor="red" paddingX={2} paddingY={1}>
					<Text color="red">Callsign required to proceed</Text>
				</Box>
			)}

			<Box marginTop={3}>
				<Text color="gray">Press Q to quit</Text>
			</Box>
		</Box>
	);
}

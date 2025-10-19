import React from 'react';
import {Box, Text} from 'ink';
import {TextInput} from '@inkjs/ui';

interface UserNameEntryProps {
	onNameSubmit: (name: string) => void;
}

export default function UserNameEntry({onNameSubmit}: UserNameEntryProps) {
	const handleSubmit = (value: string) => {
		if (value.trim().length > 0) {
			onNameSubmit(value.trim().toUpperCase());
		}
	};

	return (
		<Box flexDirection="column" width="100%" height="100%" justifyContent="center" alignItems="center">
			<Box borderStyle="double" borderColor="red" paddingX={4} paddingY={2} marginBottom={4}>
				<Text color="red" bold>BUCKSHOT ROULETTE TACTICAL ASSISTANT</Text>
			</Box>

			<Box borderStyle="single" borderColor="green" paddingX={3} paddingY={2} marginBottom={3}>
				<Text color="green" bold>Enter your callsign:</Text>
			</Box>

			<Box borderStyle="single" borderColor="greenBright" paddingX={2} paddingY={1} marginBottom={3} width={30}>
				<TextInput
					placeholder="OPERATOR"
					onSubmit={handleSubmit}
				/>
			</Box>

			<Box marginTop={2}>
				<Text color="green">Press Q to quit</Text>
			</Box>
		</Box>
	);
}

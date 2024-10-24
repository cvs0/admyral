"use client";

import { Box, Card, Flex, Text } from "@radix-ui/themes";
import { useEffect } from "react";
import ErrorCallout from "../utils/error-callout";
import { useListApiKeys } from "@/hooks/use-list-api-keys";
import { useApiKeysStore } from "@/stores/api-keys-store";
import ExistingApiKey from "./existing-api-key";
import CreateApiKey from "./create-api-keys";

export default function ApiKeys() {
	const { data, isPending, error } = useListApiKeys();
	const { apiKeys, setApiKeys, clear } = useApiKeysStore();

	useEffect(() => {
		if (data) {
			setApiKeys(data);
			return () => clear();
		}
	}, [data, setApiKeys, clear]);

	if (isPending) {
		return null;
	}

	if (error) {
		return <ErrorCallout />;
	}

	return (
		<Box width="50%">
			<Card size="3" variant="classic">
				<Flex direction="column" gap="5">
					<Flex justify="between">
						<Text size="4" weight="medium">
							API Keys
						</Text>

						<CreateApiKey />
					</Flex>

					{apiKeys.map((apiKey) => (
						<ExistingApiKey
							key={`api_keys_${apiKey.id}`}
							apiKey={apiKey}
						/>
					))}
				</Flex>
			</Card>
		</Box>
	);
}

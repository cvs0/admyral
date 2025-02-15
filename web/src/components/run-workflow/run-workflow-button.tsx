import { PlayIcon } from "@radix-ui/react-icons";
import { Button, Dialog } from "@radix-ui/themes";
import RunWorkflowDialog from "./run-workflow-dialog";
import { useState } from "react";

export default function RunWorkflowButton() {
	const [showModal, setShowModal] = useState<boolean>(false);
	return (
		<Dialog.Root
			open={showModal}
			onOpenChange={(isOpen) => {
				setShowModal(isOpen);
			}}
		>
			<Dialog.Trigger>
				<Button
					variant="solid"
					size="2"
					style={{
						cursor: "pointer",
					}}
				>
					<PlayIcon />
					Run
				</Button>
			</Dialog.Trigger>

			<RunWorkflowDialog closeDialog={() => setShowModal(false)} />
		</Dialog.Root>
	);
}

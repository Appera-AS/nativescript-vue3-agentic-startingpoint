export interface ChatMessage {
	text: string;
	side: "left" | "right";
	isLast: boolean;
}
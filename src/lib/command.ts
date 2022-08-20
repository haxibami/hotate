import type { LexicalCommand } from "lexical";
import { createCommand } from "lexical";

export const SAVE_COMMAND: LexicalCommand<KeyboardEvent> = createCommand();

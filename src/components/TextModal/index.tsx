import type { FC, ReactNode } from "react";

import { Modal, Button } from "react-daisyui";

interface Props {
  header: string;
  body: ReactNode;
  open: boolean;
  onClick: () => void;
}

const TextModal: FC<Props> = ({ header, body, open, onClick }) => {
  return (
    <Modal open={open} className="w-full max-w-md rounded">
      <Modal.Header className="font-bold">{header}</Modal.Header>

      <Modal.Body>{body}</Modal.Body>

      <Modal.Actions>
        <Button onClick={onClick} size="sm">
          OK
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default TextModal;

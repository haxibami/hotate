import { Modal, Button } from "react-daisyui";

import { useRecoilState } from "recoil";

import { isModalOpenState } from "../../store";

interface Props {
  header: string;
  body: string;
  actions: React.ReactNode;
}

const TextModal = () => {
  const [isModalOpen, setIsModalOpen] = useRecoilState(isModalOpenState);
  const toggleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
    <Modal open={isModalOpen} className="rounded">
      <Modal.Header className="font-bold">Hotate editor</Modal.Header>

      <Modal.Body>Some info</Modal.Body>

      <Modal.Actions>
        <Button onClick={toggleModalOpen} size="sm">
          OK
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default TextModal;

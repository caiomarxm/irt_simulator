import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

type CustomModalProps = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export default function ConfirmationModal({
  isOpen,
  onClose,
}: CustomModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Are you sure you want to submit?</ModalHeader>

        <ModalBody>
          <Text mb={3}>You can only commit this quiz once per exam.</Text>
          <Text>
            Once you have commited there's no going back, and you'll only be
            able to retry next year.
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            I'm sure!
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Not now...
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

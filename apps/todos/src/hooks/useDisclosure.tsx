import { useState } from 'react';

interface IDisclosure {
  initialState?: boolean;
}

export const useDisclosure = ({ initialState = false }: IDisclosure) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  return {
    isOpen,
    onOpen,
    onClose,
    onToggle,
  };
};

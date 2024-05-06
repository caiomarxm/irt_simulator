import { WarningIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
import { ReactNode, useCallback } from "react";

export const useCustomToast = () => {
  const toast = useToast();

  const errorToast = useCallback(
    (title: string, description: string, icon: ReactNode) => {
      toast({
        colorScheme: "red",
        title: title,
        description: description,
        position: "top",
        duration: 3000,
        icon: icon,
        isClosable: true,
      });
    },
    [toast]
  );

  const unknownErrorToast = useCallback(
    () => {
      toast({
        colorScheme: "red",
        title: "Unkown error",
        description: "An unknown error has occurred, please contact support for help.",
        position: "top",
        duration: 3000,
        icon: typeof WarningIcon,
        isClosable: true,
      });
    },
    [toast]
  );


  const successToast = useCallback(
    (title: string, description: string, icon: ReactNode) => {
      toast({
        colorScheme: "green",
        title: title,
        description: description,
        position: "top",
        duration: 3000,
        icon: icon,
        isClosable: true,
      });
    },
    [toast]
  );

  return {
    errorToast,
		unknownErrorToast,
    successToast,
  };
};

export default useCustomToast;

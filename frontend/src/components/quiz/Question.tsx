import {
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

type Props = {
  index: number;
  question: string;
  options: string[];
};

export const Question = ({ index, question, options }: Props) => {
  const [value, setValue] = useState<string>("")

  const optionsList = options.map((option, i) => {
    return <Radio value={`${i}`}>{option}</Radio>;
  });

  return (
    <FormControl key={index}>
      <FormLabel as="legend">{`${index}) ${question}`}</FormLabel>
      <RadioGroup mb={10} onChange={setValue} value={value}>
        <VStack spacing={5} alignItems="left">{optionsList}</VStack>
      </RadioGroup>
    </FormControl>
  );
};

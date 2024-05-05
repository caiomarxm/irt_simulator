import {
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  VStack,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction, useState } from "react";

export type QuestionProps = {
  index: number;
  questionId: number;
  question: string;
  options: string[];
  answers: Record<string, any>[];
  setAnswers: Dispatch<SetStateAction<Record<string, any>[]>>;
};

export const Question = ({
  index,
  question,
  questionId: question_id,
  options,
  answers,
  setAnswers,
}: QuestionProps) => {
  const [value, setValue] = useState<string>("");

  const handleChange = (value: string) => {
    setValue(value);
    const entry = { question_id: question_id, response_index: parseInt(value) };
    const newAnswers = answers.filter((answer) => answer.question_id != question_id);
    newAnswers.push(entry);
    setAnswers(newAnswers);
  };

  const optionsList = options.map((option, i) => {
    return (
      <Radio key={i} value={`${i}`}>
        {option}
      </Radio>
    );
  });

  return (
    <FormControl>
      <FormLabel as="legend">{`${index}) ${question}`}</FormLabel>
      <RadioGroup mb={10} onChange={handleChange} value={value}>
        <VStack spacing={5} alignItems="left">
          {optionsList}
        </VStack>
      </RadioGroup>
    </FormControl>
  );
};

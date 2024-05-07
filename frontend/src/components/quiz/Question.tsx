import {
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  VStack,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IAnswer } from "../../client/models/answer";

export type QuestionProps = {
  index: number;
  questionId: number;
  question: string;
  options: string[];
  answers: IAnswer[];
  setAnswers: Dispatch<SetStateAction<IAnswer[]>>;
  isSubmissionCommitted: boolean | undefined;
};

export const Question = ({
  index,
  question,
  questionId,
  options,
  answers,
  setAnswers,
  isSubmissionCommitted,
}: QuestionProps) => {
  const initialAnswer =
    answers.length > 0
      ? answers.filter((answer) => answer.question_id == questionId)
      : [];

  const initialValue =
    initialAnswer.length > 0 ? `${initialAnswer[0].response_index}` : "";

  const [value, setValue] = useState<string>(initialValue);

  useEffect(() => {
    setValue(initialValue)
  }, [setValue, initialValue])

  const handleChange = (value: string) => {
    setValue(value);
    const entry = { question_id: questionId, response_index: parseInt(value) };
    const newAnswers = answers.filter(
      (answer) => answer.question_id != questionId
    );
    newAnswers.push(entry as IAnswer);
    setAnswers(newAnswers);
  };

  const optionsList = options.map((option, i) => {
    return (
      <Radio key={i} value={`${i}`} isDisabled={isSubmissionCommitted} >
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

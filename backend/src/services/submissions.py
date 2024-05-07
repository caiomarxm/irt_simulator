import math
import numpy
from typing import List, Optional, Any

import numpy.array_api

from models import Submission, Answer


class SubmissionsService:
    granularity = 500

    @staticmethod
    def calculate_submission_result(submission: Submission):
        answers: Optional[List[Answer]] = submission.answers

        if not answers:
            raise ValueError(
                f"answers expected to be List[Answer], instead it was {type(answers)}")

        grades_probability = SubmissionsService._calculate_grades_probability(answers=answers)
        index_max = grades_probability.index(max(grades_probability))
        final_grade = SubmissionsService._get_normalized_domain()[index_max]

        return final_grade


    @staticmethod
    def _calculate_grades_probability(answers: List[Answer]):
        probability_matrix = SubmissionsService._get_answers_probability_matrix(
            answers=answers)
        
        grades_probability = []

        for i in range(SubmissionsService.granularity):
            product = 1
            for j, probability_vector in enumerate(probability_matrix):
                multiplier = (probability_vector[i] if answers[j].response_index ==
                              answers[j].question.correct_response_index else 1-probability_vector[i])

                product = product * multiplier

            grades_probability.append(product) 
        
        return grades_probability


    @staticmethod
    def _get_answers_probability_matrix(answers: List[Answer]):
        probability_matrix = [
            SubmissionsService._get_answer_probability_vector(
                answer=answer) for answer in answers
        ]
        return probability_matrix


    @staticmethod
    def _get_answer_probability_vector(answer: Answer):
        discrimination = 1 - (1/(answer.question.difficulty+0.3))
        difficulty =  1 - (1/(answer.question.difficulty+0.3))
        guess_factor = 0.1

        def calculate_probability(ability):
            return guess_factor + ((1-guess_factor)/(1+math.exp(-discrimination*(ability-difficulty))))

        domain = SubmissionsService._get_domain()
        probability_vector = numpy.vectorize(calculate_probability)(domain)

        return probability_vector


    @staticmethod
    def _get_domain():
        start = -10
        stop = 10
        step = (stop - start) / SubmissionsService.granularity
        return numpy.arange(start, stop, step)


    @staticmethod
    def _get_normalized_domain():
        start = 0
        stop = 1000
        step = (stop - start) / SubmissionsService.granularity
        return numpy.arange(start, stop, step)


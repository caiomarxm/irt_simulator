import math
import numpy
from typing import List, Optional, Any

import numpy.array_api

from models import Submission, Answer


class SubmissionsResultService:
    granularity = 200
    normalized_domain_start = 200
    normalized_domain_stop = 1000

    guess_factor = 0.05
    amortization = 0.25

    @staticmethod
    def calculate_submission_result(submission: Submission):
        answers: Optional[List[Answer]] = submission.answers

        if not answers:
            raise ValueError(
                f"answers expected to be List[Answer], instead it was {type(answers)}")

        grades_probability = SubmissionsResultService._calculate_grades_probability(answers=answers)
        index_max = grades_probability.index(max(grades_probability))

        final_grade = SubmissionsResultService._get_normalized_domain()[index_max]

        return final_grade


    @staticmethod
    def _calculate_grades_probability(answers: List[Answer]):
        probability_matrix = SubmissionsResultService._get_answers_probability_matrix(
            answers=answers)
        
        grades_probability = []

        for i_gran in range(SubmissionsResultService.granularity):
            product = 1
            for j_questions, probability_vector in enumerate(probability_matrix):
                answer = answers[j_questions]
                answer_index = answer.response_index
                correct_response_index = answer.question.correct_response_index
                is_answer_correct = answer_index == correct_response_index

                current_probability = probability_vector[i_gran]
                multiplier = (current_probability if is_answer_correct else (1-current_probability))

                product = product * multiplier

            grades_probability.append(product) 

        return grades_probability


    @staticmethod
    def _get_answers_probability_matrix(answers: List[Answer]):
        probability_matrix = [
            SubmissionsResultService._get_answer_probability_vector(
                answer=answer) for answer in answers
        ]
        return probability_matrix


    @staticmethod
    def _get_answer_probability_vector(answer: Answer):
        amortization = SubmissionsResultService.amortization

        discrimination = 1 - (1/(answer.question.difficulty+amortization))
        difficulty =  1 - (1/(answer.question.difficulty+amortization))
        guess_factor = SubmissionsResultService.guess_factor

        def calculate_probability(ability):
            return guess_factor + ((1-guess_factor)/(1+math.exp(-discrimination*(ability-difficulty))))

        domain = SubmissionsResultService._get_domain()
        probability_vector = numpy.vectorize(calculate_probability)(domain)

        return probability_vector


    @staticmethod
    def _get_domain():
        start = -10
        stop = 10
        step = (stop - start) / SubmissionsResultService.granularity
        return numpy.arange(start, stop, step)


    @staticmethod
    def _get_normalized_domain():
        start = SubmissionsResultService.normalized_domain_start
        stop = SubmissionsResultService.normalized_domain_stop
        step = (stop - start) / SubmissionsResultService.granularity
        return numpy.arange(start, stop, step)

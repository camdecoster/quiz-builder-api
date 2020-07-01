-- SELECT
--     quiz.title,
--     questions.question
-- FROM
--     quizzes as quiz
--     JOIN quiz_questions qq ON quiz.id = qq.quiz_id
--     JOIN questions ON questions.id = qq.question_id;
SELECT
    quiz.title,
    ARRAY (
        SELECT
            questions.question
        FROM
            questions
        WHERE
            questions.quiz_id = quiz.id
    ) as questions
FROM
    quizzes as quiz
WHERE
    quiz.user_id = 1;
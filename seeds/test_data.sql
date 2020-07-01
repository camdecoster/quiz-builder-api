TRUNCATE quiz_questions,
quizzes,
questions,
users RESTART IDENTITY CASCADE;

INSERT INTO
    users (email, password)
VALUES
    ('test1', 'test1'),
    ('test2', 'test2');

INSERT INTO
    quizzes (
        user_id,
        title,
        author,
        description,
        final_message_low,
        final_message_medium,
        final_message_high,
        final_message_perfect
    )
VALUES
    (
        1,
        'Directions Quiz',
        'Quiz Guy',
        'A quiz about directions',
        'Not good',
        'Meh',
        'Pretty good',
        'Awesome'
    );

INSERT INTO
    questions (
        user_id,
        quiz_id,
        question,
        answer_index,
        answers
    )
VALUES
    (
        1,
        1,
        'What is up?',
        0,
        '{"Up","Down","Left","Right"}'
    ),
    (
        1,
        1,
        'What is down?',
        1,
        '{"Up","Down","Left","Right"}'
    ),
    (
        1,
        1,
        'What is left?',
        2,
        '{"Up","Down","Left","Right"}'
    ),
    (
        1,
        1,
        'What is up?',
        3,
        '{"Up","Down","Left","Right"}'
    );

INSERT INTO
    quiz_questions (quiz_id, question_id)
VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (1, 4);
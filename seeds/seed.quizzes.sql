INSERT INTO
    quizzes (
        user_id,
        title,
        author,
        description,
        color_background,
        color_text,
        image_url,
        image_title,
        final_message_low,
        final_message_medium,
        final_message_high,
        final_message_perfect,
        date_modified
    )
VALUES
    (
        1,
        'Directions Quiz',
        'Quiz Guy',
        'A quiz about directions',
        'black',
        'white',
        null,
        null,
        'Not good',
        'Meh',
        'Pretty good',
        'Awesome',
        '2019-01-03T00:00:00.000Z'
    ),
    (
        1,
        'United States Geography Quiz',
        'Quiz Quizzington',
        'Test your knowledge of the State Capitols',
        'black',
        'white',
        null,
        null,
        'Time to go back to elementary school.',
        'I guess that capitols song didn''t really quite stick.',
        'Someone''s been looking at maps lately.',
        'We''ve got a walking atlas here!',
        '2019-01-03T00:00:00.000Z'
    );
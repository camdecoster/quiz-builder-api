INSERT INTO
    questions (
        user_id,
        quiz_id,
        question,
        answer_index,
        answers,
        color_background,
        color_text,
        image_url,
        image_title,
        date_modified
    )
VALUES
    (
        1,
        1,
        'What is up?',
        0,
        '{"Up","Down","Left","Right"}',
        'black',
        'white',
        null,
        null,
        '2019-01-03T00:00:00.000Z'
    ),
    (
        1,
        1,
        'What is down?',
        1,
        '{"Up","Down","Left","Right"}',
        'black',
        'white',
        null,
        null,
        '2019-01-03T00:00:00.000Z'
    ),
    (
        1,
        1,
        'What is left?',
        2,
        '{"Up","Down","Left","Right"}',
        'black',
        'white',
        null,
        null,
        '2019-01-03T00:00:00.000Z'
    ),
    (
        1,
        1,
        'What is up?',
        3,
        '{"Up","Down","Left","Right"}',
        'black',
        'white',
        null,
        null,
        '2019-01-03T00:00:00.000Z'
    ),
    (
        1,
        2,
        'What is the capitol of Oregon?',
        2,
        '{"Portland", "Eugene", "Salem", "Corvallis", "Bend"}',
        'black',
        'white',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Flag_of_Oregon.svg/320px-Flag_of_Oregon.svg.png',
        'flag of oregon',
        '2019-02-03T00:00:00.000Z'
    ),
    (
        1,
        2,
        'What is the largest state by area?',
        0,
        '{"Alaska", "Texas", "California", "Rhode Island", "New York", "Florida", "Hawaii", "Montana"}',
        'black',
        'white',
        'https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/320px-Flag_of_the_United_States.svg.png',
        'flag of united states',
        '2019-02-03T00:00:00.000Z'
    ),
    (
        1,
        2,
        'What is capitol of Colorado?',
        3,
        '{"Boulder",
                "Fort Collins",
                "Colorado Springs",
                "Denver",
                "Grand Junction"}',
        'black',
        'white',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Colorado_designed_by_Andrew_Carlisle_Carson.svg/320px-Flag_of_Colorado_designed_by_Andrew_Carlisle_Carson.svg.png',
        'flag of colorado',
        '2019-02-03T00:00:00.000Z'
    );
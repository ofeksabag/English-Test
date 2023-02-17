async function getResponse() {
    try {
        // Get elements:
        const difficultyBox = document.getElementById("difficultyBox");
        const storyDiv = document.getElementById("storyDiv");
        const levelContainer = document.getElementById("levelContainer");
        const answersContainer = document.getElementById("answersContainer");

        // Extract variables:
        const difficulty = difficultyBox.value;
        const story = storyDiv.value;

        if (difficulty === "") {
            storyDiv.innerText = "Firstly, Choose level.";
            return;
        };

        levelContainer.style.display = "none";

        storyDiv.innerText = "Loading story...";

        // Create prompt:
        const prompt = promptEngineering(difficulty);

        // Get completion:
        const completion = await getCompletion(prompt);

        // Display:
        displayHumanLikeWriting(completion);

        answersContainer.style.display = "block";

    }
    catch (err) {
        alert(err.message);
        console.log(err.message);
    }

}

async function checkAnswers() {
    try {
        const difficultyBox = document.getElementById("difficultyBox");
        const answersContainer = document.getElementById("answersContainer");

        const answer1Input = document.getElementById("answer1");
        const answer2Input = document.getElementById("answer2");
        const answer3Input = document.getElementById("answer3");
        const answer4Input = document.getElementById("answer4");
        const answer5Input = document.getElementById("answer5");

        const answer1 = answer1Input.value;
        const answer2 = answer2Input.value;
        const answer3 = answer3Input.value;
        const answer4 = answer4Input.value;
        const answer5 = answer5Input.value;

        answersContainer.style.display = "none";

        // Create prompt:
        const prompt = promptAnswers(answer1, answer2, answer3, answer4, answer5);

        // Get completion:
        const completion = await getCompletion(prompt);

        // Display:
        displayHumanLikeWriting(completion);

    }
    catch (err) {
        alert(err.message);
        console.log(err.message);
    }
}

async function displayHumanLikeWriting(completion) {
    let text = "";
    for (let i = 0; i < completion.length; i++) {
        text += completion[i];
        storyDiv.innerHTML = text;
        await delay(30);
    }
}

function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

// The question to create story and questions:
function promptEngineering(difficulty) {
    let prompt = `
        Write a little story on english for ${difficulty} and then write 5 questions about the story.
        Make the story max width 50%, padding 15px, text align left, border radius 10px, background color white, margin 10px auto using CSS.
        Arrange each question in a different HTML paragraph and width 50%, padding 15px, border radius 10px, background color white, margin 10px auto using CSS.
    `;

    return prompt;
}

// The question to check answers:
function promptAnswers(answer1, answer2, answer3, answer4, answer5) {
    let prompt = `
            "${answer1}" - whether the answer is correct to the question 1 or not. If the answer is correct, give 20 points following format: "answer" and if it current write "current" and "-" and how much points and " points".
            "${answer2}" - whether the answer is correct to the question 2 or not. If the answer is correct, give 20 points following format: "answer" and if it current write "current" and "-" and how much points and " points".
            "${answer3}" - whether the answer is correct to the question 3 or not. If the answer is correct, give 20 points following format: "answer" and if it current write "current" and "-" and how much points and " points".
            "${answer4}" - whether the answer is correct to the question 4 or not. If the answer is correct, give 20 points following format: "answer" and if it current write "current" and "-" and how much points and " points".
            "${answer5}" - whether the answer is correct to the question 5 or not. If the answer is correct, give 20 points following format: "answer" and if it current write "current" and "-" and how much points and " points".
            When you finish, Write down the total points in the following format:
            "Grade: X" at h1 using HTML.
            Arrange each in a different HTML paragraph.
        `;
    return prompt;
}

async function getCompletion(prompt) {

    // API key:
    const apiKey = "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";

    // URL:
    const url = "https://api.openai.com/v1/completions";

    // Request body:
    const body = {
        prompt,
        model: "text-davinci-003",
        max_tokens: 2500 // Max token in completion (returned answer)
    };

    // POST Options:
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Bearer " + apiKey
        },
        body: JSON.stringify(body)
    };

    // Get response:
    const response = await fetch(url, options);

    // Extract JSON:
    const json = await response.json();

    // If there is an error:
    if (response.status >= 400) throw json.error;

    // Extract completion:
    const completion = json.choices[0].text;

    // Return:
    return completion;

}
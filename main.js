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
        answersContainer.style.display = "block";

        storyDiv.innerText = "Loading story...";

        // Create prompt:
        const prompt = promptEngineering(difficulty);

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
            ${answer1}, ${answer2}, ${answer3}, ${answer4}, ${answer5}.
            Check the answers by write for each answer if its true or not and give a final grade for all the answers from 0 to 100 as true answer is 20 points.
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
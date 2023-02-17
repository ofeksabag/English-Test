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

        if(difficulty === "") {
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

function promptEngineering(difficulty) {
    let prompt = `
        Write a little story on english for ${difficulty} and then write 5 questions about the story.
        Make the story max width 50%, padding 15px, text align left, border radius 10px, background color white, margin 10px auto using CSS.
        Arrange each question in a different HTML paragraph and width 50%, padding 15px, border radius 10px, background color white, margin 10px auto using CSS.
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
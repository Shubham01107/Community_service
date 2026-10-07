// ==========================================
// DIGITAL SAATHI
// ==========================================


// ==========================================
// MESSAGE CHECKER
// ==========================================

const checkButton = document.getElementById("checkButton");
const messageInput = document.getElementById("messageInput");
const checkResult = document.getElementById("checkResult");


if (checkButton) {

    checkButton.addEventListener("click", async function () {

        const message = messageInput.value.trim();

        if (message === "") {

            checkResult.innerHTML = `
                <div class="result-card risk-medium">
                    <h3>⚠️ Message Required</h3>
                    <p>Please enter a message to analyse.</p>
                </div>
            `;

            return;
        }


        checkButton.innerText = "⏳ Analysing...";
        checkButton.disabled = true;


        try {

            const response = await fetch("/check", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: message
                })

            });


            const data = await response.json();


            let riskClass = "risk-low";

            if (data.risk === "HIGH") {
                riskClass = "risk-high";
            }

            else if (data.risk === "MEDIUM") {
                riskClass = "risk-medium";
            }


            let warningsHTML = "";

            if (data.warnings.length > 0) {

                warningsHTML = `
                    <h4>Warning Signs Detected</h4>

                    <ul class="warning-list">
                        ${data.warnings.map(function (warning) {
                            return `<li>${warning}</li>`;
                        }).join("")}
                    </ul>
                `;
            }


            let categoriesHTML = "";

            if (data.categories.length > 0) {

                categoriesHTML = `
                    <div>
                        ${data.categories.map(function (category) {
                            return `<span class="category">${category}</span>`;
                        }).join("")}
                    </div>
                `;
            }


            checkResult.innerHTML = `

                <div class="result-card ${riskClass}">

                    <div class="result-header">

                        <div>

                            <h2>
                                ${data.icon} ${data.risk} RISK
                            </h2>

                            <p>
                                ${data.message}
                            </p>

                        </div>

                        <div class="risk-score">
                            ${data.score}/100
                        </div>

                    </div>

                    ${categoriesHTML}

                    ${warningsHTML}

                    <hr style="margin:20px 0;border:0;border-top:1px solid #ddd;">

                    <strong>Safety Recommendation:</strong>

                    <p>
                        Never share OTP, UPI PIN, passwords, CVV,
                        private photos or sensitive personal information
                        with unknown people.
                    </p>

                </div>

            `;


        }

        catch (error) {

            console.error(error);

            checkResult.innerHTML = `
                <div class="result-card risk-high">
                    <h3>❌ Server Error</h3>
                    <p>
                        Could not connect to the Python backend.
                        Make sure app.py is running.
                    </p>
                </div>
            `;

        }


        checkButton.innerText = "🔍 Analyse Message";
        checkButton.disabled = false;

    });

}


// ==========================================
// 10 QUESTION QUIZ
// ==========================================

const quizButton = document.getElementById("quizButton");
const quizResult = document.getElementById("quizResult");


const correctAnswers = {

    q1: "B",
    q2: "C",
    q3: "B",
    q4: "C",
    q5: "D",
    q6: "C",
    q7: "C",
    q8: "A",
    q9: "B",
    q10: "C"

};


if (quizButton) {

    quizButton.addEventListener("click", function () {

        let score = 0;
        let attempted = 0;


        for (let question in correctAnswers) {

            const selected = document.querySelector(
                `input[name="${question}"]:checked`
            );


            if (selected) {

                attempted++;

                if (selected.value === correctAnswers[question]) {
                    score++;
                }

            }

        }


        if (attempted < 10) {

            quizResult.innerHTML = `
                <div class="quiz-result-card">
                    <h3>⚠️ Complete the Quiz</h3>
                    <p>
                        You have answered ${attempted}/10 questions.
                        Please answer all 10 questions.
                    </p>
                </div>
            `;

            quizResult.scrollIntoView({
                behavior: "smooth"
            });

            return;
        }


        const percentage = score * 10;

        let title;
        let message;


        if (score >= 9) {

            title = "Excellent! 🏆";

            message =
                "You have excellent cyber safety awareness.";

        }

        else if (score >= 7) {

            title = "Very Good! 🎯";

            message =
                "You understand most important cyber safety practices.";

        }

        else if (score >= 5) {

            title = "Good Start! 👍";

            message =
                "You know some important concepts, but there is still more to learn.";

        }

        else {

            title = "Keep Learning! 📚";

            message =
                "Go through Digital Saathi's safety topics and try the quiz again.";

        }


        quizResult.innerHTML = `

            <div class="quiz-result-card">

                <h2>${score}/10</h2>

                <h3>${title}</h3>

                <p>
                    ${message}
                </p>

                <p>
                    Your score: <strong>${percentage}%</strong>
                </p>

            </div>

        `;


        quizResult.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    });

}


// ==========================================
// FEEDBACK
// ==========================================

const feedbackForm = document.getElementById("feedbackForm");
const feedbackMessage = document.getElementById("feedbackMessage");


if (feedbackForm) {

    feedbackForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name =
            document.getElementById("feedbackName").value.trim();

        const feedback =
            document.getElementById("feedbackText").value.trim();


        if (name === "" || feedback === "") {

            feedbackMessage.innerText =
                "Please fill the required fields.";

            return;

        }


        feedbackMessage.innerText =
            "✓ Thank you, " + name + "! Your feedback has been recorded.";

        feedbackForm.reset();

    });

}


console.log("Digital Saathi loaded successfully.");
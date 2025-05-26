document.addEventListener('DOMContentLoaded', () => {
      const startScreen = document.getElementById('start-screen');
      const startButton = document.getElementById('start-button');
      const quizContainer = document.getElementById('quiz-container');
      const questionSlides = document.querySelectorAll('.question-slide');
      const prevButton = document.getElementById('prev-button');
      const nextButton = document.getElementById('next-button');
      const submitQuizButton = document.getElementById('submitQuiz');
      const scoreDisplay = document.getElementById('score');

      let currentQuestionIndex = 0;
      let score = 0;
      // Store user's selected answers for persistent state
      const userAnswers = {}; // {questionId: {selectedOptionElement: HTMLElement, isCorrect: boolean}}

      // --- Functions to manage quiz flow ---

      function showQuestion(index) {
        questionSlides.forEach((slide, i) => {
          slide.style.display = (i === index) ? 'block' : 'none';
        });
        updateNavigationButtons();
      }

      function updateNavigationButtons() {
        prevButton.disabled = currentQuestionIndex === 0;
        nextButton.disabled = currentQuestionIndex === questionSlides.length - 1;

        if (currentQuestionIndex === questionSlides.length - 1) {
          submitQuizButton.style.display = 'block'; // Show submit button on last question
          nextButton.style.display = 'none'; // Hide next button on last question
        } else {
          submitQuizButton.style.display = 'none';
          nextButton.style.display = 'block';
        }
      }

      function calculateAndDisplayFinalScore() {
        let finalScore = 0;
        let totalAnswered = 0;
        questionSlides.forEach(slide => {
          const questionId = slide.id;
          if (userAnswers[questionId] && userAnswers[questionId].isCorrect) {
            finalScore++;
          }
          if (userAnswers[questionId]) { // Count only answered questions
              totalAnswered++;
          }
        });
        scoreDisplay.textContent = `Ваш фінальний рахунок: ${finalScore} з ${questionSlides.length}. Ви відповіли на ${totalAnswered} питань.`;
      }

      // --- Event Listeners ---

      startButton.addEventListener('click', () => {
        startScreen.style.display = 'none';
        quizContainer.style.display = 'block';
        showQuestion(currentQuestionIndex);
      });

      prevButton.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
          currentQuestionIndex--;
          showQuestion(currentQuestionIndex);
        }
      });

      nextButton.addEventListener('click', () => {
        if (currentQuestionIndex < questionSlides.length - 1) {
          currentQuestionIndex++;
          showQuestion(currentQuestionIndex);
        }
      });

      submitQuizButton.addEventListener('click', () => {
        calculateAndDisplayFinalScore();
        // Optionally disable quiz interaction after submission
        prevButton.disabled = true;
        nextButton.disabled = true;
        submitQuizButton.disabled = true;
        questionSlides.forEach(slide => {
          slide.querySelectorAll('.options p').forEach(option => {
            option.style.pointerEvents = 'none';
          });
        });
      });

      // --- Logic for immediate answer feedback ---
      questionSlides.forEach(block => {
        const questionId = block.id;
        const optionsContainer = block.querySelector('.options');
        const options = optionsContainer.querySelectorAll('p');

        options.forEach(option => {
          option.addEventListener('click', () => {
            // If this question has already been answered, do nothing
            if (userAnswers[questionId]) {
              return;
            }

            // Remove 'selected' class from previously selected option in this block
            options.forEach(opt => opt.classList.remove('selected'));

            // Add 'selected' class to the clicked option
            option.classList.add('selected');

            // Check if the answer is correct or incorrect
            const isCorrect = (option.dataset.answer === 'correct');

            if (isCorrect) {
              option.classList.add('correct');
              userAnswers[questionId] = { selectedOptionElement: option, isCorrect: true };
            } else {
              option.classList.add('incorrect');
              // Highlight the correct answer
              options.forEach(opt => {
                if (opt.dataset.answer === 'correct') {
                  opt.classList.add('correct');
                }
              });
              userAnswers[questionId] = { selectedOptionElement: option, isCorrect: false };
            }

            // Disable further clicks for this question after an answer is given
            options.forEach(opt => opt.style.pointerEvents = 'none');
          });
        });
      });

      // Initial state: hide quiz, show start screen
      quizContainer.style.display = 'none';
      startScreen.style.display = 'block';
      updateNavigationButtons(); // Set initial button states
    });

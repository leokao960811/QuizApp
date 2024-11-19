import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { bank1, bank2, allBanks } from './questionBanks';
import './styles.css';

const formatTextWithLineBreaks = (text) => {
  return text.split('\n').map((line, index) => (
    <span key={index}>
      {line}
      <br />
    </span>
  ));
};

const QuizApp = () => {
  const [selectedBank, setSelectedBank] = useState(allBanks);
  const [selectedBankName, setSelectedBankName] = useState('allBanks'); // Track selected bank name
  const [randomizedQuestions, setRandomizedQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [numQuestions, setNumQuestions] = useState(2);
  const [score, setScore] = useState(0);
  const [quizEnded, setQuizEnded] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [inputValue, setInputValue] = useState(2);
  const [incorrectMessage, setIncorrectMessage] = useState('');
  const [timer, setTimer] = useState(15); // Set initial time per question
  const timerDuration = 15; // Time limit per question

  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  const formatTimer = () => {
    const minutes = Math.floor(timer / 60).toString().padStart(2, '0');
    const seconds = (timer % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  // Update timer each second
  useEffect(() => {
    let countdown;
    if (quizStarted && !showExplanation && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timer === 0) {
      handleAnswerClick(null);
    }

    return () => clearInterval(countdown);
  }, [quizStarted, timer, showExplanation]);

  const handleSelectBank = (bankName) => {
    const selectedQuestions =
      bankName === 'bank1' ? bank1 : bankName === 'bank2' ? bank2 : allBanks;
    setSelectedBank(selectedQuestions);
    setSelectedBankName(bankName); // Update selected bank name
  };

  const handleNumQuestionsSubmit = (event) => {
    event.preventDefault();
    const inputNum = parseInt(inputValue, 10);

    if (inputNum > 0 && inputNum <= selectedBank.length) {
      const shuffledQuestions = shuffleArray([...selectedBank]);
      const selectedQuestions = shuffledQuestions.slice(0, inputNum);
      setRandomizedQuestions(selectedQuestions);
      setNumQuestions(inputNum);
      setQuizStarted(true);
      setQuizEnded(false);
      setCurrentQuestion(0);
      setScore(0);
      setTimer(timerDuration); // Reset timer for the first question
    } else {
      alert(`Please enter a number between 1 and ${selectedBank.length}.`);
    }
  };

  const handleAnswerClick = (answer) => {
    const correct = randomizedQuestions[currentQuestion].correctAnswer;
    const incorrectMessages = randomizedQuestions[currentQuestion].incorrectMessages;
    setSelectedAnswer(answer);
    setShowExplanation(true);
    clearInterval(timer); // Stop the timer when an answer is selected

    if (answer === correct) {
      setIsCorrect(true);
      setScore((prev) => prev + 1);
    } else {
      setIsCorrect(false);
      setIncorrectMessage(answer ? incorrectMessages[answer] : "Time's up!");
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < numQuestions) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowExplanation(false);
      setIncorrectMessage('');
      setTimer(timerDuration); // Reset timer for the next question
    } else {
      setQuizEnded(true);
    }
  };

  const handlePlayAgain = () => {
    const shuffledQuestions = shuffleArray([...selectedBank]);
    const selectedQuestions = shuffledQuestions.slice(0, numQuestions);
    setRandomizedQuestions(selectedQuestions);
    setQuizStarted(true);
    setQuizEnded(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowExplanation(false);
    setScore(0);
  };

  const handleResetQuiz = () => {
    setQuizStarted(false);
    setQuizEnded(false);
    setCurrentQuestion(0);
    setScore(0);
    setTimer(timerDuration); // Reset timer to initial value
    setInputValue(5);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setIncorrectMessage('');
  };

  return (
    <div className="quiz-app">
      <Sidebar onSelectBank={handleSelectBank} selectedBankName={selectedBankName} />
      <div className="main-content">
      <div className="timer-display">{formatTimer()}</div>
        {!quizStarted ? (
          <div>
            <h2>Enter Number of Questions:</h2>
            <form onSubmit={handleNumQuestionsSubmit}>
              <label htmlFor="numQuestions">Questions: </label>
              <input
                id="numQuestions"
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                min="1"
                max={selectedBank.length}
              />
              <button type="submit">Start Quiz</button>
            </form>
          </div>
        ) : (
          <>
            {!quizEnded ? (
              <>
                {randomizedQuestions.length > 0 && (
                  <>
                    <Question
                      data={randomizedQuestions[currentQuestion]}
                      selectedAnswer={selectedAnswer}
                      isCorrect={isCorrect}
                      onAnswerClick={handleAnswerClick}
                    />
                    {showExplanation && (
                      <div>
                        {isCorrect ? (
                          <p>Correct!</p>
                        ) : (
                          <p>{formatTextWithLineBreaks(incorrectMessage)}</p>
                        )}
                        <p>{formatTextWithLineBreaks(randomizedQuestions[currentQuestion].explanation)}</p>
                      </div>
                    )}
                    <button onClick={handleNextQuestion} disabled={!showExplanation}>
                      Next Question
                    </button>
                  </>
                )}
                <button onClick={handleResetQuiz}>Reset</button>
              </>
            ) : (
              <div>
                <h2>Quiz Ended</h2>
                <div className="score-display">
                  Your final score is: {score} / {numQuestions}
                </div>
                <button onClick={handlePlayAgain}>Play Again</button>
                <button onClick={handleResetQuiz}>Reset</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const Question = ({ data, selectedAnswer, isCorrect, onAnswerClick }) => {
  return (
    <div>
      <h2>{formatTextWithLineBreaks(data.title)}</h2>
      <h3>{formatTextWithLineBreaks(data.quip)}</h3>
      <h4>{formatTextWithLineBreaks(data.question)}</h4>
      <ul>
        {data.answers.map((answer, idx) => (
          <li
            key={idx}
            className={`${
              selectedAnswer === answer ? (isCorrect ? 'correct' : 'incorrect') : ''
            }`}
            onClick={() => !selectedAnswer && onAnswerClick(answer)}
          >
            {answer}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizApp;

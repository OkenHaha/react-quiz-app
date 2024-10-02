import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert, ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import quizData from './data.json';

const QuizApp = () => {
  const [quizState, setQuizState] = useState({
    currentQuestion: null,
    selectedAnswer: '',
    score: 0,
    questionIndex: 0,
    showFeedback: false,
  });

  useEffect(() => {
    const data = quizData.data;
    setQuizState((prev) => ({ ...prev, currentQuestion: data[0] }));
  }, []);

  const handleAnswerSelect = (answer) => {
    if (quizState.showFeedback) return;
    
    const isCorrect = answer === quizState.currentQuestion.correct_answer;
    setQuizState((prev) => ({
      ...prev,
      selectedAnswer: answer,
      showFeedback: true,
      score: isCorrect ? prev.score + 1 : prev.score,
    }));
  };

  const handleNextQuestion = () => {
    const data = quizData.data;
    const { questionIndex } = quizState;
    
    if (questionIndex < data.length - 1) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestion: data[questionIndex + 1],
        selectedAnswer: '',
        questionIndex: questionIndex + 1,
        showFeedback: false,
      }));
    }
  };

  const handleRestartQuiz = () => {
    const data = quizData.data;
    setQuizState({
      currentQuestion: data[0],
      selectedAnswer: '',
      score: 0,
      questionIndex: 0,
      showFeedback: false,
    });
  };

  const getButtonVariant = (option) => {
    if (!quizState.showFeedback) {
      return quizState.selectedAnswer === option ? 'primary' : 'outline-secondary';
    }
    
    if (option === quizState.currentQuestion.correct_answer) {
      return 'success';
    }
    if (option === quizState.selectedAnswer) {
      return 'danger';
    }
    return 'outline-secondary';
  };

  const { currentQuestion, selectedAnswer, score, questionIndex, showFeedback } = quizState;

  return (
    <Container className="py-5">
      <Card>
        <Card.Body>
          <Card.Title as="h1" className="mb-4">Quiz App</Card.Title>
          {currentQuestion && (
            <>
              <ProgressBar 
                now={(questionIndex / quizData.data.length) * 100} 
                className="mb-4"
              />
              <Card.Subtitle className="mb-3">
                Question {questionIndex + 1} of {quizData.data.length}
              </Card.Subtitle>
              <Card.Text className="h5 mb-4">
                {currentQuestion.question}
              </Card.Text>
              <div className="d-grid gap-2">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={getButtonVariant(option)}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showFeedback}
                    className="text-start py-2"
                  >
                    {option}
                  </Button>
                ))}
              </div>
              {showFeedback && (
                <Alert 
                  variant={selectedAnswer === currentQuestion.correct_answer ? 'success' : 'danger'}
                  className="mt-3"
                >
                  {selectedAnswer === currentQuestion.correct_answer ? (
                    <strong>Correct!</strong>
                  ) : (
                    <>
                      <strong>Incorrect!</strong>
                      <div>The correct answer is: {currentQuestion.correct_answer}</div>
                    </>
                  )}
                </Alert>
              )}
              <div className="mt-3">
                {showFeedback && questionIndex < quizData.data.length - 1 && (
                  <div className="d-grid">
                    <Button 
                      variant="primary" 
                      size="lg"
                      onClick={handleNextQuestion}
                    >
                      Next Question
                    </Button>
                  </div>
                )}
                {showFeedback && questionIndex === quizData.data.length - 1 && (
                  <>
                    <Alert variant="info" className="text-center">
                      <Alert.Heading>Quiz Complete!</Alert.Heading>
                      <p className="mb-0">Final Score: {score} out of {quizData.data.length}</p>
                    </Alert>
                    <div className="d-grid mt-3">
                      <Button 
                        variant="primary" 
                        size="lg"
                        onClick={handleRestartQuiz}
                      >
                        Restart Quiz
                      </Button>
                    </div>
                  </>
                )}
                <div className="text-end mt-3">
                  <strong>Score: {score} / {quizData.data.length}</strong>
                </div>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default QuizApp;
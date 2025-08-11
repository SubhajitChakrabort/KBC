import React, { useState, useEffect, useRef, useCallback } from "react";
import useSound from "use-sound";
import play from "../sounds/play.mp3";
import correct from "../sounds/correct.mp3";
import wrong from "../sounds/wrong.mp3";
import { prizeMoney } from "../data";
import { MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter, MDBBtn } from "mdb-react-ui-kit";

const Quiz = ({ data, questionNumber, setQuestionNumber, setTimeOut, setName, setGameWon, onSpeechEnd, onQuestionWin, triggerNextQuestion, playAudioFinished, audioAndDelayComplete }) => {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [className, setClassName] = useState("answer");
  const [letsPlay] = useSound(play);
  const [correctAnswer] = useSound(correct);
  const [wrongAnswer] = useSound(wrong);
  
  // Text-to-Speech states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.8);
  const speechUtterances = useRef([]);
  const [playSoundTriggered, setPlaySoundTriggered] = useState(false);
  const [hasSpokenForCurrentQuestion, setHasSpokenForCurrentQuestion] = useState(false);
  const [speechTriggeredForCurrentQuestion, setSpeechTriggeredForCurrentQuestion] = useState(false);
  const [questionSpeechState, setQuestionSpeechState] = useState({}); // Track speech state per question
  const [showQuestion, setShowQuestion] = useState(false); // Control when to show the question

  // Delay function - defined early to avoid hoisting issues
  const delay = useCallback((duration, callBack) => {
    console.log(`Setting delay for ${duration}ms`);
    setTimeout(() => {
      console.log(`Delay callback executed after ${duration}ms`);
      callBack();
    }, duration);
  }, []);

  // Find male English voice
  const findMaleEnglishVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    
    // Debug: Log available voices
    console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
    
    // First, try to find voices with common male names
    const maleNames = ['david', 'james', 'mark', 'peter', 'john', 'mike', 'steve', 'tom', 'chris', 'alex'];
    for (let name of maleNames) {
      let maleVoice = voices.find(v => 
        v.lang.startsWith('en') && 
        v.name.toLowerCase().includes(name)
      );
      if (maleVoice) {
        console.log('Found male voice:', maleVoice.name);
        return maleVoice;
      }
    }
    
    // Second, try to find voices with 'male' in the name
    let maleVoice = voices.find(v => 
      v.lang.startsWith('en') && 
      v.name.toLowerCase().includes('male')
    );
    if (maleVoice) {
      console.log('Found male voice:', maleVoice.name);
      return maleVoice;
    }
    
    // Third, try to find voices that are not explicitly female
    let nonFemaleVoice = voices.find(v => 
      v.lang.startsWith('en') && 
      !v.name.toLowerCase().includes('female') &&
      !v.name.toLowerCase().includes('sarah') &&
      !v.name.toLowerCase().includes('lisa') &&
      !v.name.toLowerCase().includes('anna') &&
      !v.name.toLowerCase().includes('emma')
    );
    if (nonFemaleVoice) {
      console.log('Found non-female voice:', nonFemaleVoice.name);
      return nonFemaleVoice;
    }
    
    // Fourth, try any English voice
    let englishVoice = voices.find(v => v.lang.startsWith('en'));
    if (englishVoice) {
      console.log('Found English voice:', englishVoice.name);
      return englishVoice;
    }
    
    // Last resort - any available voice
    console.log('Using fallback voice:', voices[0]?.name);
    return voices[0];
  };

  // Wait for voices to load
  const waitForVoices = () => {
    return new Promise((resolve) => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve(voices);
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          resolve(window.speechSynthesis.getVoices());
        };
      }
    });
  };

  // Compose the text to speak: question + all options
  const getSpeakText = (q) => {
    if (!q) return "";
    let text = q.question + ". ";
    q.answers.forEach((ans, idx) => {
      const letter = String.fromCharCode(65 + idx);
      text += `Option ${letter}: ${ans.text}. `;
    });
    return text;
  };

  // Speak question and options with male English voice
  const speakQuestionAndOptions = useCallback(async (q) => {
    console.log('speakQuestionAndOptions called with:', q);
    if (!q || !('speechSynthesis' in window)) {
      console.log('Speech synthesis not available or no question');
      return;
    }
    
    // Prevent duplicate speech
    if (isSpeaking) {
      console.log('Already speaking, ignoring duplicate call');
      return;
    }
    
    window.speechSynthesis.cancel();
    setIsSpeaking(true);
    
    // Wait for voices to load
    await waitForVoices();
    
    const textToSpeak = getSpeakText(q);
    console.log('Text to speak:', textToSpeak);
    const utterance = new window.SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = speechRate;
    utterance.volume = 1;
    utterance.lang = 'en-US';
    utterance.voice = findMaleEnglishVoice();
    
    utterance.onend = () => {
      setIsSpeaking(false);
      console.log('Speech ended, waiting 3 seconds then starting timer...');
      
      // Wait 3 seconds after speech ends, then start timer
      delay(3000, () => {
        console.log('3 seconds passed, starting timer...');
        if (onSpeechEnd) {
          onSpeechEnd();
        }
      });
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
    };
    
    speechUtterances.current = [utterance];
    window.speechSynthesis.speak(utterance);
  }, [isSpeaking, speechRate, onSpeechEnd, delay]);

  // Stop speaking
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    if (questionNumber > data.length) {
      setTimeOut(true);
    } else {
      setQuestion(data[questionNumber - 1]);
      setHasSpokenForCurrentQuestion(false); // Reset speech state for new question
      setSpeechTriggeredForCurrentQuestion(false); // Reset speech trigger state for new question
    }
  }, [data, questionNumber, setTimeOut]);

  // Function to play sound before question loads
  const playSoundBeforeQuestion = useCallback(() => {
    console.log(`Playing sound before question ${questionNumber} loads...`);
    
    // Play sound using useSound hook
    try {
      letsPlay();
      console.log('Play sound triggered successfully');
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, [letsPlay, questionNumber]);

  // Effect to handle first question: wait for audio and delay to complete, then show question and speak
  useEffect(() => {
    if (questionNumber === 1 && audioAndDelayComplete && question && !hasSpokenForCurrentQuestion && !showQuestion) {
      console.log('First question: audio and delay complete, showing question and starting speech...');
      setShowQuestion(true);
      setHasSpokenForCurrentQuestion(true);
      
      // Start speaking the question immediately after showing it
      speakQuestionAndOptions(question).catch(console.error);
    }
  }, [questionNumber, audioAndDelayComplete, question, hasSpokenForCurrentQuestion, showQuestion, speakQuestionAndOptions]);

  // Effect for subsequent questions - triggered by win modal
  useEffect(() => {
    if (question && questionNumber > 1 && triggerNextQuestion > 0 && !hasSpokenForCurrentQuestion && !speechTriggeredForCurrentQuestion) {
      console.log(`Question ${questionNumber} triggered by win modal, starting play sound...`);
      setHasSpokenForCurrentQuestion(true);
      setShowQuestion(true);
      playSoundBeforeQuestion();
      delay(5000, () => {
        console.log('Play sound finished, starting speech for subsequent question...');
        if (question && !speechTriggeredForCurrentQuestion) {
          speakQuestionAndOptions(question).catch(console.error);
        }
      });
    }
  }, [question, questionNumber, triggerNextQuestion, hasSpokenForCurrentQuestion, speechTriggeredForCurrentQuestion, playSoundBeforeQuestion, speakQuestionAndOptions, delay]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const handleClick = (item) => {
    stopSpeaking(); // Stop speaking when answer is selected
    setSelectedAnswer(item);
    setClassName("answer active");
    delay(3000, () => {
      setClassName(item.correct ? "answer correct" : "answer wrong");
    });
    delay(5000, () => {
      if (item.correct) {
        correctAnswer();
        delay(1000, () => {
          if (questionNumber >= data.length) {
            setGameWon(true);
            setTimeOut(true);
          } else {
            // Get the current prize amount
            const currentPrizeAmount = prizeMoney.find((item) => item.id === questionNumber)?.amount || "₹ 0";
            // Call the win callback for all correct answers (the final question will be handled by gameWon)
            if (onQuestionWin) {
              onQuestionWin(currentPrizeAmount);
            }
            // Move to next question after a delay
            delay(3000, () => {
              setQuestionNumber((prev) => prev + 1);
              setSelectedAnswer(null);
              setShowQuestion(false); // Reset for next question
            });
          }
        });
      } else {
        wrongAnswer();
        delay(1000, () => {
          setTimeOut(true);
        });
      }
    });
  };

  return (
    <>
      <div className="quiz">
        {/* Voice Control */}
        <div className="voice-controls">
          <MDBBtn
            size="sm"
            color={isSpeaking ? "danger" : "success"}
            onClick={isSpeaking ? stopSpeaking : () => {
              if (question && !isSpeaking) {
                speakQuestionAndOptions(question).catch(console.error);
              }
            }}
          >
            {isSpeaking ? "🔇 Stop" : "🔊 Play"}
          </MDBBtn>
        </div>
        {showQuestion && (
          <>
            <div className="question">{question?.question}</div>
            <div className="answers">
              {question?.answers.map((item, index) => (
                <div
                  key={index}
                  className={selectedAnswer === item ? className : "answer"}
                  onClick={() => {
                    if (selectedAnswer) return;
                    if (typeof window !== 'undefined' && !window.__QUIZ_CAN_ANSWER__) return;
                    handleClick(item);
                  }}
                >
                  {item.text}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Quiz;

import { useState, useEffect } from "react";
import { MDBRow, MDBCol, MDBListGroup, MDBBtn, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter } from "mdb-react-ui-kit";
import "./App.css";
import Quiz from "./components/Quiz";
import { data, prizeMoney } from "./data";
import Timer from "./components/Timer";
import Start from "./components/Start";
import useSound from "use-sound";
import play from "./sounds/play.mp3";

function App() {
  const [name, setName] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [timeOut, setTimeOut] = useState(false);
  const [earned, setEarned] = useState("₹ 0");
  const [showLoseModal, setShowLoseModal] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showPrizeIncreaseModal, setShowPrizeIncreaseModal] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [timerShouldStart, setTimerShouldStart] = useState(false);
  const [currentPrize, setCurrentPrize] = useState("");
  const [triggerNextQuestion, setTriggerNextQuestion] = useState(0);
  const [playAudioFinished, setPlayAudioFinished] = useState(false);
  const [letsPlay] = useSound(play);
  const [audioAndDelayComplete, setAudioAndDelayComplete] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    questionNumber > 1 &&
      setEarned(
        prizeMoney.find((item) => item.id === questionNumber - 1).amount
      );
  }, [questionNumber]);

  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.innerWidth <= 600);
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  useEffect(() => {
    // Show lose modal if game over and not won
    if (timeOut && questionNumber <= data.length && !gameWon) {
      setShowLoseModal(true);
    } else {
      setShowLoseModal(false);
    }
  }, [timeOut, questionNumber, gameWon]);

  useEffect(() => {
    // Reset timer start state when question number changes
    setTimerShouldStart(false);
    setTriggerNextQuestion(0); // Reset trigger when question changes
  }, [questionNumber]);

  // Effect to play audio when name is entered
  useEffect(() => {
    if (name && !playAudioFinished) {
      console.log('Name entered, playing audio...');
      setPlayAudioFinished(true);
      
      // Play the audio
      letsPlay();
      
      // After 5 seconds (audio duration) + 3 seconds delay, allow the quiz to start
      setTimeout(() => {
        console.log('Audio finished, waiting 3 more seconds...');
        setTimeout(() => {
          console.log('3 seconds passed, quiz can now start');
          setAudioAndDelayComplete(true);
        }, 3000);
      }, 2000);
    }
  }, [name, playAudioFinished, letsPlay]);

  // Function to handle winning a question
  const handleQuestionWin = (prizeAmount) => {
    setCurrentPrize(prizeAmount);
    
    // First show the prize increase modal
    setShowPrizeIncreaseModal(true);
    
    // Auto-close prize increase modal after 3 seconds and show win modal
    setTimeout(() => {
      setShowPrizeIncreaseModal(false);
      
      // Show win modal after a short delay
      setTimeout(() => {
        setShowWinModal(true);
        
        // Speak the congratulatory message
        if ('speechSynthesis' in window) {
          const utterance = new window.SpeechSynthesisUtterance(`Hurray! You have won ${prizeAmount} prize!`);
          utterance.rate = 0.8;
          utterance.volume = 1;
          utterance.lang = 'en-US';
          
          // Find male voice
          const voices = window.speechSynthesis.getVoices();
          const maleVoice = voices.find(v => 
            v.lang.startsWith('en') && 
            (v.name.toLowerCase().includes('david') || 
             v.name.toLowerCase().includes('james') || 
             v.name.toLowerCase().includes('mark') ||
             !v.name.toLowerCase().includes('female'))
          ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
          
          utterance.voice = maleVoice;
          
          // Auto-close modal after speech ends and trigger next question sequence
          utterance.onend = () => {
            setTimeout(() => {
              setShowWinModal(false);
              // Trigger the next question sequence after modal closes
              setTimeout(() => {
                setTimerShouldStart(false); // Reset timer start state
                setTriggerNextQuestion(prev => {
                console.log('Triggering next question sequence, new value:', prev + 1);
                return prev + 1;
              }); // Trigger next question sequence
              }, 500);
            }, 1000); // Wait 1 second after speech ends
          };
          
          window.speechSynthesis.speak(utterance);
        } else {
          // If speech synthesis is not available, auto-close after 3 seconds
          setTimeout(() => {
            setShowWinModal(false);
            setTimeout(() => {
              setTimerShouldStart(false);
              setTriggerNextQuestion(prev => prev + 1);
            }, 500);
          }, 3000);
        }
      }, 500);
    }, 3000);
  };

  return (
    <div className="App">
      {/* Mobile Info Bar */}
      <div className="mobile-info-bar">
        <div className="mobile-info-content">
          <div className="mobile-info-item">
            <span>Name: <span style={{ color: '#007bff' }}>{name}</span></span>
          </div>
          {isMobile && !timeOut && (
            <div className="mobile-info-item mobile-top-timer">
              <div className="timer">
                      <Timer
                  setTimeOut={setTimeOut}
                  questionNumber={questionNumber}
                        shouldStart={timerShouldStart}
                        stopSignal={timeOut}
                />
              </div>
            </div>
          )}
          <div className="mobile-info-item">
            <span>Earned: <span style={{ color: '#ffc107' }}><span className="material-icons coin-icon">monetization_on</span> {earned}</span></span>
          </div>
        </div>
      </div>

      {!name ? (
        <Start setName={setName} setTimeOut={setTimeOut} />
      ) : (
        <MDBRow>
          <MDBCol md="9">
            <div className="main">
              {timeOut ? (
                gameWon ? (
                  <div style={{ textAlign: "center", padding: "50px" }}>
                    <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🎉🎊🏆🎉🎊</div>
                    <h1 className="earned">🎉 Congratulations! You've Won! 🎉</h1>
                    <div style={{ fontSize: "2rem", marginBottom: "20px" }}>💎💰💎</div>
                    <h2 style={{ color: "#28a745", marginTop: "20px" }}>Total Prize: <span className="material-icons coin-icon">monetization_on</span> ₹ 1,000,000,000</h2>
                    <p style={{ fontSize: "18px", marginTop: "20px" }}>You've successfully answered all {data.length} questions!</p>
                    <div style={{ fontSize: "2rem", marginTop: "20px" }}>🎊🎉🎊</div>
                    <p style={{ fontSize: "16px", marginTop: "20px", color: "#ffc107", fontWeight: "bold" }}>You are now a KBC Millionaire! 🏆</p>
                  </div>
                ) : (
                  <></>
                )
              ) : (
                <>
                  <div className="timer-container" style={{ height: "50%", position: "relative" }}>
                    {!isMobile && (
                      <div className="timer">
                <Timer
                          setTimeOut={setTimeOut}
                          questionNumber={questionNumber}
                  shouldStart={timerShouldStart}
                  stopSignal={timeOut}
                        />
                      </div>
                    )}
                  </div>
                  <div className="quiz-container" style={{ height: "50%" }}>
                    <Quiz
                      data={data}
                      questionNumber={questionNumber}
                      setQuestionNumber={setQuestionNumber}
                      setTimeOut={setTimeOut}
                      setName={setName}
                      setGameWon={setGameWon}
                       onSpeechEnd={() => {
                        console.log('Speech ended, starting timer...');
                         // Allow answers only once timer starts
                         if (typeof window !== 'undefined') window.__QUIZ_CAN_ANSWER__ = true;
                         setTimerShouldStart(true);
                      }}
                      onQuestionWin={handleQuestionWin}
                      triggerNextQuestion={triggerNextQuestion}
                      playAudioFinished={playAudioFinished}
                      audioAndDelayComplete={audioAndDelayComplete}
                    />
                  </div>
                </>
              )}
            </div>
          </MDBCol>
          <MDBCol md="3" className="money">
            <MDBListGroup className="money-list">
              <MDBRow>
                <span className="mb-2" style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "flex-end", gap: 8 }}>
                  <MDBBtn
                    style={{ float: "right" }}
                    className="mx-2"
                    color="light"
                    onClick={() => {
                      // Disallow answering and stop any ticking
                      if (typeof window !== 'undefined') window.__QUIZ_CAN_ANSWER__ = false;
                      setTimeOut(true);
                    }}
                  >
                    Quit
                  </MDBBtn>
                  <MDBBtn
                    style={{ float: "right" }}
                    onClick={() => {
                      if (typeof window !== 'undefined') window.__QUIZ_CAN_ANSWER__ = false;
                      setName(null);
                      setQuestionNumber(1);
                      setEarned("₹ 0");
                      setTimeOut(false);
                      setGameWon(false);
                      setTimerShouldStart(false);
                      setShowWinModal(false);
                      setShowPrizeIncreaseModal(false);
                      setTriggerNextQuestion(0);
                      setPlayAudioFinished(false);
                      setAudioAndDelayComplete(false);
                    }}
                  >
                    Exit
                  </MDBBtn>
                </span>
                {/* Desktop sidebar info: show only on desktop, hidden on mobile */}
                <MDBCol md="12" xs="12" className="sidebar-info d-none d-md-block" style={{ margin: '10px 0 10px 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 2 }}>Name: <span style={{ color: '#007bff' }}>{name}</span></div>
                  <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 2 }}>Earned: <span style={{ color: '#ffc107' }}><span className="material-icons coin-icon">monetization_on</span> {earned}</span></div>
                </MDBCol>
              </MDBRow>
              <hr />
              {prizeMoney.map((item, idx) => (
                <li
                  key={item.id}
                  className={
                    questionNumber === item.id ? "item active" : "item"
                  }
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <h5 className="amount" style={{ margin: 0 }}><span className="material-icons coin-icon">monetization_on</span> {item.amount}</h5>
                </li>
              ))}
            </MDBListGroup>
          </MDBCol>
        </MDBRow>
      )}
      
      {/* Prize Increase Modal */}
      <MDBModal show={showPrizeIncreaseModal} setShow={setShowPrizeIncreaseModal} tabIndex="-1" backdrop={true}>
        <MDBModalDialog size="lg" centered>
          <MDBModalContent className="prize-increase-modal themed-modal-content">
            <MDBModalHeader className="prize-increase-header themed-modal-header">
              <MDBModalTitle className="themed-modal-title">🎉 Prize Money Increased! 🎉</MDBModalTitle>
            </MDBModalHeader>
            <MDBModalBody className="prize-increase-body themed-modal-body">
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
                <div style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700, color: '#ffc107' }}>
                  Your Prize Money Has Stepped Up!
                </div>
                <div style={{ fontSize: '1.1rem', color: '#bbb', marginBottom: '1rem' }}>
                  You've successfully moved to the next level!
                </div>
              </div>
              <div className="prize-increase-list">
                <MDBListGroup>
                  {prizeMoney.map((item, idx) => (
                    <li
                      key={item.id}
                      className={
                        questionNumber === item.id ? "item prize-increase" : 
                        questionNumber > item.id ? "item" : "item"
                      }
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 6,
                        opacity: questionNumber > item.id ? 0.6 : 1
                      }}
                    >
                      <h5 className="amount" style={{ margin: 0 }}>
                        <span className="material-icons coin-icon">monetization_on</span> {item.amount}
                      </h5>
                    </li>
                  ))}
                </MDBListGroup>
              </div>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      {/* Lose Modal */}
      <MDBModal show={showLoseModal} setShow={setShowLoseModal} tabIndex="-1" backdrop={true}>
        <MDBModalDialog size="md" centered>
          <MDBModalContent>
            <MDBModalHeader style={{ background: '#222', color: '#fff' }}>
              <MDBModalTitle style={{ fontWeight: 700, fontSize: '1.5rem' }}>Game Over</MDBModalTitle>
            </MDBModalHeader>
            <MDBModalBody className="text-center" style={{ background: '#111', color: '#fff', padding: '2rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>😢</div>
              <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>You gave a wrong answer!</div>
              <div style={{ fontSize: '1.3rem', color: '#ffc107', fontWeight: 700, marginBottom: '1rem' }}>
                You Earned: <span className="material-icons coin-icon">monetization_on</span> {earned}
              </div>
              <div style={{ fontSize: '1rem', color: '#bbb' }}>Better luck next time!</div>
            </MDBModalBody>
            <MDBModalFooter style={{ background: '#222' }}>
              <MDBBtn color="primary" onClick={() => {
                setShowLoseModal(false);
                setName(null);
                setQuestionNumber(1);
                setEarned("₹ 0");
                setTimeOut(false);
                setGameWon(false);
                setTimerShouldStart(false);
                setShowWinModal(false);
                setShowPrizeIncreaseModal(false);
                setTriggerNextQuestion(0);
                setPlayAudioFinished(false);
                setAudioAndDelayComplete(false);
              }} style={{ width: '100%' }}>
                Play Again
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
      
      {/* Win Modal */}
      <MDBModal show={showWinModal} setShow={setShowWinModal} tabIndex="-1" backdrop={true}>
        <MDBModalDialog size="md" centered>
          <MDBModalContent className="prize-increase-modal themed-modal-content win-modal-content">
            <MDBModalHeader className="prize-increase-header themed-modal-header">
              <MDBModalTitle className="themed-modal-title">🎉 Congratulations! 🎉</MDBModalTitle>
            </MDBModalHeader>
            <MDBModalBody className="text-center themed-modal-body" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
              <div style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700, color: '#ffc107' }}>
                You've Won!
              </div>
              <div className="prize-amount" style={{ fontSize: '2rem', color: '#ffc107', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <span className="material-icons coin-icon coin-spin" style={{ fontSize: '2rem' }}>monetization_on</span>
                {currentPrize}
              </div>
              <div style={{ fontSize: '1.1rem', color: '#ddd', marginBottom: '1rem' }}>
                Excellent answer! Keep going to win more!
              </div>
              <div style={{ fontSize: '2rem', marginTop: '1rem' }}>🎊🎉🎊</div>
            </MDBModalBody>
            <MDBModalFooter className="themed-modal-footer">
              <MDBBtn color="info" onClick={() => {
                setShowWinModal(false);
                setTimeout(() => {
                  setTimerShouldStart(false);
                  setTriggerNextQuestion(prev => prev + 1);
                }, 500);
              }} style={{ width: '100%', fontWeight: 600 }}>
                Continue to Next Question
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
}

export default App;

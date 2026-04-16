import { useState, useEffect } from "react";

// DIBELS sight words with common misspellings
const WORD_PAIRS = [
  { correct: "the",   wrong: "teh"   },
  { correct: "and",   wrong: "adn"   },
  { correct: "is",    wrong: "si"    },
  { correct: "you",   wrong: "yuo"   },
  { correct: "said",  wrong: "siad"  },
  { correct: "like",  wrong: "liek"  },
  { correct: "come",  wrong: "coem"  },
  { correct: "have",  wrong: "ahve"  },
  { correct: "from",  wrong: "form"  },
  { correct: "they",  wrong: "thye"  },
  { correct: "were",  wrong: "wree"  },
  { correct: "what",  wrong: "waht"  },
  { correct: "when",  wrong: "wehn"  },
  { correct: "there", wrong: "theer" },
  { correct: "with",  wrong: "wiht"  },
  { correct: "this",  wrong: "tihs"  },
  { correct: "will",  wrong: "wlil"  },
  { correct: "look",  wrong: "olok"  },
  { correct: "see",   wrong: "ese"   },
  { correct: "play",  wrong: "plya"  },
  { correct: "here",  wrong: "heer"  },
  { correct: "make",  wrong: "maek"  },
  { correct: "that",  wrong: "taht"  },
  { correct: "jump",  wrong: "jmup"  },
  { correct: "can",   wrong: "acn"   },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TOTAL = 10;
const STARS = ["⭐", "🌟", "✨"];

function StarBurst({ count }) {
  return (
    <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap" }}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{
          fontSize: "28px",
          animation: `popIn 0.3s ease ${i * 0.08}s both`,
        }}>⭐</span>
      ))}
    </div>
  );
}

function Cloud({ x, y, size, opacity }) {
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: `${size}px`, height: `${size * 0.6}px`,
      background: `rgba(255,255,255,${opacity})`,
      borderRadius: "50px",
      filter: "blur(2px)",
      pointerEvents: "none",
    }} />
  );
}

export default function SpellingGame() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null); // index 0 or 1
  const [feedback, setFeedback] = useState(null); // "correct" | "wrong"
  const [done, setDone] = useState(false);
  const [circleAnim, setCircleAnim] = useState(false);

  useEffect(() => {
    const picked = shuffle(WORD_PAIRS).slice(0, TOTAL);
    // randomize which side correct word appears on
    setQuestions(picked.map(p => {
      const flip = Math.random() < 0.5;
      return flip
        ? { left: p.wrong, right: p.correct, correctSide: 1 }
        : { left: p.correct, right: p.wrong, correctSide: 0 };
    }));
  }, []);

  const q = questions[current];

  function handlePick(idx) {
    if (feedback || done) return;
    setSelected(idx);
    const isCorrect = idx === q.correctSide;
    setFeedback(isCorrect ? "correct" : "wrong");
    setCircleAnim(true);
    setTimeout(() => {
      if (isCorrect) setScore(s => s + 1);
      setCircleAnim(false);
      setTimeout(() => {
        setSelected(null);
        setFeedback(null);
        if (current + 1 >= TOTAL) {
          setDone(true);
        } else {
          setCurrent(c => c + 1);
        }
      }, 400);
    }, 900);
  }

  function restart() {
    const picked = shuffle(WORD_PAIRS).slice(0, TOTAL);
    setQuestions(picked.map(p => {
      const flip = Math.random() < 0.5;
      return flip
        ? { left: p.wrong, right: p.correct, correctSide: 1 }
        : { left: p.correct, right: p.wrong, correctSide: 0 };
    }));
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setFeedback(null);
    setDone(false);
  }

  const bgGradient = "linear-gradient(160deg, #ffd6e7 0%, #fff4b2 40%, #c3f4fc 100%)";

  return (
    <div style={{
      minHeight: "100vh",
      background: bgGradient,
      fontFamily: "'Fredoka One', 'Comic Sans MS', cursive",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;800&display=swap');
        @keyframes popIn {
          0% { transform: scale(0) rotate(-15deg); opacity: 0; }
          70% { transform: scale(1.3) rotate(5deg); }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        @keyframes wiggle {
          0%,100% { transform: rotate(0deg); }
          25% { transform: rotate(-8deg); }
          75% { transform: rotate(8deg); }
        }
        @keyframes correctPop {
          0% { transform: scale(1); }
          30% { transform: scale(1.12); }
          60% { transform: scale(0.96); }
          100% { transform: scale(1); }
        }
        @keyframes wrongShake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        @keyframes slideUp {
          from { opacity:0; transform: translateY(30px); }
          to   { opacity:1; transform: translateY(0); }
        }
        @keyframes floatCloud {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes bounceIn {
          0%   { transform: scale(0.5) rotate(-10deg); opacity: 0; }
          60%  { transform: scale(1.1) rotate(4deg); opacity: 1; }
          80%  { transform: scale(0.95) rotate(-2deg); }
          100% { transform: scale(1) rotate(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .word-btn {
          cursor: pointer;
          border: none;
          outline: none;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .word-btn:hover:not(:disabled) {
          transform: scale(1.06) translateY(-3px);
        }
        .word-btn:active:not(:disabled) {
          transform: scale(0.97);
        }
      `}</style>

      {/* Decorative clouds */}
      {[
        {x:5,y:8,size:90,op:0.6},{x:75,y:5,size:120,op:0.5},
        {x:40,y:3,size:70,op:0.4},{x:88,y:70,size:80,op:0.35},
        {x:2,y:75,size:100,op:0.4},
      ].map((c,i)=>(
        <div key={i} style={{ animation: `floatCloud ${3+i*0.7}s ease-in-out infinite`, position:"absolute", left:`${c.x}%`, top:`${c.y}%`, pointerEvents:"none" }}>
          <Cloud x={0} y={0} size={c.size} opacity={c.op} />
        </div>
      ))}

      {/* Decorative emoji scattered */}
      {["🐣","🌈","🦋","🌸","⭐"].map((em,i)=>(
        <div key={i} style={{
          position:"absolute",
          fontSize: `${22+i*4}px`,
          left: `${[8,85,12,80,50][i]}%`,
          top: `${[15,18,82,80,6][i]}%`,
          animation: `floatCloud ${2.5+i*0.5}s ease-in-out ${i*0.3}s infinite`,
          pointerEvents:"none",
          userSelect:"none",
        }}>{em}</div>
      ))}

      {/* Card */}
      <div style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        borderRadius: "32px",
        padding: "32px 28px 36px",
        maxWidth: "480px",
        width: "100%",
        boxShadow: "0 8px 40px rgba(255,150,180,0.25), 0 2px 12px rgba(0,0,0,0.08)",
        border: "3px solid rgba(255,255,255,0.9)",
        position: "relative",
        zIndex: 2,
        animation: "slideUp 0.5s ease both",
      }}>

        {/* Title */}
        <div style={{ textAlign:"center", marginBottom:"6px" }}>
          <span style={{
            fontSize:"32px", fontFamily:"'Fredoka One',cursive",
            color:"#e05faa",
            textShadow:"2px 3px 0 #ffd6e7",
            letterSpacing:"1px",
          }}>
            🔤 Spell Check!
          </span>
        </div>

        {!done ? (
          <>
            {/* Progress */}
            <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"20px", marginTop:"4px" }}>
              <div style={{
                flex:1, height:"12px", background:"#f0e6f8",
                borderRadius:"99px", overflow:"hidden",
              }}>
                <div style={{
                  height:"100%",
                  width:`${(current/TOTAL)*100}%`,
                  background:"linear-gradient(90deg, #ff8fd0, #ffca6b)",
                  borderRadius:"99px",
                  transition:"width 0.4s ease",
                }}/>
              </div>
              <span style={{ fontSize:"14px", color:"#b07fc4", fontFamily:"'Nunito',sans-serif", fontWeight:800, minWidth:"48px" }}>
                {current}/{TOTAL}
              </span>
            </div>

            {/* Instruction */}
            <div style={{
              textAlign:"center",
              fontSize:"18px",
              color:"#7c60b0",
              fontFamily:"'Nunito',sans-serif",
              fontWeight:700,
              marginBottom:"24px",
            }}>
              Circle the word that is <span style={{color:"#e05faa"}}>spelled correctly</span>! ✏️
            </div>

            {/* Word choices */}
            {q && (
              <div style={{ display:"flex", gap:"20px", justifyContent:"center", flexWrap:"wrap" }}>
                {[q.left, q.right].map((word, idx) => {
                  const isSelected = selected === idx;
                  const correctIdx = q.correctSide;
                  let borderColor = "#e8d5f5";
                  let bg = "linear-gradient(135deg, #fff8fe, #f5f0ff)";
                  let shadow = "0 4px 16px rgba(180,120,220,0.15)";
                  let animStyle = {};
                  let circleColor = "transparent";

                  if (isSelected && feedback === "correct") {
                    borderColor = "#4cde80";
                    bg = "linear-gradient(135deg, #edfff4, #d4ffe6)";
                    shadow = "0 6px 24px rgba(60,220,100,0.3)";
                    circleColor = "#4cde80";
                    animStyle = { animation: "correctPop 0.5s ease" };
                  } else if (isSelected && feedback === "wrong") {
                    borderColor = "#ff6b8a";
                    bg = "linear-gradient(135deg, #fff0f3, #ffe0e6)";
                    shadow = "0 6px 24px rgba(255,80,100,0.25)";
                    circleColor = "#ff6b8a";
                    animStyle = { animation: "wrongShake 0.4s ease" };
                  } else if (feedback === "wrong" && idx === correctIdx) {
                    // Highlight correct after wrong pick
                    borderColor = "#4cde80";
                    bg = "linear-gradient(135deg, #edfff4, #d4ffe6)";
                    circleColor = "#4cde80";
                  }

                  return (
                    <button
                      key={idx}
                      className="word-btn"
                      disabled={!!feedback}
                      onClick={() => handlePick(idx)}
                      style={{
                        ...animStyle,
                        width: "160px",
                        minHeight: "120px",
                        borderRadius: "24px",
                        border: `4px solid ${borderColor}`,
                        background: bg,
                        boxShadow: shadow,
                        display:"flex",
                        flexDirection:"column",
                        alignItems:"center",
                        justifyContent:"center",
                        gap:"12px",
                        padding:"16px 12px",
                        position:"relative",
                        overflow:"visible",
                      }}
                    >
                      {/* Circle outline (appears on selection) */}
                      {(isSelected || (feedback==="wrong" && idx===correctIdx)) && (
                        <div style={{
                          position:"absolute",
                          inset:"-6px",
                          borderRadius:"30px",
                          border:`4px solid ${circleColor}`,
                          boxShadow:`0 0 0 4px ${circleColor}33`,
                          pointerEvents:"none",
                          animation: isSelected ? "correctPop 0.4s ease" : "fadeIn 0.3s ease",
                        }}/>
                      )}

                      {/* Word */}
                      <span style={{
                        fontSize: word.length > 5 ? "28px" : "36px",
                        fontFamily:"'Fredoka One',cursive",
                        color: feedback && idx === correctIdx ? "#2db863" :
                               isSelected && feedback === "wrong" ? "#e04060" : "#5a3fa0",
                        letterSpacing:"2px",
                        textAlign:"center",
                        lineHeight:1.1,
                      }}>
                        {word}
                      </span>

                      {/* Feedback icon */}
                      {isSelected && feedback && (
                        <span style={{
                          fontSize:"28px",
                          animation:"popIn 0.3s ease both",
                        }}>
                          {feedback === "correct" ? "✅" : "❌"}
                        </span>
                      )}
                      {!isSelected && feedback === "wrong" && idx === correctIdx && (
                        <span style={{ fontSize:"22px", animation:"popIn 0.3s ease both" }}>👈</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Feedback message */}
            <div style={{
              textAlign:"center",
              marginTop:"24px",
              minHeight:"40px",
              fontSize:"22px",
              fontFamily:"'Fredoka One',cursive",
              color: feedback==="correct" ? "#2db863" : "#e04060",
              animation: feedback ? "popIn 0.3s ease" : "none",
            }}>
              {feedback === "correct" && "🎉 Great job!"}
              {feedback === "wrong" && "😅 Try again next time!"}
            </div>
          </>
        ) : (
          /* Done screen */
          <div style={{
            textAlign:"center",
            animation:"bounceIn 0.6s ease both",
            padding:"8px 0",
          }}>
            <div style={{ fontSize:"64px", animation:"wiggle 1s ease 0.5s 2" }}>
              {score >= 9 ? "🏆" : score >= 7 ? "🎉" : score >= 5 ? "🌟" : "🌈"}
            </div>
            <div style={{
              fontSize:"30px",
              fontFamily:"'Fredoka One',cursive",
              color:"#e05faa",
              textShadow:"2px 2px 0 #ffd6e7",
              margin:"8px 0 4px",
            }}>
              {score >= 9 ? "Amazing!" : score >= 7 ? "Great work!" : score >= 5 ? "Good try!" : "Keep practicing!"}
            </div>
            <div style={{
              fontSize:"20px",
              fontFamily:"'Nunito',sans-serif",
              fontWeight:800,
              color:"#9b6dce",
              marginBottom:"20px",
            }}>
              You got <span style={{color:"#e05faa",fontSize:"28px"}}>{score}</span> out of <span style={{color:"#5c8af5"}}>{TOTAL}</span>
            </div>

            <StarBurst count={score} />

            <div style={{ marginTop:"28px" }}>
              <button
                onClick={restart}
                style={{
                  background:"linear-gradient(135deg, #ff8fd0, #ffca6b)",
                  border:"none",
                  borderRadius:"99px",
                  padding:"14px 40px",
                  fontSize:"22px",
                  fontFamily:"'Fredoka One',cursive",
                  color:"white",
                  cursor:"pointer",
                  boxShadow:"0 4px 20px rgba(255,120,180,0.4)",
                  transition:"transform 0.15s ease, box-shadow 0.15s ease",
                  letterSpacing:"1px",
                }}
                onMouseEnter={e=>{ e.target.style.transform="scale(1.06)"; e.target.style.boxShadow="0 6px 28px rgba(255,120,180,0.55)"; }}
                onMouseLeave={e=>{ e.target.style.transform="scale(1)"; e.target.style.boxShadow="0 4px 20px rgba(255,120,180,0.4)"; }}
              >
                🔄 Play Again!
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Score badge (during game) */}
      {!done && (
        <div style={{
          marginTop:"20px",
          background:"rgba(255,255,255,0.8)",
          borderRadius:"99px",
          padding:"8px 24px",
          display:"flex",
          alignItems:"center",
          gap:"8px",
          boxShadow:"0 2px 12px rgba(180,120,220,0.15)",
          fontSize:"18px",
          fontFamily:"'Fredoka One',cursive",
          color:"#9b6dce",
          zIndex:2,
          animation:"slideUp 0.6s ease 0.2s both",
        }}>
          <span>⭐</span>
          <span>Score: <strong style={{color:"#e05faa"}}>{score}</strong></span>
        </div>
      )}
    </div>
  );
}

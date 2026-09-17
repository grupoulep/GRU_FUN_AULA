const fs = require('fs');
let code = fs.readFileSync('src/components/SubjectActivitiesView.tsx', 'utf8');

const targetStrStart = `      {/* EXAM MODAL: Interactive Exam Form for Student */}`;
const targetStrEnd = `      {/* READING MODAL: Rich Text Reading View with Emojis */}`;

const startIndex = code.indexOf(targetStrStart);
const endIndex = code.indexOf(targetStrEnd);

if (startIndex === -1 || endIndex === -1) {
    console.error("Target blocks not found!");
    process.exit(1);
}

const replacement = `      {/* EXAM MODAL: Interactive Exam Form for Student */}
      {activeExamActivity && (
        <div
          id="exam-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-rose-200 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700">
                  <ListChecks className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {activeExamActivity.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {subject.name} • Ponderación {activeExamActivity.weight}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {examState === 'in_progress' && (
                  <div className="px-3 py-1 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-bold font-mono">
                    ⏳ {Math.floor(examTimeLeftSeconds / 60)}:{(examTimeLeftSeconds % 60).toString().padStart(2, '0')}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setActiveExamActivity(null)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer p-1"
                >
                  ✕ Cerrar
                </button>
              </div>
            </div>

            {examState === 'intro' && (
              <div className="py-8 px-4 text-center space-y-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-lg text-slate-900">¿Desea realizar el examen ahora?</h4>
                <div className="max-w-xs mx-auto text-sm text-slate-600 space-y-2">
                  <p><strong>Tiempo límite:</strong> {activeExamActivity.examTimeLimitMinutes || 60} minutos</p>
                  <p><strong>Intentos:</strong> {activeExamActivity.examMaxAttempts || 1}</p>
                </div>
                <button
                  onClick={handleStartExam}
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-md transition-transform active:scale-95 mt-4"
                >
                  Empezar Examen
                </button>
              </div>
            )}

            {/* Score Banner if completed */}
            {examState === 'results' && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                      Examen Finalizado
                    </h4>
                    <p className="text-xs text-emerald-800">
                      Has obtenido una puntuación de{' '}
                      <strong>{activeExamActivity.examScore ?? 100}%</strong>
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-extrabold">
                  Completado
                </span>
              </div>
            )}

            {/* Questions list */}
            {(examState === 'in_progress' || examState === 'results') && (!activeExamActivity.examQuestions || activeExamActivity.examQuestions.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
                <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">
                  El docente aún no ha registrado preguntas para este examen.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-600 px-1">
                  <span>
                    Preguntas respondidas:{' '}
                    <strong className="text-slate-900">
                      {Object.keys(examSelectedAnswers).length} de {activeExamActivity.examQuestions.length}
                    </strong>
                  </span>
                </div>

                {activeExamActivity.examQuestions.map((question, qIdx) => {
                  const answer = examSelectedAnswers[question.id];
                  const hasAnswered = answer !== undefined;
                  
                  let isCorrect = false;
                  if (examState === 'results') {
                    if (question.type === 'multiple_choice' || question.type === 'true_false' || !question.type) {
                      isCorrect = answer === question.correctOptionIndex;
                    } else if (question.type === 'multiple_selection') {
                      const correct = question.correctOptionIndices || [];
                      const ans = Array.isArray(answer) ? answer : [];
                      isCorrect = correct.length === ans.length && correct.every(c => ans.includes(c));
                    } else if (question.type === 'drag_and_drop') {
                      const correctPairs = question.dragDropPairs || [];
                      const ansObj = answer || {};
                      let allCorrect = true;
                      for (const pair of correctPairs) {
                        if (ansObj[pair.item] !== pair.match) {
                          allCorrect = false;
                          break;
                        }
                      }
                      isCorrect = allCorrect && correctPairs.length > 0;
                    }
                  }

                  return (
                    <div
                      key={question.id}
                      className={\`p-4 rounded-xl border transition-all \${
                        examState === 'results'
                          ? isCorrect
                            ? 'bg-emerald-50/40 border-emerald-200'
                            : 'bg-rose-50/40 border-rose-200'
                          : 'bg-slate-50/70 border-slate-200'
                      }\`}
                    >
                      <div className="flex items-start gap-2 mb-3">
                        <span className="w-6 h-6 rounded-md bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {qIdx + 1}
                        </span>
                        <div className="flex-1">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                            {question.question}
                          </h4>
                        </div>
                      </div>

                      {/* Options rendering based on type */}
                      <div className="space-y-2 pl-8">
                        {(question.type === 'multiple_choice' || question.type === 'true_false' || !question.type) && (
                          question.options?.map((optText, optIdx) => {
                            const isOptionSelected = answer === optIdx;
                            const isOptionCorrect = optIdx === question.correctOptionIndex;
                            let optionStyle = 'bg-white border-slate-200 text-slate-800';

                            if (examState === 'results') {
                              if (isOptionCorrect) optionStyle = 'bg-emerald-100 border-emerald-400 font-bold';
                              else if (isOptionSelected) optionStyle = 'bg-rose-100 border-rose-400 line-through';
                            } else if (isOptionSelected) optionStyle = 'bg-blue-50 border-blue-500 font-bold';

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                disabled={examState === 'results'}
                                onClick={() => handleSelectExamAnswer(question.id, optIdx)}
                                className={\`w-full p-2.5 rounded-xl border text-xs text-left flex items-center gap-3 \${optionStyle}\`}
                              >
                                <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold">
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span className="flex-1">{optText}</span>
                                {examState === 'results' && isOptionCorrect && <Check className="w-4 h-4 text-emerald-700" />}
                              </button>
                            );
                          })
                        )}

                        {question.type === 'multiple_selection' && (
                          question.options?.map((optText, optIdx) => {
                            const selectedArr = Array.isArray(answer) ? answer : [];
                            const isOptionSelected = selectedArr.includes(optIdx);
                            const isOptionCorrect = (question.correctOptionIndices || []).includes(optIdx);
                            let optionStyle = 'bg-white border-slate-200 text-slate-800';

                            if (examState === 'results') {
                              if (isOptionCorrect) optionStyle = 'bg-emerald-100 border-emerald-400 font-bold';
                              else if (isOptionSelected) optionStyle = 'bg-rose-100 border-rose-400 line-through';
                            } else if (isOptionSelected) optionStyle = 'bg-blue-50 border-blue-500 font-bold';

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                disabled={examState === 'results'}
                                onClick={() => {
                                  if (examState === 'results') return;
                                  const newAns = isOptionSelected ? selectedArr.filter(x => x !== optIdx) : [...selectedArr, optIdx];
                                  handleSelectExamAnswer(question.id, newAns);
                                }}
                                className={\`w-full p-2.5 rounded-xl border text-xs text-left flex items-center gap-3 \${optionStyle}\`}
                              >
                                <input type="checkbox" checked={isOptionSelected} readOnly className="w-4 h-4 text-rose-600 pointer-events-none" />
                                <span className="flex-1">{optText}</span>
                                {examState === 'results' && isOptionCorrect && <Check className="w-4 h-4 text-emerald-700" />}
                              </button>
                            );
                          })
                        )}

                        {question.type === 'drag_and_drop' && (
                           <div className="space-y-2">
                             {question.dragDropPairs?.map((pair, pIdx) => {
                               const ansObj = answer || {};
                               const selectedMatch = ansObj[pair.item] || '';
                               const isPairCorrect = selectedMatch === pair.match;
                               const options = question.dragDropPairs?.map(p => p.match).sort() || [];
                               
                               return (
                                 <div key={pIdx} className="flex gap-2 items-center bg-white p-2 rounded-lg border border-slate-200">
                                   <span className="flex-1 text-xs font-bold text-slate-700">{pair.item}</span>
                                   <span className="text-slate-400 px-2">→</span>
                                   <select
                                     disabled={examState === 'results'}
                                     value={selectedMatch}
                                     onChange={(e) => {
                                       handleSelectExamAnswer(question.id, { ...ansObj, [pair.item]: e.target.value });
                                     }}
                                     className={\`flex-1 text-xs p-1.5 rounded-lg border \${examState === 'results' ? (isPairCorrect ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300') : 'bg-slate-50 border-slate-300'}\`}
                                   >
                                     <option value="">Seleccionar...</option>
                                     {options.map((opt, oIdx) => <option key={oIdx} value={opt}>{opt}</option>)}
                                   </select>
                                 </div>
                               );
                             })}
                           </div>
                        )}
                      </div>

                      {examState === 'results' && question.explanation && (
                        <div className="mt-3 ml-8 p-2.5 bg-white/80 border border-slate-200 rounded-lg text-[11px] text-slate-700">
                          <span className="font-bold text-slate-900">💡 Explicación: </span>
                          <span>{question.explanation}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Modal Footer */}
            {(examState === 'intro' || examState === 'in_progress' || examState === 'results') && (
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveExamActivity(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
              >
                Cerrar Ventana
              </button>

              {examState === 'in_progress' && (
                <button
                  type="button"
                  onClick={handleSubmitExam}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-transform active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar y Calificar Examen</span>
                </button>
              )}
            </div>
            )}
          </div>
        </div>
      )}

`;

const newCode = code.slice(0, startIndex) + replacement + code.slice(endIndex);
fs.writeFileSync('src/components/SubjectActivitiesView.tsx', newCode);
console.log("Exam modal rewritten!");

const fs = require('fs');
let code = fs.readFileSync('src/components/TeacherActivitiesManager.tsx', 'utf8');

const targetStr = `                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                          {q.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className={\`px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1.5 \${
                                oIdx === q.correctOptionIndex
                                  ? 'bg-blue-100 text-blue-900 font-bold border border-blue-300'
                                  : 'bg-slate-50 text-slate-700 border border-slate-200'
                              }\`}
                            >
                              <span className="font-mono font-bold">
                                {String.fromCharCode(65 + oIdx)}.
                              </span>
                              <span className="flex-1">{opt}</span>
                              {oIdx === q.correctOptionIndex && (
                                <Check className="w-3 h-3 text-blue-700 shrink-0" />
                              )}
                            </div>
                          ))}
                        </div>`;

const replacement = `                        <div className="pt-1">
                          {q.type === 'drag_and_drop' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {q.dragDropPairs?.map((pair, pIdx) => (
                                <div key={pIdx} className="flex gap-2 items-center bg-slate-50 px-2.5 py-1 rounded-lg text-[11px] border border-slate-200">
                                  <span className="font-bold text-slate-700">{pair.item}</span>
                                  <span className="text-slate-400">→</span>
                                  <span className="text-blue-700 font-medium">{pair.match}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                              {q.options?.map((opt, oIdx) => {
                                const isCorrect = q.type === 'multiple_selection' 
                                  ? q.correctOptionIndices?.includes(oIdx)
                                  : oIdx === q.correctOptionIndex;
                                return (
                                  <div
                                    key={oIdx}
                                    className={\`px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1.5 \${
                                      isCorrect
                                        ? 'bg-blue-100 text-blue-900 font-bold border border-blue-300'
                                        : 'bg-slate-50 text-slate-700 border border-slate-200'
                                    }\`}
                                  >
                                    <span className="font-mono font-bold">
                                      {String.fromCharCode(65 + oIdx)}.
                                    </span>
                                    <span className="flex-1">{opt}</span>
                                    {isCorrect && (
                                      <Check className="w-3 h-3 text-blue-700 shrink-0" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>`;

if (!code.includes(targetStr)) {
  console.log("Target display string not found!");
} else {
  code = code.replace(targetStr, replacement);
  fs.writeFileSync('src/components/TeacherActivitiesManager.tsx', code);
  console.log("Display replaced successfully!");
}

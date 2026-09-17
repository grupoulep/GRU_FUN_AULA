const fs = require('fs');
let code = fs.readFileSync('src/components/TeacherActivitiesManager.tsx', 'utf8');

const targetStr = `                      <span className="text-xs font-bold text-slate-800">
                        Nueva Pregunta de Opción Múltiple
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Selecciona el radio button de la respuesta correcta
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Enunciado de la Pregunta *
                      </label>
                      <input
                        type="text"
                        value={newQText}
                        onChange={(e) => setNewQText(e.target.value)}
                        placeholder="Ej: ¿Cuál es el resultado de calcular el límite lim(x->0)...?"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-600 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[11px] font-semibold text-slate-700">
                        Opciones de Respuesta (Marca la opción correcta):
                      </label>

                      {[
                        { val: newOpt0, set: setNewOpt0, idx: 0, label: 'A' },
                        { val: newOpt1, set: setNewOpt1, idx: 1, label: 'B' },
                        { val: newOpt2, set: setNewOpt2, idx: 2, label: 'C (Opcional)' },
                        { val: newOpt3, set: setNewOpt3, idx: 3, label: 'D (Opcional)' }
                      ].map((opt) => (
                        <div key={opt.idx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="correct-option-radio"
                            checked={newCorrectIdx === opt.idx}
                            onChange={() => setNewCorrectIdx(opt.idx)}
                            className="w-4 h-4 text-rose-600 focus:ring-rose-500 cursor-pointer"
                            title={\`Marcar opción \${opt.label} como correcta\`}
                          />
                          <span className="font-bold text-xs text-slate-700 w-5">
                            {opt.label[0]}:
                          </span>
                          <input
                            type="text"
                            value={opt.val}
                            onChange={(e) => opt.set(e.target.value)}
                            placeholder={\`Texto de la opción \${opt.label}\`}
                            className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-600 focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>`;

const replacement = `                      <select
                        value={newQType}
                        onChange={(e) => setNewQType(e.target.value as QuestionType)}
                        className="text-xs font-bold text-slate-800 bg-transparent outline-none border-b border-rose-300"
                      >
                        <option value="multiple_choice">Opción Múltiple</option>
                        <option value="multiple_selection">Selección Múltiple</option>
                        <option value="true_false">Falso/Verdadero</option>
                        <option value="drag_and_drop">Arrastrar y Soltar</option>
                      </select>
                      <span className="text-[10px] text-slate-500">
                        Configura las respuestas
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Enunciado de la Pregunta *
                      </label>
                      <input
                        type="text"
                        value={newQText}
                        onChange={(e) => setNewQText(e.target.value)}
                        placeholder="Ej: ¿Cuál es el resultado de calcular el límite lim(x->0)...?"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-600 focus:outline-none"
                      />
                    </div>

                    {(newQType === 'multiple_choice' || newQType === 'multiple_selection') && (
                      <div className="space-y-2">
                        <label className="block text-[11px] font-semibold text-slate-700">
                          Opciones de Respuesta (Marca la/las correctas):
                        </label>
                        {[
                          { val: newOpt0, set: setNewOpt0, idx: 0, label: 'A' },
                          { val: newOpt1, set: setNewOpt1, idx: 1, label: 'B' },
                          { val: newOpt2, set: setNewOpt2, idx: 2, label: 'C (Opcional)' },
                          { val: newOpt3, set: setNewOpt3, idx: 3, label: 'D (Opcional)' }
                        ].map((opt) => (
                          <div key={opt.idx} className="flex items-center gap-2">
                            <input
                              type={newQType === 'multiple_choice' ? 'radio' : 'checkbox'}
                              name={newQType === 'multiple_choice' ? 'correct-option-radio' : \`correct-option-checkbox-\${opt.idx}\`}
                              checked={newQType === 'multiple_choice' ? newCorrectIdx === opt.idx : newCorrectIndices.includes(opt.idx)}
                              onChange={() => {
                                if (newQType === 'multiple_choice') {
                                  setNewCorrectIdx(opt.idx);
                                } else {
                                  setNewCorrectIndices((prev) => 
                                    prev.includes(opt.idx) ? prev.filter((i) => i !== opt.idx) : [...prev, opt.idx]
                                  );
                                }
                              }}
                              className="w-4 h-4 text-rose-600 focus:ring-rose-500 cursor-pointer"
                            />
                            <span className="font-bold text-xs text-slate-700 w-5">
                              {opt.label[0]}:
                            </span>
                            <input
                              type="text"
                              value={opt.val}
                              onChange={(e) => opt.set(e.target.value)}
                              placeholder={\`Texto de la opción \${opt.label}\`}
                              className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-600 focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {newQType === 'true_false' && (
                      <div className="space-y-2">
                        <label className="block text-[11px] font-semibold text-slate-700">
                          Respuesta correcta:
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 text-xs text-slate-800">
                            <input type="radio" checked={newCorrectIdx === 0} onChange={() => setNewCorrectIdx(0)} className="w-4 h-4 text-rose-600" />
                            Verdadero
                          </label>
                          <label className="flex items-center gap-2 text-xs text-slate-800">
                            <input type="radio" checked={newCorrectIdx === 1} onChange={() => setNewCorrectIdx(1)} className="w-4 h-4 text-rose-600" />
                            Falso
                          </label>
                        </div>
                      </div>
                    )}

                    {newQType === 'drag_and_drop' && (
                      <div className="space-y-2">
                        <label className="block text-[11px] font-semibold text-slate-700">
                          Pares a relacionar (Concepto - Definición):
                        </label>
                        {newDragDropPairs.map((pair, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={pair.item}
                              onChange={(e) => {
                                const newPairs = [...newDragDropPairs];
                                newPairs[idx].item = e.target.value;
                                setNewDragDropPairs(newPairs);
                              }}
                              placeholder="Concepto (arrastrable)"
                              className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                            />
                            <span className="text-slate-400">-</span>
                            <input
                              type="text"
                              value={pair.match}
                              onChange={(e) => {
                                const newPairs = [...newDragDropPairs];
                                newPairs[idx].match = e.target.value;
                                setNewDragDropPairs(newPairs);
                              }}
                              placeholder="Definición (destino)"
                              className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newPairs = newDragDropPairs.filter((_, i) => i !== idx);
                                setNewDragDropPairs(newPairs.length ? newPairs : [{item:'', match:''}]);
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setNewDragDropPairs([...newDragDropPairs, {item: '', match: ''}])}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          + Añadir par
                        </button>
                      </div>
                    )}`;

if (!code.includes(targetStr)) {
  console.log("Target string not found!");
} else {
  code = code.replace(targetStr, replacement);
  fs.writeFileSync('src/components/TeacherActivitiesManager.tsx', code);
  console.log("Replaced successfully!");
}

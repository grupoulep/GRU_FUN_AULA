const fs = require('fs');
let code = fs.readFileSync('src/components/StudentPortal.tsx', 'utf8');

// 1. Remove schedule tab button
code = code.replace(/<button\s+id="tab-schedule"[\s\S]+?<\/button>/, '');

// 2. Remove schedule and mockGrades data
code = code.replace(/const mockGrades = \[[\s\S]+?\];/g, '');
code = code.replace(/const schedule = \[[\s\S]+?\];/g, '');

// 3. Update Grades tab content and remove schedule
const oldGradesString = `        {/* Tab 2: Grades */}
        {activeTab === 'grades' && (
          <div id="student-grades-table-card" className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                    <th className="py-2.5 px-3 font-semibold">Código</th>
                    <th className="py-2.5 px-3 font-semibold">Materia</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Corte 1 (30%)</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Corte 2 (30%)</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Corte 3 (40%)</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Definitiva</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockGrades.map((g) => (
                    <tr key={g.code} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-mono font-medium text-slate-700">{g.code}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{g.name}</td>
                      <td className="py-3 px-3 text-center">{g.corte1.toFixed(1)}</td>
                      <td className="py-3 px-3 text-center">{g.corte2.toFixed(1)}</td>
                      <td className="py-3 px-3 text-center">{g.corte3.toFixed(1)}</td>
                      <td className="py-3 px-3 text-center font-bold text-blue-700">{g.final.toFixed(1)}</td>
                      <td className="py-3 px-3 text-right">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[10px] border border-emerald-200">
                          {g.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Schedule */}
        {activeTab === 'schedule' && (
          <div id="student-schedule-card" className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="divide-y divide-slate-100">
              {schedule.map((item, index) => (
                <div key={index} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-24 text-xs font-bold text-slate-900 bg-slate-100 py-1 px-2.5 rounded-lg text-center">
                      {item.day}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">{item.subject}</h4>
                      <p className="text-xs text-slate-500">{item.classroom}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}`;

const newGradesHTML = `{/* Tab 2: Grades */}
        {activeTab === 'grades' && (
          <div id="student-grades-table-card" className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-700" />
                Historial de Calificaciones
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Consulta el detalle de tus evaluaciones: de qué asignatura son, cuándo se realizaron, el tipo de evaluación y la calificación obtenida.
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-slate-500 bg-slate-50 uppercase text-xs tracking-wider">
                    <th className="py-3 px-4 font-semibold rounded-tl-lg">Asignatura (De qué)</th>
                    <th className="py-3 px-4 font-semibold">Actividad (Qué)</th>
                    <th className="py-3 px-4 font-semibold">Tipo (Cómo)</th>
                    <th className="py-3 px-4 font-semibold">Fecha (Cuándo)</th>
                    <th className="py-3 px-4 font-semibold text-center">Peso</th>
                    <th className="py-3 px-4 font-semibold text-right rounded-tr-lg">Calificación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activities
                    .filter(a => a.status === 'Calificada' || a.grade !== undefined || (a.type === 'Examen' && a.examCompleted && a.examScore !== undefined))
                    .filter(a => mySubjects.some(s => s.id === a.subjectId))
                    .sort((a, b) => new Date(b.submittedAt || b.dueDate).getTime() - new Date(a.submittedAt || a.dueDate).getTime())
                    .map((g) => {
                      const subject = mySubjects.find(s => s.id === g.subjectId);
                      const finalGrade = g.type === 'Examen' && g.examScore !== undefined ? (g.examScore / 100) * 5 : g.grade;
                      
                      return (
                        <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-900">{subject?.name || 'Materia desconocida'}</span>
                              <span className="text-xs font-mono text-slate-500">{subject?.code}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium text-slate-800 line-clamp-2" title={g.title}>{g.title}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
                              {g.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                            {g.submittedAt ? new Date(g.submittedAt).toLocaleDateString() : 'Sin fecha'}
                          </td>
                          <td className="py-3 px-4 text-center font-medium text-slate-600">
                            {g.weight}%
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="inline-flex items-center justify-center min-w-[3rem] px-2.5 py-1 rounded-lg font-bold text-sm bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {finalGrade?.toFixed(1) || 'N/A'}
                            </span>
                          </td>
                        </tr>
                      );
                  })}
                  {activities.filter(a => a.status === 'Calificada' || a.grade !== undefined || (a.type === 'Examen' && a.examCompleted && a.examScore !== undefined)).filter(a => mySubjects.some(s => s.id === a.subjectId)).length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        <Award className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm font-medium">Aún no tienes calificaciones registradas.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}`;

code = code.replace(oldGradesString, newGradesHTML);

fs.writeFileSync('src/components/StudentPortal.tsx', code);

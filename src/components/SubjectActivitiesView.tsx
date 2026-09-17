import React, { useState } from 'react';
import { Subject, Activity, ExamQuestion } from '../types';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  AlertCircle,
  UploadCloud,
  Send,
  Sparkles,
  BookOpen,
  ExternalLink,
  Link as LinkIcon,
  ListChecks,
  Award,
  Check,
  HelpCircle,
  RotateCcw,
  Eye,
  Smile
} from 'lucide-react';

interface SubjectActivitiesViewProps {
  subject: Subject;
  activities: Activity[];
  onBack: () => void;
  onSubmitActivity: (activityId: string, notes: string) => void;
  onUpdateActivity?: (act: Activity) => void;
}

export const SubjectActivitiesView: React.FC<SubjectActivitiesViewProps> = ({
  subject,
  activities,
  onBack,
  onSubmitActivity,
  onUpdateActivity
}) => {
  // Sort activities from top to bottom by order
  const sortedActivities = [...activities]
    .filter((a) => a.subjectId === subject.id)
    .sort((a, b) => a.order - b.order);

  // Submission Modal state
  const [submittingActId, setSubmittingActId] = useState<string | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [fileName, setFileName] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Exam Form Modal state
  const [activeExamActivity, setActiveExamActivity] = useState<Activity | null>(null);
  const [examSelectedAnswers, setExamSelectedAnswers] = useState<Record<string, number>>({});
  const [showExamResults, setShowExamResults] = useState(false);
  const [examState, setExamState] = useState<'intro' | 'in_progress' | 'results'>('intro');
  const [examTimeLeftSeconds, setExamTimeLeftSeconds] = useState<number>(0);

  // Reading Viewer Modal state
  const [activeReadingActivity, setActiveReadingActivity] = useState<Activity | null>(null);

  const completedCount = sortedActivities.filter((a) => a.status === 'Entregada').length;
  const totalWeight = sortedActivities.reduce((acc, a) => acc + (a.weight || 0), 0);

  const handleStartSubmit = (activity: Activity) => {
    setSubmittingActId(activity.id);
    setSubmissionNotes(activity.submissionNotes || '');
    setFileName('');
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingActId) return;

    onSubmitActivity(
      submittingActId,
      submissionNotes.trim() || (fileName ? `Archivo adjunto: ${fileName}` : 'Entrega registrada en plataforma')
    );

    setSuccessToast('¡Actividad entregada correctamente!');
    setTimeout(() => setSuccessToast(''), 4000);
    setSubmittingActId(null);
    setSubmissionNotes('');
    setFileName('');
  };

  // Exam Handlers
  const handleOpenExam = (activity: Activity) => {
    setActiveExamActivity(activity);
    const initialAnswers: Record<string, any> = activity.studentAnswers
      ? { ...activity.studentAnswers }
      : {};
    setExamSelectedAnswers(initialAnswers);
    if (activity.examCompleted) {
      setExamState('results');
      setShowExamResults(true);
    } else {
      setExamState('intro');
      setShowExamResults(false);
      if (activity.examTimeLimitMinutes) {
        setExamTimeLeftSeconds(activity.examTimeLimitMinutes * 60);
      } else {
        setExamTimeLeftSeconds(3600); // Default 60 mins if not set
      }
    }
  };

  const handleStartExam = () => {
    setExamState('in_progress');
  };

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (examState === 'in_progress' && examTimeLeftSeconds > 0) {
      timer = setInterval(() => {
        setExamTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examState, examTimeLeftSeconds]);

  const handleSelectExamAnswer = (questionId: string, answer: any) => {
    if (showExamResults || examState !== 'in_progress') return;
    setExamSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitExam = () => {
    if (!activeExamActivity || !activeExamActivity.examQuestions) return;

    const questions = activeExamActivity.examQuestions;
    const answeredCount = Object.keys(examSelectedAnswers).length;

    if (examTimeLeftSeconds > 0 && answeredCount < questions.length) {
      const confirmIncomplete = window.confirm(
        `Has respondido ${answeredCount} de ${questions.length} preguntas. ¿Deseas enviar el examen de todos modos?`
      );
      if (!confirmIncomplete) return;
    }

    setExamState('results');
    
    // Calculate score
    let correctCount = 0;
    questions.forEach((q) => {
      const answer = examSelectedAnswers[q.id];
      if (q.type === 'multiple_choice' || q.type === 'true_false' || !q.type) {
        if (answer === q.correctOptionIndex) correctCount++;
      } else if (q.type === 'multiple_selection') {
        const correct = q.correctOptionIndices || [];
        const ans = Array.isArray(answer) ? answer : [];
        if (correct.length === ans.length && correct.every(c => ans.includes(c))) correctCount++;
      } else if (q.type === 'drag_and_drop') {
        const correctPairs = q.dragDropPairs || [];
        const ansObj = answer || {};
        let allCorrect = true;
        for (const pair of correctPairs) {
          if (ansObj[pair.item] !== pair.match) {
            allCorrect = false;
            break;
          }
        }
        if (allCorrect && correctPairs.length > 0) correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);
    const scoreGrade = parseFloat(((scorePercentage / 100) * 5.0).toFixed(1)); // Escala 0 a 5.0

    const updatedActivity: Activity = {
      ...activeExamActivity,
      status: 'Entregada',
      submittedAt: new Date().toISOString(),
      examCompleted: true,
      examScore: scorePercentage,
      grade: scoreGrade,
      studentAnswers: { ...examSelectedAnswers },
      submissionNotes: `Examen resuelto online con puntuación de ${scorePercentage}% (${correctCount}/${questions.length} aciertos)`
    };

    if (onUpdateActivity) {
      onUpdateActivity(updatedActivity);
    }
    onSubmitActivity(
      activeExamActivity.id,
      `Examen completado: ${scorePercentage}% (${correctCount}/${questions.length} correctas)`
    );

    setShowExamResults(true);
    setActiveExamActivity(updatedActivity);
    setSuccessToast(`¡Examen completado con éxito! Calificación: ${scorePercentage}%`);
    setTimeout(() => setSuccessToast(''), 4500);
  };

  // Reading Handlers
  const handleOpenReading = (activity: Activity) => {
    setActiveReadingActivity(activity);
  };

  const handleCompleteReading = (activity: Activity) => {
    onSubmitActivity(
      activity.id,
      `Lectura completada y asimilada (${activity.readingEstimatedMinutes || 5} min estimados)`
    );
    setSuccessToast('¡Lectura registrada como completada!');
    setTimeout(() => setSuccessToast(''), 4000);
    setActiveReadingActivity(null);
  };

  return (
    <div id="subject-activities-portal" className="space-y-6">
      {/* Navigation bar & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          id="btn-back-to-subjects"
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 bg-blue-50/80 hover:bg-blue-100/80 px-3.5 py-2 rounded-xl transition-all w-fit cursor-pointer border border-blue-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Mis Asignaturas</span>
        </button>

        <div className="text-xs text-slate-500 font-medium">
          Asignatura: <strong className="text-slate-800">{subject.name}</strong>
        </div>
      </div>

      {/* Header Banner */}
      <section
        id="activities-header-banner"
        className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              {subject.code}
            </span>
            <span className="text-xs text-slate-500">Prof. {subject.professor}</span>
          </div>
          <h2 id="activity-subject-title" className="text-xl font-bold text-slate-900 tracking-tight">
            Portal de Actividades: {subject.name}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Gestiona tus talleres con redirección directa, resuelve exámenes interactivos y accede a lecturas enriquecidas con emojis.
          </p>
        </div>

        {/* Status metrics */}
        <div className="flex items-center gap-3 self-start md:self-auto bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="text-center px-3 border-r border-slate-200">
            <div className="text-xs text-slate-500 font-medium">Actividades</div>
            <div className="text-lg font-bold text-slate-900">{sortedActivities.length}</div>
          </div>
          <div className="text-center px-3 border-r border-slate-200">
            <div className="text-xs text-slate-500 font-medium">Entregadas</div>
            <div className="text-lg font-bold text-emerald-600">
              {completedCount} / {sortedActivities.length}
            </div>
          </div>
          <div className="text-center px-3">
            <div className="text-xs text-slate-500 font-medium">Ponderación</div>
            <div className="text-lg font-bold text-blue-700">{totalWeight}%</div>
          </div>
        </div>
      </section>

      {/* Success Notification */}
      {successToast && (
        <div
          id="activity-success-toast"
          role="status"
          className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Activities List - Strictly Ordered From Top to Bottom */}
      <section id="activities-ordered-list-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Plan de Actividades Evaluativas (Ordenadas Cronológicamente)</span>
          </h3>
          <span className="text-xs text-slate-400">De arriba hacia abajo</span>
        </div>

        {sortedActivities.length === 0 ? (
          <div
            id="empty-activities-state"
            className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500"
          >
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="font-semibold text-slate-800 text-sm">
              No hay actividades programadas aún para esta asignatura.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              El docente asignará las tareas y talleres próximamente en su panel.
            </p>
          </div>
        ) : (
          <div id="activities-vertical-container" className="space-y-3.5">
            {sortedActivities.map((act, idx) => {
              const isSubmitted = act.status === 'Entregada';

              return (
                <div
                  key={act.id}
                  id={`activity-item-${act.id}`}
                  className={`bg-white border rounded-2xl p-5 shadow-xs transition-all flex flex-col md:flex-row md:items-start justify-between gap-4 ${
                    isSubmitted
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Left: Sequence & Info */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    {/* Activity Number Indicator */}
                    <div
                      id={`activity-number-badge-${act.id}`}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSubmitted
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-blue-600 text-white shadow-xs'
                      }`}
                      title={`Actividad número ${idx + 1}`}
                    >
                      {idx + 1}
                    </div>

                    <div className="space-y-3 flex-1 min-w-0">
                      {/* Cabecera de la Actividad: Badges y Título */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            act.type === 'Examen'
                              ? 'bg-rose-100 text-rose-700'
                              : act.type === 'Proyecto'
                              ? 'bg-purple-100 text-purple-700'
                              : act.type === 'Taller'
                              ? 'bg-amber-100 text-amber-700'
                              : act.type === 'Lectura'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {act.type} • {act.weight}%
                        </span>

                        {isSubmitted ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Entregada</span>
                            {act.examCompleted && act.examScore !== undefined && (
                              <span className="ml-1">({act.examScore}%)</span>
                            )}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[10px] font-bold">
                            <Clock className="w-3 h-3" />
                            <span>Pendiente</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-[10px] text-slate-500 font-medium ml-auto">
                          <Calendar className="w-3 h-3" />
                          <span>{act.dueDate}</span>
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                          {act.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                          {act.description}
                        </p>
                      </div>

                      {isSubmitted && act.submissionNotes && (
                        <div className="mt-2 p-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-600">
                          <span className="font-semibold text-slate-700">Nota: </span>
                          <span>{act.submissionNotes}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Unified Action Button */}
                  <div className="shrink-0 flex items-center md:self-center pt-2 md:pt-0">
                    {act.type === 'Examen' ? (
                      <button
                        type="button"
                        onClick={() => handleOpenExam(act)}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer shadow-sm hover:shadow-md ${
                          act.examCompleted
                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            : 'bg-rose-600 text-white hover:bg-rose-700'
                        }`}
                      >
                        <ListChecks className="w-4 h-4" />
                        <span>{act.examCompleted ? 'RESULTADOS' : 'REALIZAR EXAMEN'}</span>
                      </button>
                    ) : (
                      act.resourceLink ? (
                        <a
                          href={act.resourceLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase transition-all cursor-pointer shadow-sm hover:shadow-md"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>VISUALIZAR</span>
                        </a>
                      ) : null
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Submission Modal */}
      {submittingActId && (
        <div
          id="submission-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-blue-600" />
                <span>Formulario de Entrega de Actividad</span>
              </h3>
              <button
                type="button"
                onClick={() => setSubmittingActId(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                ✕ Cerrar
              </button>
            </div>

            <form onSubmit={handleConfirmSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Archivo de la Actividad (Opcional o documento elaborado)
                </label>
                <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50">
                  <input
                    type="file"
                    id="file-upload-input"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFileName(e.target.files[0].name);
                      }
                    }}
                  />
                  <label htmlFor="file-upload-input" className="cursor-pointer block">
                    <FileText className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                    <span className="text-xs font-medium text-blue-600 hover:underline">
                      {fileName ? `Archivo seleccionado: ${fileName}` : 'Haz clic para seleccionar tu archivo PDF/Word/ZIP'}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Límite hasta 25 MB</p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Comentarios, Enlaces Externos o Justificación
                </label>
                <textarea
                  rows={3}
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder="Escriba aquí los detalles de la entrega, enlace a repositorio o dudas..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSubmittingActId(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  id="btn-confirm-submit-activity"
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Confirmar y Enviar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXAM MODAL: Interactive Exam Form for Student */}
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
                      className={`p-4 rounded-xl border transition-all ${
                        examState === 'results'
                          ? isCorrect
                            ? 'bg-emerald-50/40 border-emerald-200'
                            : 'bg-rose-50/40 border-rose-200'
                          : 'bg-slate-50/70 border-slate-200'
                      }`}
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
                                className={`w-full p-2.5 rounded-xl border text-xs text-left flex items-center gap-3 ${optionStyle}`}
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
                                className={`w-full p-2.5 rounded-xl border text-xs text-left flex items-center gap-3 ${optionStyle}`}
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
                                     className={`flex-1 text-xs p-1.5 rounded-lg border ${examState === 'results' ? (isPairCorrect ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300') : 'bg-slate-50 border-slate-300'}`}
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

      {/* READING MODAL: Rich Text Reading View with Emojis */}
      {activeReadingActivity && (
        <div
          id="reading-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-purple-200 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
                    Lectura Didáctica • ~{activeReadingActivity.readingEstimatedMinutes || 5} min
                  </span>
                  <h3 className="font-bold text-slate-900 text-lg">
                    {activeReadingActivity.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveReadingActivity(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer p-1"
              >
                ✕ Cerrar
              </button>
            </div>

            {/* Reading Content Box with Emojis and Typography */}
            <div className="p-6 bg-purple-50/40 border border-purple-200 rounded-2xl text-slate-800 text-sm leading-relaxed whitespace-pre-line font-sans space-y-3">
              {activeReadingActivity.readingContent || activeReadingActivity.description}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveReadingActivity(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
              >
                Cerrar Lectura
              </button>

              <button
                id="btn-mark-reading-completed"
                type="button"
                onClick={() => handleCompleteReading(activeReadingActivity)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-transform active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Marcar Lectura como Completada ✨</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

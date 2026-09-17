import React, { useState } from 'react';
import { Subject, Activity, ActivityType, ExamQuestion, QuestionType, DragDropMatch } from '../types';
import { ArrowLeft, 
  Plus,
  Edit2,
  Trash2,
  Calendar,
  BookOpen,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  AlertTriangle,
  UserCheck,
  GraduationCap,
  Save,
  X,
  Settings2,
  Hash,
  ExternalLink,
  Link as LinkIcon,
  FileText,
  HelpCircle,
  Smile,
  ListChecks,
  Check
} from 'lucide-react';

interface TeacherActivitiesManagerProps {
  subjects: Subject[];
  activities: Activity[];
  selectedSubjectId: string;
  onSelectSubjectId: (id: string) => void;
  onAddActivity: (act: Omit<Activity, 'id'>) => void;
  onUpdateActivity: (act: Activity) => void;
  onDeleteActivity: (id: string) => void;
  onUpdateSubject?: (subject: Subject) => void;
  onBack?: () => void;
}

export const TeacherActivitiesManager: React.FC<TeacherActivitiesManagerProps> = ({
  subjects,
  activities,
  selectedSubjectId,
  onSelectSubjectId,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
  onUpdateSubject,
  onBack
}) => {
  const currentSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  // Activities for current subject, ordered top to bottom
  const subjectActivities = activities
    .filter((a) => a.subjectId === currentSubject?.id)
    .sort((a, b) => a.order - b.order);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [weight, setWeight] = useState(20);
  const [type, setType] = useState<ActivityType>('Tarea');
  const [toastMessage, setToastMessage] = useState('');

  // Specific states for Taller / Tarea (Link)
  const [resourceLink, setResourceLink] = useState('');

  // Specific states for Examen (Questions Builder)
  const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>([]);
  const [showQuestionCreator, setShowQuestionCreator] = useState(false);
  const [newQText, setNewQText] = useState('');
  const [newOpt0, setNewOpt0] = useState('');
  const [newOpt1, setNewOpt1] = useState('');
  const [newOpt2, setNewOpt2] = useState('');
  const [newOpt3, setNewOpt3] = useState('');
  const [newCorrectIdx, setNewCorrectIdx] = useState(0);
  const [newExplanation, setNewExplanation] = useState('');
  const [newQType, setNewQType] = useState<QuestionType>('multiple_choice');
  const [newCorrectIndices, setNewCorrectIndices] = useState<number[]>([]);
  const [newDragDropPairs, setNewDragDropPairs] = useState<DragDropMatch[]>([{item: '', match: ''}]);
  const [examTimeLimitMinutes, setExamTimeLimitMinutes] = useState(60);
  const [examMaxAttempts, setExamMaxAttempts] = useState(1);

  // Specific states for Lectura (Rich Text & Emojis)
  const [readingContent, setReadingContent] = useState('');
  const [readingEstimatedMinutes, setReadingEstimatedMinutes] = useState(10);

  // Subject Edit Form states
  const [isEditingSubject, setIsEditingSubject] = useState(false);
  const [editSubjectCode, setEditSubjectCode] = useState('');
  const [editSubjectName, setEditSubjectName] = useState('');
  const [editSubjectCredits, setEditSubjectCredits] = useState<number>(3);
  const [editSubjectWeeklyHours, setEditSubjectWeeklyHours] = useState<number>(4);
  const [editSubjectProfessor, setEditSubjectProfessor] = useState('');
  const [editSubjectCourseName, setEditSubjectCourseName] = useState('');

  const handleStartEditSubject = () => {
    if (!currentSubject) return;
    setEditSubjectCode(currentSubject.code);
    setEditSubjectName(currentSubject.name);
    setEditSubjectCredits(currentSubject.credits);
    setEditSubjectWeeklyHours(currentSubject.weeklyHours);
    setEditSubjectProfessor(currentSubject.professor);
    setEditSubjectCourseName(currentSubject.courseName);
    setIsEditingSubject(true);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSubject) return;
    if (!editSubjectCode.trim() || !editSubjectName.trim()) {
      return;
    }

    const updated: Subject = {
      ...currentSubject,
      code: editSubjectCode.trim().toUpperCase(),
      name: editSubjectName.trim(),
      credits: Number(editSubjectCredits) || 1,
      weeklyHours: Number(editSubjectWeeklyHours) || 1,
      professor: editSubjectProfessor.trim() || currentSubject.professor,
      courseName: editSubjectCourseName.trim() || currentSubject.courseName
    };

    if (onUpdateSubject) {
      onUpdateSubject(updated);
    }
    setIsEditingSubject(false);
    setToastMessage(`¡Asignatura ${updated.code} - ${updated.name} actualizada correctamente!`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setWeight(20);
    setType('Tarea');
    setResourceLink('');
    setExamQuestions([]);
    setShowQuestionCreator(false);
    setNewQText('');
    setNewOpt0('');
    setNewOpt1('');
    setNewOpt2('');
    setNewOpt3('');
    setNewCorrectIdx(0);
    setNewExplanation('');
    setReadingContent('');
    setReadingEstimatedMinutes(10);
    setShowAddForm(false);
    setEditingActivity(null);
  };

  const handleStartEdit = (act: Activity) => {
    setEditingActivity(act);
    setTitle(act.title);
    setDescription(act.description);
    setDueDate(act.dueDate);
    setWeight(act.weight);
    setType(act.type);
    setResourceLink(act.resourceLink || '');
    setExamQuestions(act.examQuestions || []);
    setReadingContent(act.readingContent || '');
    setReadingEstimatedMinutes(act.readingEstimatedMinutes || 10);
    setShowQuestionCreator(false);
    setShowAddForm(true);
  };

  const handleAddQuestion = () => {
    if (!newQText.trim()) {
      alert('Por favor ingrese el enunciado de la pregunta.');
      return;
    }

    if (newQType === 'multiple_choice' || newQType === 'multiple_selection') {
      if (!newOpt0.trim() || !newOpt1.trim()) {
        alert('Por favor ingrese al menos dos opciones (A y B).');
        return;
      }
    }

    if (newQType === 'drag_and_drop') {
      if (newDragDropPairs.length < 2) {
        alert('Por favor ingrese al menos dos pares para arrastrar y soltar.');
        return;
      }
    }

    const options = [newOpt0.trim(), newOpt1.trim()];
    if (newOpt2.trim()) options.push(newOpt2.trim());
    if (newOpt3.trim()) options.push(newOpt3.trim());

    let questionObj: ExamQuestion = {
      id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: newQType,
      question: newQText.trim(),
      explanation: newExplanation.trim() || undefined
    };

    if (newQType === 'multiple_choice') {
      const safeCorrectIdx = Math.min(newCorrectIdx, options.length - 1);
      questionObj.options = options;
      questionObj.correctOptionIndex = safeCorrectIdx;
    } else if (newQType === 'multiple_selection') {
      questionObj.options = options;
      questionObj.correctOptionIndices = newCorrectIndices.length > 0 ? newCorrectIndices : [0];
    } else if (newQType === 'true_false') {
      questionObj.options = ['Verdadero', 'Falso'];
      questionObj.correctOptionIndex = newCorrectIdx;
    } else if (newQType === 'drag_and_drop') {
      questionObj.dragDropPairs = newDragDropPairs.filter(p => p.item.trim() && p.match.trim());
    }

    setExamQuestions((prev) => [...prev, questionObj]);
    setNewQText('');
    setNewOpt0('');
    setNewOpt1('');
    setNewOpt2('');
    setNewOpt3('');
    setNewCorrectIdx(0);
    setNewCorrectIndices([]);
    setNewDragDropPairs([{item: '', match: ''}]);
    setNewExplanation('');
    setShowQuestionCreator(false);
  };

  const handleRemoveQuestion = (qId: string) => {
    setExamQuestions((prev) => prev.filter((q) => q.id !== qId));
  };

  const handleLoadSampleQuestions = () => {
    const sampleQuestions: ExamQuestion[] = [
      {
        id: `q-sample-1-${Date.now()}`,
        question: `¿Cuál es el concepto central estudiado en la primera unidad de ${currentSubject?.name || 'la asignatura'}?`,
        options: [
          'Fundamentos teóricos y definiciones iniciales',
          'Optimización avanzada de recursos',
          'Historial cronológico de la institución',
          'Ninguna de las anteriores'
        ],
        correctOptionIndex: 0,
        explanation: 'En las primeras sesiones se abordan los conceptos y fundamentos de partida.'
      },
      {
        id: `q-sample-2-${Date.now()}`,
        question: '¿Qué método o procedimiento es el más adecuado para validar los resultados obtenidos?',
        options: [
          'Análisis empírico y contrastación con el modelo conceptual',
          'Ignorar las variables de control',
          'Aproximación por tanteo sin registro',
          'Uso exclusivo de valores cualitativos'
        ],
        correctOptionIndex: 0,
        explanation: 'La validación rigurosa requiere contraste metódico.'
      },
      {
        id: `q-sample-3-${Date.now()}`,
        question: '¿Qué criterio determina la resolución óptima de un problema aplicado en esta área?',
        options: [
          'Eficiencia computacional, precisión y consistencia lógica',
          'Mayor cantidad de líneas de código o pasos redundantes',
          'Entrega fuera de tiempo sin justificación',
          'Omisión de la bibliografía'
        ],
        correctOptionIndex: 0,
        explanation: 'Se prioriza la consistencia, exactitud y apego a la metodología.'
      }
    ];

    setExamQuestions(sampleQuestions);
    setToastMessage('¡Preguntas de ejemplo cargadas al examen!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleInsertEmoji = (emoji: string) => {
    setReadingContent((prev) => (prev ? `${prev} ${emoji}` : emoji));
  };

  const handleInsertTemplate = (templateText: string) => {
    setReadingContent((prev) => (prev ? `${prev}\n\n${templateText}` : templateText));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate || !currentSubject) return;

    const baseLink = (type === 'Taller' || type === 'Tarea' || type === 'Proyecto') && resourceLink.trim()
      ? (resourceLink.trim().startsWith('http://') || resourceLink.trim().startsWith('https://')
          ? resourceLink.trim()
          : `https://${resourceLink.trim()}`)
      : undefined;

    if (editingActivity) {
      // Update
      onUpdateActivity({
        ...editingActivity,
        title: title.trim(),
        description: description.trim(),
        dueDate,
        weight: Number(weight),
        type,
        resourceLink: baseLink,
        examQuestions: type === 'Examen' ? examQuestions : undefined,
        examTimeLimitMinutes: type === 'Examen' ? Number(examTimeLimitMinutes) || 60 : undefined,
        examMaxAttempts: type === 'Examen' ? Number(examMaxAttempts) || 1 : undefined,
        readingContent: type === 'Lectura' ? readingContent : undefined,
        readingEstimatedMinutes: type === 'Lectura' ? Number(readingEstimatedMinutes) || 5 : undefined
      });
      setToastMessage('¡Actividad actualizada exitosamente!');
    } else {
      // Add
      const nextOrder =
        subjectActivities.length > 0
          ? Math.max(...subjectActivities.map((a) => a.order)) + 1
          : 1;

      onAddActivity({
        subjectId: currentSubject.id,
        order: nextOrder,
        title: title.trim(),
        description: description.trim(),
        dueDate,
        weight: Number(weight),
        type,
        status: 'Pendiente',
        resourceLink: baseLink,
        examQuestions: type === 'Examen' ? examQuestions : undefined,
        examTimeLimitMinutes: type === 'Examen' ? Number(examTimeLimitMinutes) || 60 : undefined,
        examMaxAttempts: type === 'Examen' ? Number(examMaxAttempts) || 1 : undefined,
        readingContent: type === 'Lectura' ? readingContent : undefined,
        readingEstimatedMinutes: type === 'Lectura' ? Number(readingEstimatedMinutes) || 5 : undefined
      });
      setToastMessage('¡Nueva actividad creada y ordenada exitosamente!');
    }

    setTimeout(() => setToastMessage(''), 3500);
    resetForm();
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === subjectActivities.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const currentAct = subjectActivities[index];
    const targetAct = subjectActivities[targetIndex];

    const currentOrder = currentAct.order;
    const targetOrder = targetAct.order;

    onUpdateActivity({ ...currentAct, order: targetOrder });
    onUpdateActivity({ ...targetAct, order: currentOrder });
  };

  const totalSubjectWeight = subjectActivities.reduce((acc, a) => acc + (a.weight || 0), 0);

  return (
    <div id="teacher-activities-manager" className="space-y-5">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          role="status"
          className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-xs font-semibold flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header and Subject Selector */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-800 hover:text-blue-950 bg-white hover:bg-blue-50 px-3.5 py-2 rounded-xl transition-all w-fit cursor-pointer border border-slate-200 shadow-xs mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Mis Clases</span>
        </button>
      )}
      <div
        id="teacher-activities-header-card"
        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs transition-all"
      >
        {isEditingSubject ? (
          <form id="form-edit-subject" onSubmit={handleSaveSubject} className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    Editar Información de la Asignatura
                  </h3>
                  <p className="text-xs text-slate-500">
                    Modifica el código, nombre y demás elementos académicos de la asignatura seleccionada.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditingSubject(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                title="Cerrar edición"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {/* Código */}
              <div>
                <label
                  htmlFor="input-subject-code"
                  className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1"
                >
                  <Hash className="w-3.5 h-3.5 text-blue-700" />
                  <span>Código de Asignatura *</span>
                </label>
                <input
                  id="input-subject-code"
                  type="text"
                  required
                  value={editSubjectCode}
                  onChange={(e) => setEditSubjectCode(e.target.value.toUpperCase())}
                  placeholder="Ej. MAT-101, SIS-102"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold uppercase text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Identificador único oficial
                </span>
              </div>

              {/* Nombre */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="input-subject-name"
                  className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5 text-blue-700" />
                  <span>Nombre de la Asignatura *</span>
                </label>
                <input
                  id="input-subject-name"
                  type="text"
                  required
                  value={editSubjectName}
                  onChange={(e) => setEditSubjectName(e.target.value)}
                  placeholder="Ej. Cálculo Diferencial"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
                />
              </div>

              {/* Créditos */}
              <div>
                <label
                  htmlFor="input-subject-credits"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Créditos Académicos
                </label>
                <input
                  id="input-subject-credits"
                  type="number"
                  min="1"
                  max="15"
                  required
                  value={editSubjectCredits}
                  onChange={(e) => setEditSubjectCredits(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
                />
              </div>

              {/* Horas semanales */}
              <div>
                <label
                  htmlFor="input-subject-hours"
                  className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1"
                >
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Horas Semanales</span>
                </label>
                <input
                  id="input-subject-hours"
                  type="number"
                  min="1"
                  max="40"
                  required
                  value={editSubjectWeeklyHours}
                  onChange={(e) => setEditSubjectWeeklyHours(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
                />
              </div>

              {/* Docente titular */}
              <div>
                <label
                  htmlFor="input-subject-professor"
                  className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1"
                >
                  <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                  <span>Docente Titular</span>
                </label>
                <input
                  id="input-subject-professor"
                  type="text"
                  value={editSubjectProfessor}
                  onChange={(e) => setEditSubjectProfessor(e.target.value)}
                  placeholder="Ej. Ing. Carlos Mendoza"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
                />
              </div>

              {/* Programa Académico */}
              <div className="sm:col-span-2 md:col-span-3">
                <label
                  htmlFor="input-subject-course"
                  className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                  <span>Programa Académico / Carrera</span>
                </label>
                <input
                  id="input-subject-course"
                  type="text"
                  value={editSubjectCourseName}
                  onChange={(e) => setEditSubjectCourseName(e.target.value)}
                  placeholder="Ej. Ingeniería de Sistemas - Semestre I"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                id="btn-cancel-edit-subject"
                type="button"
                onClick={() => setIsEditingSubject(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                id="btn-save-subject-changes"
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-700 to-teal-500 hover:from-blue-800 hover:to-teal-600 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Cambios de la Asignatura</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span
                  id="badge-subject-code"
                  className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-300 shadow-2xs"
                >
                  {currentSubject?.code}
                </span>

                <button
                  id="btn-edit-subject"
                  type="button"
                  onClick={handleStartEditSubject}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  title="Haz clic para editar el código y elementos de esta asignatura"
                >
                  <Edit2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>Editar Código y Asignatura</span>
                </button>

                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500 font-medium">Gestión Académica</span>
              </div>

              <h2 id="current-subject-heading" className="text-xl font-bold text-slate-900 tracking-tight">
                {currentSubject?.name}
              </h2>

              {/* Detailed Academic Elements */}
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  {currentSubject?.credits} Créditos
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {currentSubject?.weeklyHours}h semanales
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                  Docente: {currentSubject?.professor}
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1 text-slate-500">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  {currentSubject?.courseName}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0 pt-2 lg:pt-0">
              <div className="flex items-center gap-2">
                <label htmlFor="teacher-subject-select" className="text-xs font-medium text-slate-600">
                  Asignatura:
                </label>
                <select
                  id="teacher-subject-select"
                  value={currentSubject?.id}
                  onChange={(e) => onSelectSubjectId(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700 cursor-pointer"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <button
                id="btn-create-activity"
                type="button"
                onClick={() => {
                  if (showAddForm && !editingActivity) {
                    setShowAddForm(false);
                  } else {
                    resetForm();
                    setShowAddForm(true);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-700 to-teal-500 hover:from-blue-800 hover:to-teal-600 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{showAddForm && !editingActivity ? 'Cerrar Formulario' : 'Nueva Actividad'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Activity Form */}
      {showAddForm && (
        <section
          id="teacher-activity-form-card"
          className="bg-white border-2 border-blue-300 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>
                {editingActivity
                  ? `Editar Actividad (${editingActivity.title})`
                  : 'Crear Nueva Actividad Evaluativa'}
              </span>
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Cancelar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título de la Actividad *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Actividad 1: Taller de Matrices y Determinantes"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tipo de Actividad *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as ActivityType)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700 cursor-pointer"
                >
                  <option value="Tarea">Tarea</option>
                  <option value="Taller">Taller</option>
                  <option value="Examen">Examen</option>
                  <option value="Proyecto">Proyecto</option>
                  <option value="Lectura">Lectura</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ponderación / Peso (%) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-400 font-bold">%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fecha Límite de Entrega *
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Asignatura Destino
                </label>
                <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium">
                  {currentSubject?.name}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Descripción y Guía de Instrucciones *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Especifique el objetivo de la actividad, rúbrica de evaluación, formato de entrega y criterios..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>

            {/* SECCIÓN ESPECÍFICA SEGÚN TIPO DE ACTIVIDAD */}
            {(type === 'Taller' || type === 'Tarea') && (
              <div
                id="container-link-setting"
                className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2.5 transition-all"
              >
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="input-resource-link"
                    className="text-xs font-bold text-blue-950 flex items-center gap-1.5"
                  >
                    <LinkIcon className="w-3.5 h-3.5 text-blue-700" />
                    <span>Enlace / URL de Redirección para {type}</span>
                  </label>
                  {resourceLink && (
                    <a
                      href={resourceLink.startsWith('http') ? resourceLink : `https://${resourceLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 hover:underline"
                    >
                      <span>Probar enlace</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <input
                  id="input-resource-link"
                  type="text"
                  value={resourceLink}
                  onChange={(e) => setResourceLink(e.target.value)}
                  placeholder={
                    type === 'Taller'
                      ? 'Ej: https://docs.google.com/document/d/... o https://replit.com/...'
                      : 'Ej: https://github.com/... o https://openstax.org/...'
                  }
                  className="w-full px-3 py-2 bg-white border border-blue-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700 shadow-2xs"
                />

                <p className="text-[11px] text-blue-800 leading-relaxed">
                  🔗 <strong>Redirección Automática:</strong> El estudiante tendrá en su portal un botón destacado{' '}
                  <span className="font-semibold text-blue-900 underline">"Abrir {type} Externo ↗"</span>{' '}
                  que lo redireccionará a esta URL en una nueva pestaña.
                </p>
              </div>
            )}

            {type === 'Examen' && (
              <div
                id="container-exam-builder"
                className="p-4 bg-rose-50/60 border border-rose-200 rounded-xl space-y-4 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-rose-200">
                  <div>
                    <h4 className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                      <ListChecks className="w-4 h-4 text-rose-700" />
                      <span>Formulario de Examen para el Estudiante ({examQuestions.length} Preguntas)</span>
                    </h4>
                    <p className="text-[11px] text-rose-700 mt-0.5">
                      Configura el cuestionario interactivo que el estudiante resolverá en línea con calificación automática.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-semibold text-rose-900 mb-1">Tiempo (minutos)</label>
                      <input 
                        type="number" 
                        min="1" 
                        value={examTimeLimitMinutes} 
                        onChange={(e) => setExamTimeLimitMinutes(Number(e.target.value))} 
                        className="w-20 px-2 py-1 text-xs border border-rose-300 rounded bg-white" 
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[10px] font-semibold text-rose-900 mb-1">Intentos Permitidos</label>
                      <input 
                        type="number" 
                        min="1" 
                        value={examMaxAttempts} 
                        onChange={(e) => setExamMaxAttempts(Number(e.target.value))} 
                        className="w-20 px-2 py-1 text-xs border border-rose-300 rounded bg-white" 
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleLoadSampleQuestions}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-rose-100 hover:bg-rose-200 text-rose-900 rounded-lg border border-rose-300 transition-colors cursor-pointer"
                    >
                      Cargar 3 preguntas de ejemplo
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowQuestionCreator(!showQuestionCreator)}
                      className="px-2.5 py-1 text-[11px] font-bold bg-rose-700 hover:bg-rose-800 text-white rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{showQuestionCreator ? 'Cerrar Creador' : 'Añadir Pregunta'}</span>
                    </button>
                  </div>
                </div>

                {/* Subformulario de nueva pregunta */}
                {showQuestionCreator && (
                  <div className="p-3.5 bg-white border border-rose-300 rounded-xl space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <select
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
                              name={newQType === 'multiple_choice' ? 'correct-option-radio' : `correct-option-checkbox-${opt.idx}`}
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
                              placeholder={`Texto de la opción ${opt.label}`}
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
                    )}

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Explicación / Retroalimentación (Opcional):
                      </label>
                      <input
                        type="text"
                        value={newExplanation}
                        onChange={(e) => setNewExplanation(e.target.value)}
                        placeholder="Ej: Justificación de por qué esta opción es la correcta..."
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-600 focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowQuestionCreator(false)}
                        className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleAddQuestion}
                        className="px-3.5 py-1.5 text-xs font-bold bg-rose-700 hover:bg-rose-800 text-white rounded-lg cursor-pointer"
                      >
                        Guardar Pregunta en el Examen
                      </button>
                    </div>
                  </div>
                )}

                {/* Lista de preguntas agregadas */}
                {examQuestions.length === 0 ? (
                  <div className="p-4 bg-white/70 border border-dashed border-rose-300 rounded-xl text-center">
                    <HelpCircle className="w-6 h-6 text-rose-400 mx-auto mb-1" />
                    <p className="text-xs text-rose-900 font-semibold">
                      Aún no has configurado preguntas para este examen.
                    </p>
                    <p className="text-[11px] text-rose-600 mt-0.5">
                      Haz clic en "Cargar 3 preguntas de ejemplo" o "+ Añadir Pregunta" para crear el formulario.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {examQuestions.map((q, qIndex) => (
                      <div
                        key={q.id}
                        className="p-3 bg-white border border-rose-200 rounded-xl space-y-1.5 text-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-slate-900">
                            Pregunta {qIndex + 1}: {q.question}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(q.id)}
                            className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50 cursor-pointer shrink-0"
                            title="Eliminar pregunta"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="pt-1">
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
                                    className={`px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1.5 ${
                                      isCorrect
                                        ? 'bg-blue-100 text-blue-900 font-bold border border-blue-300'
                                        : 'bg-slate-50 text-slate-700 border border-slate-200'
                                    }`}
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
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {type === 'Lectura' && (
              <div
                id="container-reading-editor"
                className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl space-y-3 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-purple-200">
                  <div>
                    <h4 className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-purple-700" />
                      <span>Contenido de Lectura (Textos, Emojis y Formato Educativo)</span>
                    </h4>
                    <p className="text-[11px] text-purple-700 mt-0.5">
                      Redacta el texto instructivo y usa los botones de emojis para una experiencia visual enriquecida.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-purple-900">Tiempo estimado:</label>
                    <div className="flex items-center gap-1 bg-white border border-purple-300 rounded-lg px-2 py-1">
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={readingEstimatedMinutes}
                        onChange={(e) => setReadingEstimatedMinutes(Number(e.target.value))}
                        className="w-10 text-xs font-bold text-purple-950 text-center focus:outline-none"
                      />
                      <span className="text-[11px] text-purple-700">min</span>
                    </div>
                  </div>
                </div>

                {/* Barra de Emojis Interactiva */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-purple-900">
                    <Smile className="w-3.5 h-3.5 text-purple-700" />
                    <span>Haz clic en cualquier emoji para insertarlo en la lectura:</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1 p-2 bg-white border border-purple-200 rounded-xl">
                    {[
                      '📚', '📖', '💡', '🧠', '🎯', '✨', '📌', '🔍', '🚀', '🎓',
                      '📝', '⚠️', '✅', '🏆', '🌟', '📊', '🧪', '💻', '📐', '🏛️',
                      '🌿', '💬', '🔥', '⚡'
                    ].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleInsertEmoji(emoji)}
                        className="w-7 h-7 text-sm rounded hover:bg-purple-100 flex items-center justify-center transition-colors cursor-pointer hover:scale-110"
                        title={`Insertar ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Plantillas Rápidas */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 mr-1">
                    Insertar Plantilla:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleInsertTemplate('✨ INTRODUCCIÓN Y OBJETIVOS:\nEn esta sesión exploraremos...')}
                    className="px-2 py-1 bg-white border border-purple-200 hover:bg-purple-100 text-purple-900 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    + Introducción ✨
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertTemplate('📌 PUNTOS CLAVE Y CONCEPTOS:\n1. Concepto principal 💡\n2. Aspectos determinantes ⚙️\n3. Casos aplicados 🚀')}
                    className="px-2 py-1 bg-white border border-purple-200 hover:bg-purple-100 text-purple-900 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    + Puntos Clave 📌
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertTemplate('🧠 PREGUNTAS DE REFLEXIÓN:\n• ¿Cómo influye este concepto en tu práctica profesional? 🎓\n• ¿Qué conclusiones debates con tu equipo? 🤝')}
                    className="px-2 py-1 bg-white border border-purple-200 hover:bg-purple-100 text-purple-900 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    + Preguntas de Reflexión 💡
                  </button>
                </div>

                {/* Textarea de Contenido de Lectura */}
                <div>
                  <label className="block text-[11px] font-bold text-purple-900 mb-1">
                    Texto Completo de la Lectura (con Emojis integrados):
                  </label>
                  <textarea
                    rows={7}
                    value={readingContent}
                    onChange={(e) => setReadingContent(e.target.value)}
                    placeholder="Escribe o pega aquí el texto formativo completo, usando emojis 📚✨🧠 y párrafos organizados..."
                    className="w-full p-3 bg-white border border-purple-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-700 leading-relaxed font-sans"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                id="btn-save-activity-submit"
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-700 to-teal-500 hover:from-blue-800 hover:to-teal-600 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{editingActivity ? 'Guardar Cambios' : 'Publicar Actividad'}</span>
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Activities List Ordered From Top to Bottom */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-700" />
              <span>Lista de Actividades (Orden de Arriba hacia Abajo)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Los estudiantes ven exactamente este mismo orden en su portal interactivo.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Total Ponderación:</span>
            <span
              className={`font-bold px-2.5 py-0.5 rounded-full ${
                totalSubjectWeight === 100
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {totalSubjectWeight}% / 100%
            </span>
          </div>
        </div>

        {subjectActivities.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            <p className="font-semibold text-slate-700 text-sm mb-1">
              No hay actividades creadas en esta asignatura.
            </p>
            <p>Haz clic en "Nueva Actividad" arriba para registrar la primera tarea o taller.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {subjectActivities.map((act, index) => (
              <div
                key={act.id}
                id={`teacher-activity-row-${act.id}`}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Sequence Badge */}
                  <div
                    className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-700 to-teal-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs"
                    title={`Posición ${index + 1}`}
                  >
                    #{index + 1}
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 truncate">{act.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200 text-slate-700">
                        {act.type}
                      </span>
                      <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {act.weight}%
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {act.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Entrega: {act.dueDate}</span>
                      </span>

                      {act.resourceLink && (
                        <a
                          href={act.resourceLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200"
                        >
                          <LinkIcon className="w-3 h-3 text-blue-600" />
                          <span>Link configurado</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}

                      {act.type === 'Examen' && (
                        <span className="inline-flex items-center gap-1 font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          <ListChecks className="w-3 h-3 text-rose-600" />
                          <span>{act.examQuestions?.length || 0} preguntas en formulario</span>
                        </span>
                      )}

                      {act.type === 'Lectura' && (
                        <span className="inline-flex items-center gap-1 font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          <BookOpen className="w-3 h-3 text-purple-600" />
                          <span>Lectura ({act.readingEstimatedMinutes || 5} min) ✨</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right controls: Reorder Up/Down, Edit, Delete */}
                <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                  <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, 'up')}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Mover arriba"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === subjectActivities.length - 1}
                      onClick={() => handleMove(index, 'down')}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 border-l border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Mover abajo"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    id={`btn-edit-act-${act.id}`}
                    type="button"
                    onClick={() => handleStartEdit(act)}
                    className="p-2 text-slate-600 hover:text-blue-700 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer border border-slate-200 bg-white"
                    title="Editar actividad"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    id={`btn-delete-act-${act.id}`}
                    type="button"
                    onClick={() => {
                      if (window.confirm(`¿Desea eliminar la actividad "${act.title}"?`)) {
                        onDeleteActivity(act.id);
                        setToastMessage('Actividad eliminada.');
                        setTimeout(() => setToastMessage(''), 3000);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer border border-slate-200 bg-white"
                    title="Eliminar actividad"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

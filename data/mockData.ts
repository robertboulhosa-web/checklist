import { User, UserRole, Checklist, StageStatus, Pendency, TimelineEvent, Comment, Notification, ChecklistTemplate, AuditLog, Goal, QueueItem } from '../types';

export const USERS: User[] = [
  { id: 'u1', name: 'Ana Silva', role: UserRole.OPERATOR, avatar: 'https://i.pravatar.cc/150?u=u1' },
  { id: 'u2', name: 'Bruno Costa', role: UserRole.OPERATOR, avatar: 'https://i.pravatar.cc/150?u=u2' },
  { id: 'u3', name: 'Carla Dias', role: UserRole.ADMIN, avatar: 'https://i.pravatar.cc/150?u=u3' },
  { id: 'u4', name: 'Daniel Souza', role: UserRole.MANAGER, avatar: 'https://i.pravatar.cc/150?u=u4' },
  { id: 'u5', name: 'Eduarda Lima', role: UserRole.OPERATOR, avatar: 'https://i.pravatar.cc/150?u=u5' },
  { id: 'u6', name: 'Fernanda Alves', role: UserRole.OPERATOR, avatar: 'https://i.pravatar.cc/150?u=u6' }, // Final Reviewer
];

const COMMENTS: Comment[] = [
    { id: 'com1', author: USERS[0], text: 'Poderia verificar o manual de identidade visual? Acredito que a cor primária está incorreta.', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) },
    { id: 'com2', author: USERS[1], text: 'Verificado. Realmente, usei a paleta antiga. Já estou ajustando, obrigado!', timestamp: new Date(Date.now() - 5.5 * 60 * 60 * 1000) },
];

const PENDENCIES: Pendency[] = [
    { id: 'p1', item: 'Corrigir logo do curso', responsibleStage: 2, responsibleAnalyst: USERS[1], status: 'Aberta', timeBlocked: 5, comments: COMMENTS },
    { id: 'p2', item: 'Ajustar data de início', responsibleStage: 3, responsibleAnalyst: USERS[4], status: 'Resolvida', timeBlocked: 2, comments: [] },
];

export const CHECKLISTS: Checklist[] = [
  {
    id: 'c1',
    courseName: 'Curso de React Avançado',
    stages: [
      { id: 1, name: 'Template', status: StageStatus.COMPLETED, realTimeSpent: 4, standbyTime: 2, pendencies: [], assignedTo: USERS[0] },
      { id: 2, name: 'Identidade Visual', status: StageStatus.PENDING_FIX, realTimeSpent: 6, standbyTime: 10, pendencies: [PENDENCIES[0]], assignedTo: USERS[1] },
      { id: 3, name: 'Config. da Turma', status: StageStatus.IN_PROGRESS, realTimeSpent: 1, standbyTime: 0.5, pendencies: [], assignedTo: USERS[0] },
      { id: 4, name: 'Revisão Final', status: StageStatus.WAITING, realTimeSpent: 0, standbyTime: 0, pendencies: [], assignedTo: USERS[5] },
    ],
    overallProgress: 45,
    totalTimeSpent: 11,
    totalTimeBlocked: 5,
  },
  {
    id: 'c2',
    courseName: 'Introdução ao Node.js',
    stages: [
      { id: 1, name: 'Template', status: StageStatus.COMPLETED, realTimeSpent: 3, standbyTime: 1, pendencies: [], assignedTo: USERS[0] },
      { id: 2, name: 'Identidade Visual', status: StageStatus.COMPLETED, realTimeSpent: 5, standbyTime: 2, pendencies: [], assignedTo: USERS[1] },
      { id: 3, name: 'Config. da Turma', status: StageStatus.COMPLETED, realTimeSpent: 2, standbyTime: 1, pendencies: [], assignedTo: USERS[4] },
      { id: 4, name: 'Revisão Final', status: StageStatus.IN_PROGRESS, realTimeSpent: 2, standbyTime: 3, pendencies: [], assignedTo: USERS[5] },
    ],
    overallProgress: 90,
    totalTimeSpent: 12,
    totalTimeBlocked: 0,
  },
  {
    id: 'c3',
    courseName: 'Design Systems com Figma',
    stages: [
      { id: 1, name: 'Template', status: StageStatus.IN_PROGRESS, realTimeSpent: 2, standbyTime: 4, pendencies: [], assignedTo: USERS[0] },
      { id: 2, name: 'Identidade Visual', status: StageStatus.WAITING, realTimeSpent: 0, standbyTime: 0, pendencies: [], assignedTo: USERS[1] },
      { id: 3, name: 'Config. da Turma', status: StageStatus.WAITING, realTimeSpent: 0, standbyTime: 0, pendencies: [], assignedTo: USERS[4] },
      { id: 4, name: 'Revisão Final', status: StageStatus.WAITING, realTimeSpent: 0, standbyTime: 0, pendencies: [], assignedTo: USERS[5] },
    ],
    overallProgress: 15,
    totalTimeSpent: 2,
    totalTimeBlocked: 0,
  },
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
    { id: 't1', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), description: 'Iniciou checklist "Curso de React Avançado"', type: 'start' },
    { id: 't2', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), description: 'Enviou "Template" para "Identidade Visual"', type: 'submit' },
    { id: 't3', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), description: 'Checklist "Design Systems" retornou com pendência', type: 'return' },
    { id: 't4', timestamp: new Date(Date.now() - 0.5 * 60 * 60 * 1000), description: 'Finalizou etapa "Config. da Turma" do curso de Node.js', type: 'complete' },
];

export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', userId: 'u1', message: 'O checklist "Introdução ao Node.js" voltou com 1 pendência da Etapa 4.', link: '#', read: false, timestamp: new Date(Date.now() - 15 * 60 * 1000) },
  { id: 'n2', userId: 'u1', message: 'A Etapa 2 do curso "Design Systems" foi concluída. Você já pode iniciar a Etapa 3.', link: '#', read: false, timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) },
  { id: 'n3', userId: 'u1', message: 'Novo checklist "Curso de Vue.js" atribuído a você.', link: '#', read: true, timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) },
  { id: 'n4', userId: 'u2', message: 'Pendência resolvida no checklist "Curso de React Avançado".', link: '#', read: false, timestamp: new Date(Date.now() - 30 * 60 * 1000) },
];

export const TEMPLATES: ChecklistTemplate[] = [
  { id: 'temp1', name: 'Template Padrão - Cursos Técnicos' },
  { id: 'temp2', name: 'Template Marketing - Lançamentos' },
  { id: 'temp3', name: 'Template Rápido - Webinars' },
  { id: 'temp4', name: 'Template Geral de Revisão' },
];

export const AUDIT_LOGS: AuditLog[] = [
  { id: 'log1', user: USERS[2], action: 'criou o template "Template Geral de Revisão".', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
  { id: 'log2', user: USERS[0], action: 'enviou a "Etapa 1" do curso "React Avançado".', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) },
  { id: 'log3', user: USERS[1], action: 'resolveu uma pendência no curso "Node.js".', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  { id: 'log4', user: USERS[2], action: 'atribuiu "Eduarda Lima" à Etapa 2.', timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000) },
];

export const GOALS: { [userId: string]: Goal } = {
  'u1': { completedChecklists: 12, averageTime: 4.5, slaMetPercentage: 92, coursesFinished: 5 },
  'u2': { completedChecklists: 8, averageTime: 5.2, slaMetPercentage: 85, coursesFinished: 3 },
  'u5': { completedChecklists: 15, averageTime: 4.1, slaMetPercentage: 95, coursesFinished: 6 },
  'u6': { completedChecklists: 20, averageTime: 3.8, slaMetPercentage: 98, coursesFinished: 8 },
};

export const QUEUE_ITEMS: QueueItem[] = [
    { id: 'q1', courseName: 'Curso de Vue.js', fromStage: 'Etapa 1' },
    { id: 'q2', courseName: 'Curso de SQL Avançado', fromStage: 'Liberado' },
    { id: 'q3', courseName: 'Webinar de IA', fromStage: 'Etapa 2' },
];
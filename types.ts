export enum UserRole {
  OPERATOR = 'Analista Operador',
  ADMIN = 'Administrador',
  MANAGER = 'Gestão',
}

export enum StageStatus {
  IN_PROGRESS = 'Em andamento',
  WAITING = 'Aguardando outra etapa',
  COMPLETED = 'Concluído',
  PENDING_FIX = 'Pendente de Correção'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
}

export interface Comment {
  id: string;
  author: User;
  text: string;
  timestamp: Date;
}

export interface Pendency {
  id: string;
  item: string;
  responsibleStage: number;
  responsibleAnalyst: User;
  status: 'Aberta' | 'Resolvida';
  timeBlocked: number; // in hours
  comments: Comment[];
}

export interface Stage {
  id: number;
  name: string;
  status: StageStatus;
  realTimeSpent: number; // in hours
  standbyTime: number; // in hours
  pendencies: Pendency[];
  assignedTo: User;
}

export interface Checklist {
  id: string;
  courseName: string;
  stages: Stage[];
  overallProgress: number;
  totalTimeSpent: number;
  totalTimeBlocked: number;
}

export interface TimelineEvent {
  id: string;
  timestamp: Date;
  description: string;
  type: 'start' | 'pause' | 'resume' | 'submit' | 'return' | 'complete';
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  link: string;
  read: boolean;
  timestamp: Date;
}

export interface ChecklistTemplate {
  id: string;
  name: string;
}

export interface AuditLog {
  id: string;
  user: User;
  action: string;
  timestamp: Date;
}

export interface Goal {
  completedChecklists: number;
  averageTime: number; // in hours
  slaMetPercentage: number;
  coursesFinished: number;
}

export interface QueueItem {
  id: string;
  courseName: string;
  fromStage: string;
}

import React, { useState, useEffect } from 'react';
import { User, Checklist, Stage, Pendency, StageStatus, TimelineEvent, Comment } from '../types';
import Card from '../components/Card';
import { CHECKLISTS, TIMELINE_EVENTS } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ListChecks, AlertTriangle, Timer, Hourglass, SkipForward, Send, Target, CalendarClock, ChevronsRight, MessageSquare } from 'lucide-react';
import PendencyModal from '../components/PendencyModal';

interface OperatorDashboardProps {
  user: User;
}

const SmartTimerCard: React.FC = () => {
    const [realTime, setRealTime] = useState(3 * 3600 + 45 * 60 + 12); // 3h 45m 12s
    const [standbyTime, setStandbyTime] = useState(1 * 3600 + 15 * 60 + 30); // 1h 15m 30s

    useEffect(() => {
        const interval = setInterval(() => {
            setRealTime(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    return (
        <Card title="Cronômetro Inteligente (Etapa Atual)" icon={<Timer />}>
            <div className="flex justify-around items-center h-full">
                <div className="text-center">
                    <div className="flex items-center space-x-2 text-3xl font-mono text-secondary">
                        <Timer className="h-8 w-8"/>
                        <span>{formatTime(realTime)}</span>
                    </div>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Tempo Real</p>
                </div>
                <div className="text-center">
                    <div className="flex items-center space-x-2 text-3xl font-mono text-warning">
                        <Hourglass className="h-8 w-8"/>
                        <span>{formatTime(standbyTime)}</span>
                    </div>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Tempo em Standby</p>
                </div>
            </div>
        </Card>
    );
};


const OperatorDashboard: React.FC<OperatorDashboardProps> = ({ user }) => {
  const [localChecklists, setLocalChecklists] = useState(CHECKLISTS);
  const [selectedPendency, setSelectedPendency] = useState<Pendency | null>(null);
  
  const myChecklists = localChecklists.filter(c => c.stages.some(s => s.assignedTo.id === user.id));
  const myPendencies = myChecklists.flatMap(c => c.stages).flatMap(s => s.pendencies).filter(p => p.status === 'Aberta');

  const handleOpenModal = (pendency: Pendency) => {
    setSelectedPendency(pendency);
  };

  const handleCloseModal = () => {
    setSelectedPendency(null);
  };

  const handleAddComment = (pendencyId: string, comment: Comment) => {
    const updatedChecklists = localChecklists.map(checklist => ({
      ...checklist,
      stages: checklist.stages.map(stage => ({
        ...stage,
        pendencies: stage.pendencies.map(p =>
          p.id === pendencyId
            ? { ...p, comments: [...p.comments, comment] }
            : p
        )
      }))
    }));
    setLocalChecklists(updatedChecklists);
    
    // Also update the selectedPendency to show the new comment instantly in the modal
    setSelectedPendency(prev => prev ? { ...prev, comments: [...prev.comments, comment] } : null);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CARD 1 — Meus Checklists */}
        <div className="lg:col-span-3">
          <Card title="Meus Checklists (Resumo por Etapa)" icon={<ListChecks />}>
            <div className="space-y-4">
              {myChecklists.map(checklist => (
                <div key={checklist.id} className="p-3 bg-bkg-light dark:bg-bkg-dark rounded-lg">
                  <h4 className="font-semibold text-lg mb-2">{checklist.courseName}</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-bkg-light dark:bg-bkg-dark">
                        <tr>
                          <th className="px-4 py-2">Etapa</th>
                          <th className="px-4 py-2">Status</th>
                          <th className="px-4 py-2">Tempo Real</th>
                          <th className="px-4 py-2">Tempo Standby</th>
                          <th className="px-4 py-2">Pendências</th>
                          <th className="px-4 py-2">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {checklist.stages.filter(s => s.assignedTo.id === user.id || s.status !== StageStatus.WAITING).map(stage => (
                          <tr key={stage.id} className="border-t border-border-light dark:border-border-dark">
                            <td className="px-4 py-2 font-medium">{stage.name}</td>
                            <td className="px-4 py-2"><StatusBadge status={stage.status} /></td>
                            <td className="px-4 py-2">{stage.realTimeSpent.toFixed(1)}h</td>
                            <td className="px-4 py-2">{stage.standbyTime.toFixed(1)}h</td>
                            <td className="px-4 py-2">{stage.pendencies.length}</td>
                            <td className="px-4 py-2 flex items-center space-x-2">
                              <button className="p-1.5 text-xs font-semibold text-white bg-secondary rounded hover:bg-opacity-80 transition flex items-center space-x-1"><ChevronsRight className="h-3 w-3" /><span>Continuar</span></button>
                              <button disabled={stage.pendencies.some(p => p.status === 'Aberta')} className="p-1.5 text-xs font-semibold text-white bg-primary rounded hover:bg-primary-hover disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center space-x-1"><Send className="h-3 w-3" /><span>Enviar</span></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* CARD 2 — Pendências */}
        <Card title="Pendências das Etapas Anteriores" icon={<AlertTriangle />}>
          <ul className="space-y-3">
            {myPendencies.length > 0 ? myPendencies.map(p => (
              <li key={p.id} className="p-3 rounded-md bg-bkg-light dark:bg-bkg-dark">
                 <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{p.item}</p>
                      <div className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
                        <span>Responsável: {p.responsibleAnalyst.name} (Etapa {p.responsibleStage})</span>
                        <span className="mx-2">|</span>
                        <span>Parado há: {p.timeBlocked}h</span>
                      </div>
                    </div>
                    <button onClick={() => handleOpenModal(p)} className="flex items-center space-x-1 text-xs text-primary hover:underline flex-shrink-0 ml-2">
                      <MessageSquare className="h-3 w-3" />
                      <span>({p.comments.length})</span>
                    </button>
                 </div>
              </li>
            )) : <p className="text-text-muted-light dark:text-text-muted-dark">Nenhuma pendência bloqueando seu trabalho.</p>}
          </ul>
        </Card>

        {/* CARD 3 — Cronômetro */}
        <SmartTimerCard />

        {/* CARD 4 — Próximos Checklists */}
        <Card title="Meus Próximos Checklists (Fila)" icon={<SkipForward />}>
            <ul className="space-y-2">
                <li className="flex justify-between items-center p-2 rounded-md bg-bkg-light dark:bg-bkg-dark"><span>Curso de Vue.js (de Etapa 1)</span> <button className="text-xs text-primary font-semibold">Iniciar</button></li>
                <li className="flex justify-between items-center p-2 rounded-md bg-bkg-light dark:bg-bkg-dark"><span>Curso de SQL (Liberado)</span> <button className="text-xs text-primary font-semibold">Iniciar</button></li>
            </ul>
        </Card>

        {/* CARD 5 — Progresso Geral */}
        <div className="lg:col-span-3">
          <Card title="Progresso Geral dos Cursos" icon={<Target />}>
              <div className="space-y-6">
                  {CHECKLISTS.map(course => (
                      <div key={course.id}>
                          <div className="flex justify-between items-center mb-1">
                              <span className="font-bold">{course.courseName}</span>
                              <span className="text-sm font-semibold text-primary">{course.overallProgress}%</span>
                          </div>
                          <div className="w-full bg-bkg-light dark:bg-bkg-dark rounded-full h-4">
                              <div className="bg-primary h-4 rounded-full" style={{ width: `${course.overallProgress}%` }}></div>
                          </div>
                          <div className="flex justify-between text-xs mt-1 text-text-muted-light dark:text-text-muted-dark">
                              <span>Tempo Gasto: {course.totalTimeSpent}h</span>
                              <span>Tempo Parado: {course.totalTimeBlocked}h</span>
                          </div>
                      </div>
                  ))}
              </div>
          </Card>
        </div>

        {/* CARD 8 — Minhas Metas */}
        <Card title="Minhas Metas (Mês)" icon={<Target />}>
            <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                    <p className="text-3xl font-bold text-primary">12</p>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Checklists Completos</p>
                </div>
                <div>
                    <p className="text-3xl font-bold text-primary">4.5h</p>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Tempo Médio</p>
                </div>
                <div>
                    <p className="text-3xl font-bold text-secondary">92%</p>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">SLA Batido</p>
                </div>
                 <div>
                    <p className="text-3xl font-bold text-secondary">5</p>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Cursos Finalizados</p>
                </div>
            </div>
        </Card>

        {/* CARD 9 — Timeline do Meu Trabalho */}
        <div className="lg:col-span-2">
          <Card title="Timeline do Meu Trabalho" icon={<CalendarClock />}>
            <div className="relative pl-4 border-l border-border-light dark:border-border-dark">
              {TIMELINE_EVENTS.map(event => (
                <div key={event.id} className="mb-6">
                  <div className="absolute w-3 h-3 bg-primary rounded-full mt-1.5 -left-1.5 border border-card-light dark:border-card-dark"></div>
                  <time className="mb-1 text-sm font-normal leading-none text-text-muted-light dark:text-text-muted-dark">{event.timestamp.toLocaleString()}</time>
                  <p className="text-base font-semibold">{event.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>
      <PendencyModal 
        pendency={selectedPendency}
        user={user}
        isOpen={!!selectedPendency}
        onClose={handleCloseModal}
        onAddComment={handleAddComment}
      />
    </>
  );
};

export default OperatorDashboard;

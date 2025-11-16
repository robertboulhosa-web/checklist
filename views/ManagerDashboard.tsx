import React from 'react';
// FIX: Import StageStatus to fix type comparison errors.
import { User, StageStatus } from '../types';
import Card from '../components/Card';
import { CHECKLISTS, USERS } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Globe, BarChart2, Filter, GitBranch, Download } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const ManagerDashboard: React.FC<{ user: User }> = ({ user }) => {
  const totalCourses = CHECKLISTS.length;
  const completedCourses = CHECKLISTS.filter(c => c.overallProgress === 100).length;
  const totalPendencies = CHECKLISTS.reduce((sum, c) => sum + c.stages.reduce((s, st) => s + st.pendencies.length, 0), 0);
  const totalTimeBlocked = CHECKLISTS.reduce((sum, c) => sum + c.totalTimeBlocked, 0);

  const pendenciesByStage = CHECKLISTS.flatMap(c => c.stages).reduce((acc, stage) => {
    const stageName = `Etapa ${stage.id}`;
    if (!acc[stageName]) {
      acc[stageName] = 0;
    }
    acc[stageName] += stage.pendencies.length;
    return acc;
  }, {} as Record<string, number>);

  const pendencyData = Object.entries(pendenciesByStage).map(([name, value]) => ({ name, pendencias: value }));

  const timeByStage = CHECKLISTS.flatMap(c => c.stages).reduce((acc, stage) => {
    const stageName = `Etapa ${stage.id}`;
    if (!acc[stageName]) {
      acc[stageName] = { realTime: 0, blockedTime: 0 };
    }
    acc[stageName].realTime += stage.realTimeSpent;
    acc[stageName].blockedTime += stage.pendencies.reduce((sum, p) => sum + p.timeBlocked, 0);
    return acc;
  }, {} as Record<string, { realTime: number, blockedTime: number }>);
  
  const timeData = Object.entries(timeByStage).map(([name, values]) => ({ name, ...values }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* GESTÃO CARD 1 — Visão Geral Global */}
      <div className="lg:col-span-4">
        <Card title="Visão Geral Global" icon={<Globe />}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-4xl font-bold text-primary">{totalCourses}</p>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Cursos Ativos</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-secondary">{completedCourses}</p>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Cursos Finalizados</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-warning">{totalPendencies}</p>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Pendências Abertas</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-danger">{totalTimeBlocked}h</p>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Tempo Total Parado</p>
            </div>
          </div>
        </Card>
      </div>

      {/* GESTÃO CARD 2 — Relatórios */}
      <div className="lg:col-span-4">
        <Card title="Relatórios" icon={<Filter />}>
          <div className="flex flex-wrap gap-4 items-center">
            <select className="p-2 rounded-md border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark focus:outline-none focus:ring-2 focus:ring-primary"><option>Por Curso</option></select>
            <select className="p-2 rounded-md border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark focus:outline-none focus:ring-2 focus:ring-primary"><option>Por Analista</option></select>
            <input type="date" className="p-2 rounded-md border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark focus:outline-none focus:ring-2 focus:ring-primary"/>
            <div className="flex-grow"></div>
            <button className="flex items-center space-x-2 p-2 bg-secondary text-white rounded-lg hover:bg-opacity-80 transition">
                <Download className="h-4 w-4" /><span>Exportar (XLS)</span>
            </button>
          </div>
        </Card>
      </div>

      {/* GESTÃO CARD 3 — Análise de Gargalos */}
      <div className="lg:col-span-2">
        <Card title="Análise de Gargalos - Pendências por Etapa" icon={<BarChart2 />}>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pendencyData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <XAxis type="number" stroke="var(--text-muted-color)" />
                <YAxis type="category" dataKey="name" stroke="var(--text-muted-color)" width={80} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(36, 36, 36, 0.8)', borderColor: 'var(--border-dark)' }} />
                <Bar dataKey="pendencias" name="Nº de Pendências" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card title="Análise de Gargalos - Tempo por Etapa (h)" icon={<BarChart2 />}>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" stroke="var(--text-muted-color)" />
                <YAxis stroke="var(--text-muted-color)" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(36, 36, 36, 0.8)', borderColor: 'var(--border-dark)' }} />
                <Legend />
                <Bar dataKey="realTime" stackId="a" fill="#3b82f6" name="Tempo Real" />
                <Bar dataKey="blockedTime" stackId="a" fill="#f59e0b" name="Tempo Bloqueado" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>


      {/* GESTÃO CARD 4 — Linha do Tempo Global */}
      <div className="lg:col-span-4">
        <Card title="Linha do Tempo Global dos Cursos" icon={<GitBranch />}>
          <div className="space-y-6">
            {CHECKLISTS.map(course => (
              <div key={course.id}>
                <h4 className="font-bold mb-2">{course.courseName}</h4>
                <div className="relative flex items-center">
                  {course.stages.map((stage, index) => (
                    <React.Fragment key={stage.id}>
                      <div className="flex flex-col items-center z-10">
                        {/* FIX: Use StageStatus enum for comparison instead of a magic string. */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${stage.status === StageStatus.COMPLETED ? 'bg-secondary' : 'bg-primary'}`}>
                          {stage.id}
                        </div>
                        <span className="text-xs mt-1">{stage.name}</span>
                      </div>
                      {index < course.stages.length - 1 && (
                        <div className="flex-grow h-1 bg-border-light dark:bg-border-dark relative -mx-1">
                          {/* FIX: Use StageStatus enum for comparison instead of a magic string. */}
                          <div className="absolute top-0 left-0 h-1 bg-primary" style={{width: `${stage.status === StageStatus.COMPLETED ? 100 : 0}%`}}></div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                  <div className={`ml-4 text-2xl ${course.overallProgress === 100 ? 'text-secondary' : 'text-text-muted-light'}`}>✔</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ManagerDashboard;
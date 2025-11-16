
import React from 'react';
import { User } from '../types';
import Card from '../components/Card';
import { USERS, CHECKLISTS } from '../data/mockData';
import { FilePlus, Users, Settings, History, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard: React.FC<{ user: User }> = ({ user }) => {

  const stageData = CHECKLISTS.flatMap(c => c.stages).reduce((acc, stage) => {
    const existing = acc.find(item => item.name === `Etapa ${stage.id}`);
    if (existing) {
      existing.count += 1;
      existing.time += stage.realTimeSpent;
    } else {
      acc.push({ name: `Etapa ${stage.id}`, count: 1, time: stage.realTimeSpent });
    }
    return acc;
  }, [] as { name: string, count: number, time: number }[]).map(d => ({...d, avgTime: d.time / d.count}));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ADMIN CARD 1 — Criar e Gerenciar Templates */}
      <Card title="Gerenciar Templates de Checklist" icon={<FilePlus />}>
        <div className="space-y-4">
          <button className="w-full flex items-center justify-center space-x-2 p-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition">
            <PlusCircle className="h-5 w-5" />
            <span>Criar Novo Template</span>
          </button>
          <ul className="space-y-2">
            {['Template Etapa 1', 'Template Etapa 2', 'Template Etapa 3', 'Template Revisão Final'].map(template => (
              <li key={template} className="flex justify-between items-center p-3 bg-bkg-light dark:bg-bkg-dark rounded-md">
                <span>{template}</span>
                <div className="flex space-x-2">
                  <button className="p-1 text-blue-500 hover:text-blue-700"><Edit className="h-4 w-4" /></button>
                  <button className="p-1 text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {/* ADMIN CARD 2 — Gestão de Usuários */}
      <Card title="Gestão de Usuários" icon={<Users />}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-bkg-light dark:bg-bkg-dark">
              <tr>
                <th className="px-4 py-2">Nome</th>
                <th className="px-4 py-2">Grupo</th>
                <th className="px-4 py-2">Tarefas Ativas</th>
              </tr>
            </thead>
            <tbody>
              {USERS.map(u => (
                <tr key={u.id} className="border-t border-border-light dark:border-border-dark">
                  <td className="px-4 py-2 flex items-center space-x-2">
                    <img src={u.avatar} alt={u.name} className="h-6 w-6 rounded-full" />
                    <span>{u.name}</span>
                  </td>
                  <td className="px-4 py-2">{u.role}</td>
                  <td className="px-4 py-2 text-center">{CHECKLISTS.filter(c => c.stages.some(s => s.assignedTo.id === u.id)).length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* ADMIN CARD 3 — Controle Avançado das Etapas */}
      <div className="lg:col-span-2">
        <Card title="Controle Avançado das Etapas" icon={<Settings />}>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <XAxis dataKey="name" stroke="var(--text-muted-color)" />
                <YAxis yAxisId="left" orientation="left" stroke="var(--text-muted-color)" />
                <YAxis yAxisId="right" orientation="right" stroke="var(--text-muted-color)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(36, 36, 36, 0.8)',
                    borderColor: 'var(--border-dark)',
                    color: 'var(--text-dark)'
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="count" fill="#3b82f6" name="Qtd. Checklists" />
                <Bar yAxisId="right" dataKey="avgTime" fill="#10b981" name="Tempo Médio (h)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ADMIN CARD 4 — Histórico e Auditoria */}
      <div className="lg:col-span-2">
        <Card title="Histórico e Auditoria" icon={<History />}>
          <ul className="space-y-3 max-h-80 overflow-y-auto">
            <li className="text-sm">
              <span className="font-semibold text-primary">Carla Dias</span> criou o template "Template Revisão Final". <span className="text-text-muted-light dark:text-text-muted-dark text-xs"> - há 2 horas</span>
            </li>
            <li className="text-sm">
              <span className="font-semibold text-primary">Ana Silva</span> enviou a "Etapa 1" do curso "React Avançado". <span className="text-text-muted-light dark:text-text-muted-dark text-xs"> - há 5 horas</span>
            </li>
            <li className="text-sm">
              <span className="font-semibold text-primary">Bruno Costa</span> resolveu uma pendência no curso "Node.js". <span className="text-text-muted-light dark:text-text-muted-dark text-xs"> - há 1 dia</span>
            </li>
             <li className="text-sm">
              <span className="font-semibold text-primary">Carla Dias</span> atribuiu "Eduarda Lima" à Etapa 2. <span className="text-text-muted-light dark:text-text-muted-dark text-xs"> - há 2 dias</span>
            </li>
          </ul>
        </Card>
      </div>

    </div>
  );
};

export default AdminDashboard;

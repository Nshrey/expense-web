import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

import ProjectList from './components/ProjectList';
import ProjectScreen from './components/ProjectScreen';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [name, setName] = useState('');

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    amount: '',
    type: 'cash_out',
    party: '',
    category: '',
    payment_mode: 'cash',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    setProjects(data || []);
  };

  const fetchTransactions = async (projectId) => {
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('project_id', projectId)
      .order('date', { ascending: false });

    setTransactions(data || []);
  };

  const addProject = async () => {
    if (!name) return;

    await supabase.from('projects').insert([{ name }]);
    setName('');
    fetchProjects();
  };

  const openProject = (project) => {
    setSelectedProject(project);
    fetchTransactions(project.id);
  };

  const goBack = () => {
    setSelectedProject(null);
    setTransactions([]);
    setShowForm(false);
  };

  const addTransaction = async () => {
    if (!form.amount) return;

    await supabase.from('transactions').insert([
      {
        project_id: selectedProject.id,
        amount: Number(form.amount),
        type: form.type,
        party: form.party,
        category: form.category,
        payment_mode: form.payment_mode,
        notes: form.notes,
        date: form.date,
      },
    ]);

    setShowForm(false);

    // reset form
    setForm({
      amount: '',
      type: 'cash_out',
      party: '',
      category: '',
      payment_mode: 'cash',
      notes: '',
      date: new Date().toISOString().split('T')[0],
    });

    fetchTransactions(selectedProject.id);
  };

  // 🔥 TOTAL CALCULATIONS
  const totalIn = transactions
    .filter((t) => t.type === 'cash_in')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalOut = transactions
    .filter((t) => t.type === 'cash_out')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIn - totalOut;

  return (
    
    <div
  style={{
    padding: 20,
    background: darkMode ? '#121212' : '#ffffff',
    color: darkMode ? '#ffffff' : '#000000',
    minHeight: '100vh',
  }}
>
  <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      {!selectedProject ? (
        <ProjectList
          projects={projects}
          name={name}
          setName={setName}
          addProject={addProject}
          openProject={openProject}
        />
      ) : (
        <ProjectScreen
          selectedProject={selectedProject}
          goBack={goBack}
          showForm={showForm}
          setShowForm={setShowForm}
          form={form}
          setForm={setForm}
          addTransaction={addTransaction}
          transactions={transactions}
          totalIn={totalIn}
          totalOut={totalOut}
          balance={balance}
        />
      )}
    </div>
  );
}

export default App;
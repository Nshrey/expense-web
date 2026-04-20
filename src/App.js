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
    file: null, // 🔥 IMPORTANT
  });

  const theme = {
    background: darkMode ? '#121212' : '#ffffff',
    text: darkMode ? '#ffffff' : '#000000',
    card: darkMode ? '#1e1e1e' : '#fafafa',
    border: darkMode ? '#333' : '#ddd',
    input: darkMode ? '#2a2a2a' : '#ffffff',
  };

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
    setSelectedProject({ ...project });
    fetchTransactions(project.id);
  };

  const goBack = () => {
    setSelectedProject(null);
    setTransactions([]);
    setShowForm(false);
  };

  // 🔥 FINAL ADD TRANSACTION (WITH DEBUG)
  const addTransaction = async () => {
    console.log('FORM FILE:', form.file); // 👈 DEBUG

    if (!form.amount) return;

    let imageUrl = null;

    // 🔥 Upload image
    if (form.file) {
      const fileName = `${Date.now()}-${form.file.name}`;

      const { error } = await supabase.storage
        .from('bills')
        .upload(fileName, form.file);

      console.log('UPLOAD ERROR:', error); // 👈 DEBUG

      if (!error) {
        const { data } = supabase.storage
          .from('bills')
          .getPublicUrl(fileName);

        imageUrl = data.publicUrl;
        console.log('IMAGE URL:', imageUrl); // 👈 DEBUG
      }
    }

    // 🔥 Insert transaction
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
        image_url: imageUrl,
      },
    ]);

    setShowForm(false);

    // 🔥 Reset form
    setForm({
      amount: '',
      type: 'cash_out',
      party: '',
      category: '',
      payment_mode: 'cash',
      notes: '',
      date: new Date().toISOString().split('T')[0],
      file: null,
    });

    fetchTransactions(selectedProject.id);
  };

  // 🔥 TOTALS
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
        background: theme.background,
        color: theme.text,
        minHeight: '100vh',
      }}
    >
      <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

      {!selectedProject ? (
        <ProjectList
          theme={theme}
          projects={projects}
          name={name}
          setName={setName}
          addProject={addProject}
          openProject={openProject}
        />
      ) : (
        <ProjectScreen
          theme={theme}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          goBack={goBack}
          showForm={showForm}
          setShowForm={setShowForm}
          form={form}
          setForm={setForm}
          addTransaction={addTransaction}
          transactions={transactions}
          setTransactions={setTransactions}
          totalIn={totalIn}
          totalOut={totalOut}
          balance={balance}
        />
      )}

      {/* 🔥 FOOTER */}
      <div
        style={{
          marginTop: 40,
          textAlign: 'center',
          fontSize: 12,
          opacity: 0.6,
        }}
      >
        Created & Designed by Shrey
      </div>
    </div>
  );
}

export default App;
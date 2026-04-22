import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

import ProjectList from './components/ProjectList';
import ProjectScreen from './components/ProjectScreen';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });
  const [projects, setProjects] = useState([]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [name, setName] = useState('');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
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
  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

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
    if (!name.trim()) return;

    const exists = projects.some(
      (p) => p.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (exists) {
      alert('Project with this name already exists');
      return;
    }

    await supabase.from('projects').insert([{ name: name.trim() }]);

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
    if (!form.amount || saving) return;

    setSaving(true);

    let imageUrl = null;

    // Upload image (only if new file selected)
    if (form.file) {
      const fileName = `${Date.now()}-${form.file.name}`;

      const { error } = await supabase.storage
        .from('bills')
        .upload(fileName, form.file);

      if (!error) {
        const { data } = supabase.storage.from('bills').getPublicUrl(fileName);

        imageUrl = data.publicUrl;
      }
    }

    // 🧠 MAIN LOGIC
    if (editingTransaction) {
      // 🔥 UPDATE
      await supabase
        .from('transactions')
        .update({
          amount: Number(form.amount),
          type: form.type,
          party: form.party,
          category: form.category,
          payment_mode: form.payment_mode,
          notes: form.notes,
          date: form.date,
          time: form.time,
          image_url: imageUrl || editingTransaction.image_url,
        })
        .eq('id', editingTransaction.id);
    } else {
      // 🔥 INSERT
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
    }

    // Reset everything
    setEditingTransaction(null);
    setShowForm(false);

    setForm({
      amount: '',
      type: 'cash_out',
      party: '',
      category: '',
      payment_mode: 'cash',
      notes: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      file: null,
    });

    setSaving(false);

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
          saving={saving}
          editingTransaction={editingTransaction}
          setEditingTransaction={setEditingTransaction}
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

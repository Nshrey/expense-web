import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function App() {
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
  const totalIn = transactions
  .filter((t) => t.type === 'cash_in')
  .reduce((sum, t) => sum + Number(t.amount), 0);

const totalOut = transactions
  .filter((t) => t.type === 'cash_out')
  .reduce((sum, t) => sum + Number(t.amount), 0);

const balance = totalIn - totalOut;

  return (
    <div style={{ padding: 20 }}>
      {!selectedProject ? (
        <>
          <h1>Projects</h1>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter project name"
          />
          <button onClick={addProject}>Add</button>

          {projects.map((p) => (
            <div
              key={p.id}
              onClick={() => openProject(p)}
              style={{
                marginTop: 10,
                padding: 10,
                border: '1px solid #ccc',
                cursor: 'pointer',
              }}
            >
              {p.name}
            </div>
          ))}
        </>
      ) : (
        <>
          <button onClick={goBack}>⬅ Back</button>

          <h2>{selectedProject.name}</h2>

          <button onClick={() => setShowForm(true)}>
            + Add Transaction
          </button>

          {showForm && (
            <div
              style={{
                marginTop: 20,
                border: '1px solid #ccc',
                padding: 10,
              }}
            >
              <input
                placeholder="Amount"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: e.target.value })
                }
              />

              <br />

              <select
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value })
                }
              >
                <option value="cash_out">Cash Out</option>
                <option value="cash_in">Cash In</option>
              </select>

              <br />

              <input
                placeholder={
                  form.type === 'cash_in' ? 'From' : 'To'
                }
                value={form.party}
                onChange={(e) =>
                  setForm({ ...form, party: e.target.value })
                }
              />

              <br />

              <input
                placeholder="Category"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              />

              <br />

              <select
                value={form.payment_mode}
                onChange={(e) =>
                  setForm({
                    ...form,
                    payment_mode: e.target.value,
                  })
                }
              >
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
              </select>

              <br />

              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
              />

              <br />

              <textarea
                placeholder="Notes"
                value={form.notes}
                onChange={(e) =>
                  setForm({ ...form, notes: e.target.value })
                }
              />

              <br />

              <button onClick={addTransaction}>Save</button>
              <button onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <div style={{ marginTop: 20, padding: 10, border: '1px solid #000' }}>
  <div>💰 Cash In: ₹ {totalIn}</div>
  <div>💸 Cash Out: ₹ {totalOut}</div>
  <div>🧮 Balance: ₹ {balance}</div>
</div>
            </div>
          )}

          <h3>Transactions</h3>

          {transactions.length === 0 && <p>No transactions yet</p>}

          {transactions.map((t) => (
            <div
              key={t.id}
              style={{
                border: '1px solid #ddd',
                marginTop: 10,
                padding: 10,
              }}
            >
              <div>₹ {t.amount}</div>
              <div>{t.type}</div>
              <div>{t.category}</div>
              <div>{t.party}</div>
              <div>{t.payment_mode}</div>
              <div>{t.date}</div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default App;
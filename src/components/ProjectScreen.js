import { supabase } from '../supabaseClient';
import TransactionItem from './TransactionItem';
const inputStyle = (theme) => ({
  padding: 10,
  borderRadius: 6,
  border: `1px solid ${theme.border}`,
  background: theme.input,
  color: theme.text,
});


function ProjectScreen({
  
  selectedProject,
  setSelectedProject, // ⚠️ IMPORTANT
  goBack,
  showForm,
  setShowForm,
  form,
  setForm,
  addTransaction,
  transactions,
  setTransactions,
  totalIn,
  totalOut,
  balance,
  theme,
  saving,
  editingTransaction,
  setEditingTransaction
}) {

  const handleEdit = (t) => {
  setEditingTransaction(t);

  setForm({
    amount: t.amount,
    type: t.type,
    party: t.party,
    category: t.category,
    payment_mode: t.payment_mode,
    notes: t.notes,
    date: t.date,
    file: null,
  });

  setShowForm(true);
};
const exportToCSV = () => {
  if (!transactions.length) {
    alert('No data to export');
    return;
  }

  const headers = [
    'Date',
    'Type',
    'Amount',
    'Category',
    'Party',
    'Mode',
    'Notes',
  ];

  const rows = transactions.map((t) => [
    t.date,
    t.type,
    t.amount, // 👈 IMPORTANT: no formatting here
    t.category,
    t.party,
    t.payment_mode,
    t.notes,
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row.map((v) => `"${v ?? ''}"`).join(',')
    )
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${selectedProject.name}.csv`;
  a.click();
};
const formatINR = (value) => {
  if (!value) return '';
  const number = value.toString().replace(/,/g, '');
  if (isNaN(number)) return '';
  return Number(number).toLocaleString('en-IN');
};
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 10 }}>

      {/* 🔥 HEADER */}
      <div
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  }}
>
  {/* LEFT */}
  <button
    onClick={goBack}
    style={{
      background: 'transparent',
      border: 'none',
      fontSize: 18,
      cursor: 'pointer',
    }}
  >
    ←
  </button>

  {/* CENTER */}
  <h2 style={{ margin: 0 }}>{selectedProject.name}</h2>

  {/* RIGHT */}
  <div style={{ display: 'flex', gap: 10 }}>
    <button
      onClick={exportToCSV}
      style={{
        padding: '6px 12px',
        borderRadius: 6,
        border: 'none',
        background: '#4CAF50',
        color: '#fff',
        cursor: 'pointer',
      }}
    >
      Download
    </button>

    <button
      onClick={async () => {
        const newStatus =
          selectedProject.status === 'active'
            ? 'finished'
            : 'active';

        await supabase
          .from('projects')
          .update({ status: newStatus })
          .eq('id', selectedProject.id);

        setSelectedProject({
          ...selectedProject,
          status: newStatus,
        });
      }}
      style={{
        padding: '6px 12px',
        borderRadius: 6,
        border: 'none',
        background:
          selectedProject.status === 'active'
            ? '#f59e0b'
            : '#16a34a',
        color: '#fff',
        cursor: 'pointer',
      }}
    >
      {selectedProject.status === 'active'
        ? 'Finish'
        : 'Resume'}
    </button>
  </div>
</div>

      {/* 🔒 STATUS BUTTON */}
      

      {/* 🔥 TOTALS */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 10,
            textAlign: 'center',
            background:
              theme.background === '#121212'
                ? '#1f2a24'
                : '#e6f7ec',
          }}
        >
          <div style={{ fontSize: 12 }}>Cash In</div>
          <div style={{ fontWeight: 'bold', color: 'green' }}>
            ₹ {totalIn.toLocaleString('en-IN')}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 10,
            textAlign: 'center',
            background:
              theme.background === '#121212'
                ? '#2a1f1f'
                : '#fdeaea',
          }}
        >
          <div style={{ fontSize: 12 }}>Cash Out</div>
          <div style={{ fontWeight: 'bold', color: 'red' }}>
            ₹ {totalOut.toLocaleString('en-IN')}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 10,
            textAlign: 'center',
            background:
              theme.background === '#121212'
                ? '#1f2633'
                : '#e6f0ff',
          }}
        >
          <div style={{ fontSize: 12 }}>Balance</div>
          <div style={{ fontWeight: 'bold', color: '#007bff' }}>
            ₹ {balance.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* 🔥 TRANSACTIONS */}
      <h3 style={{ marginTop: 20, marginBottom: 10 }}>
        Transactions
      </h3>

      {transactions.length === 0 && <p>No transactions yet</p>}

      {transactions.map((t) => (
<TransactionItem
  key={t.id}
  t={t}
  theme={theme}
  setTransactions={setTransactions}
  onEdit={handleEdit} // ✅ ADD THIS
/>
      ))}

      {/* 🔥 FLOATING BUTTON */}
      <button
        onClick={() => {
  if (selectedProject.status === 'finished') {
    alert('Project is finished. Resume to add expenses.');
    return;
  }

  // 🔥 CLEAR EDIT STATE
  setEditingTransaction(null);

  // 🔥 RESET FORM
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

  setShowForm(true);
}}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: '#007bff',
          color: 'white',
          fontSize: 24,
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        }}
      >
        +
      </button>

      {/* 🔥 MODAL FORM (unchanged) */}
      {showForm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: theme.card,
              color: theme.text,
              padding: 24,
              borderRadius: 12,
              width: '90%',
              maxWidth: 400,
            }}
          >
            <h3 style={{ marginBottom: 15 }}>
              Add Transaction
            </h3>

            {/* (your existing form stays same here) */}
           <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

  {/* 🔥 AMOUNT */}
<input
  placeholder="Amount"
  value={formatINR(form.amount)}
  onChange={(e) => {
    const raw = e.target.value.replace(/,/g, '');

    if (!isNaN(raw)) {
      setForm({ ...form, amount: raw });
    }
  }}
  style={inputStyle(theme)}
/>

  {/* 🔥 CASH IN / OUT SWITCH */}
<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

  <span style={{ fontSize: 12 }}>Cash Out</span>

  <div
    onClick={() =>
      setForm({
        ...form,
        type: form.type === 'cash_out' ? 'cash_in' : 'cash_out',
      })
    }
    style={{
      width: 60,
      height: 28,
      borderRadius: 20,
      background: form.type === 'cash_in' ? '#4caf50' : '#ccc',
      display: 'flex',
      alignItems: 'center',
      padding: 3,
      cursor: 'pointer',
      transition: '0.3s',
    }}
  >
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: '50%',
        background: 'white',
        transform:
          form.type === 'cash_in'
            ? 'translateX(30px)'
            : 'translateX(0px)',
        transition: '0.3s',
      }}
    />
  </div>

  <span style={{ fontSize: 12 }}>Cash In</span>

</div>

  {/* 🔥 PARTY */}
  <input
    placeholder={form.type === 'cash_in' ? 'From' : 'To'}
    value={form.party}
    onChange={(e) =>
      setForm({ ...form, party: e.target.value })
    }
    style={inputStyle(theme)}
  />

  {/* 🔥 CATEGORY */}
  <input
    placeholder="Category"
    value={form.category}
    onChange={(e) =>
      setForm({ ...form, category: e.target.value })
    }
    style={inputStyle(theme)}
  />

  {/* 🔥 PAYMENT MODE */}
  <select
    value={form.payment_mode}
    onChange={(e) =>
      setForm({ ...form, payment_mode: e.target.value })
    }
    style={inputStyle(theme)}
  >
    <option value="cash">Cash</option>
    <option value="upi">UPI</option>
    <option value="bank">Bank</option>
  </select>

  {/* 🔥 DATE */}
  <input
    type="date"
    value={form.date}
    onChange={(e) =>
      setForm({ ...form, date: e.target.value })
    }
    style={inputStyle(theme)}
  />

  {/* 🔥 NOTES */}
  <textarea
    placeholder="Additional comments"
    value={form.notes}
    onChange={(e) =>
      setForm({ ...form, notes: e.target.value })
    }
    style={{
      ...inputStyle(theme),
      minHeight: 60,
    }}
  />

  {/* 🔥 IMAGE UPLOAD */}
  <input
    type="file"
    accept="image/*"
    onChange={(e) =>
      setForm({ ...form, file: e.target.files[0] })
    }
  />

  {/* 🔥 BUTTONS */}
  <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
    <button
      onClick={addTransaction}
      style={{
        flex: 1,
        padding: 10,
        background: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer',
      }}
    >
      {saving ? 'Saving...' : 'Save'}
    </button>

    <button
      onClick={() => setShowForm(false)}
      style={{
        flex: 1,
        padding: 10,
        background: '#ccc',
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer',
      }}
    >
      Cancel
    </button>
  </div>

</div> 

          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectScreen;
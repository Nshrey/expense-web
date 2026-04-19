import TransactionItem from './TransactionItem';

function ProjectScreen({
  selectedProject,
  goBack,
  showForm,
  setShowForm,
  form,
  setForm,
  addTransaction,
  transactions,
  totalIn,
  totalOut,
  balance,
}) {
  return (
    <>
      <button onClick={goBack}>⬅ Back</button>

      <h2>{selectedProject.name}</h2>

      {/* 🔥 Totals */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          marginTop: 20,
        }}
      >
        <div
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 10,
            background: '#e6f7ec',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 12 }}>Cash In</div>
          <div style={{ fontWeight: 'bold', color: 'green' }}>
            ₹ {totalIn}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 10,
            background: '#fdeaea',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 12 }}>Cash Out</div>
          <div style={{ fontWeight: 'bold', color: 'red' }}>
            ₹ {totalOut}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 10,
            background: '#e6f0ff',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 12 }}>Balance</div>
          <div style={{ fontWeight: 'bold', color: '#007bff' }}>
            ₹ {balance}
          </div>
        </div>
      </div>

      {/* 🔥 Form */}
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
        background: '#fff',
        padding: 20,
        borderRadius: 12,
        width: '90%',
        maxWidth: 400,
      }}
    >
      <h3>Add Transaction</h3>

      <input
        placeholder="Amount"
        value={form.amount}
        onChange={(e) =>
          setForm({ ...form, amount: e.target.value })
        }
        style={{ width: '100%', marginBottom: 10 }}
      />

      {/* Toggle */}
    <div
  style={{
    display: 'flex',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 15,
    border: '1px solid #ccc',
  }}
>
  <div
    onClick={() => setForm({ ...form, type: 'cash_out' })}
    style={{
      flex: 1,
      padding: 10,
      textAlign: 'center',
      cursor: 'pointer',
      background: form.type === 'cash_out' ? '#ff4d4d' : '#f0f0f0',
      color: form.type === 'cash_out' ? 'white' : 'black',
      transition: '0.2s',
    }}
  >
    Cash Out
  </div>

  <div
    onClick={() => setForm({ ...form, type: 'cash_in' })}
    style={{
      flex: 1,
      padding: 10,
      textAlign: 'center',
      cursor: 'pointer',
      background: form.type === 'cash_in' ? '#4CAF50' : '#f0f0f0',
      color: form.type === 'cash_in' ? 'white' : 'black',
      transition: '0.2s',
    }}
  >
    Cash In
  </div>
</div>

      <input
        placeholder={form.type === 'cash_in' ? 'From' : 'To'}
        value={form.party}
        onChange={(e) =>
          setForm({ ...form, party: e.target.value })
        }
        style={{ width: '100%', marginBottom: 10 }}
      />

      <input
        placeholder="Category"
        value={form.category}
        onChange={(e) =>
          setForm({ ...form, category: e.target.value })
        }
        style={{ width: '100%', marginBottom: 10 }}
      />

      <select
        value={form.payment_mode}
        onChange={(e) =>
          setForm({
            ...form,
            payment_mode: e.target.value,
          })
        }
        style={{ width: '100%', marginBottom: 10 }}
      >
        <option value="cash">Cash</option>
        <option value="upi">UPI</option>
      </select>

      <input
        type="date"
        value={form.date}
        onChange={(e) =>
          setForm({ ...form, date: e.target.value })
        }
        style={{ width: '100%', marginBottom: 10 }}
      />

      <textarea
        placeholder="Notes"
        value={form.notes}
        onChange={(e) =>
          setForm({ ...form, notes: e.target.value })
        }
        style={{ width: '100%', marginBottom: 10 }}
      />

      <div style={{ marginTop: 10 }}>
        <button onClick={addTransaction}>Save</button>
        <button
          onClick={() => setShowForm(false)}
          style={{ marginLeft: 10 }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

      <h3 style={{ marginTop: 20 }}>Transactions</h3>

      {transactions.length === 0 && <p>No transactions yet</p>}

      {transactions.map((t) => (
        <TransactionItem key={t.id} t={t} />
      ))}

      {/* 🔥 Floating Button */}
      <button
        onClick={() => setShowForm(true)}
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
    </>
  );
}

export default ProjectScreen;
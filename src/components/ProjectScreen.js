import { supabase } from '../supabaseClient';
import TransactionItem from './TransactionItem';

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
}) {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 10 }}>

      {/* 🔥 HEADER */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <button
          onClick={goBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: theme.text,
            fontSize: 20,
            cursor: 'pointer',
          }}
        >
          ←
        </button>

        <h2 style={{ margin: 0 }}>{selectedProject.name}</h2>

        <div style={{ width: 20 }} />
      </div>

      {/* 🔒 STATUS BUTTON */}
      <div style={{ marginBottom: 15 }}>
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

            // ✅ Update UI without reload
            setSelectedProject({
              ...selectedProject,
              status: newStatus,
            });
          }}
          style={{
            background:
              selectedProject.status === 'active'
                ? 'orange'
                : 'green',
            color: 'white',
            padding: '6px 12px',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          {selectedProject.status === 'active'
            ? 'Finish Project'
            : 'Resume Project'}
        </button>
      </div>

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
            ₹ {totalIn}
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
            ₹ {totalOut}
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
            ₹ {balance}
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
/>
      ))}

      {/* 🔥 FLOATING BUTTON */}
      <button
        onClick={() => {
          if (selectedProject.status === 'finished') {
            alert(
              'Project is finished. Resume to add expenses.'
            );
            return;
          }
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

          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectScreen;
import { supabase } from '../supabaseClient';

function TransactionItem({ t, theme, setTransactions, onEdit }){
  const isCashIn = t.type === 'cash_in';

  return (
    <div
  style={{
    borderRadius: 16,
    padding: 16,
    marginTop: 14,
    background: theme.card,
    color: theme.text,
    border: `1px solid ${theme.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    boxShadow:
      theme.background === '#121212'
        ? '0 4px 20px rgba(0,0,0,0.6)'
        : '0 4px 12px rgba(0,0,0,0.08)',
    transition: 'all 0.2s ease',
  }}
    onMouseEnter={(e) => {
  e.currentTarget.style.transform = 'translateY(-2px)';
}}
onMouseLeave={(e) => {
  e.currentTarget.style.transform = 'translateY(0px)';
}}
    >
      {/* LEFT SIDE */}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 'bold' }}>
          {t.category || 'No Category'}
        </div>

        <div style={{ marginTop: 4, fontSize: 12, opacity: 0.8 }}>
          {t.party || '-'}
        </div>

        <div style={{ marginTop: 4, fontSize: 12, opacity: 0.6 }}>
          {t.date} | {t.payment_mode}
        </div>

        {/* 🔥 IMAGE */}
        {t.image_url && (
          <img
            src={t.image_url}
            alt="bill"
            style={{
              width: 70,
              height: 70,
              objectFit: 'cover',
              borderRadius: 8,
              marginTop: 8,
              border: '1px solid #ccc',
            }}
          />
        )}
      </div>

      {/* RIGHT SIDE */}
      <div style={{ textAlign: 'right' }}>
        <div
          style={{
            fontWeight: 'bold',
            fontSize: 16,
            color: isCashIn ? 'green' : 'red',
          }}
        >
          {isCashIn ? '+' : '-'} ₹ {Number(t.amount).toLocaleString('en-IN')}
        </div>

        <div style={{ fontSize: 12, opacity: 0.7 }}>
          {isCashIn ? 'Cash In' : 'Cash Out'}
        </div>

        {/* 🔥 DELETE */}
       <div
  style={{
    display: 'flex',
    gap: 8,
    justifyContent: 'flex-end',
    marginTop: 8,
  }}
>
  {/* EDIT */}
  <button
    onClick={() => onEdit(t)}
    style={{
      background: theme.input,
      border: `1px solid ${theme.border}`,
      borderRadius: 6,
      padding: '4px 8px',
      cursor: 'pointer',
    }}
  >
    ✏️
  </button>

  {/* DELETE */}
  <button
    onClick={async () => {
      const confirmDelete = window.confirm('Delete this transaction?');
      if (!confirmDelete) return;

      await supabase
        .from('transactions')
        .delete()
        .eq('id', t.id);

      setTransactions((prev) =>
        prev.filter((item) => item.id !== t.id)
      );
    }}
    style={{
      background: '#ffe5e5',
      border: 'none',
      borderRadius: 6,
      padding: '4px 8px',
      color: 'red',
      cursor: 'pointer',
    }}
  >
    🗑
  </button>
</div>
      </div>
    </div>
  );
}

export default TransactionItem;
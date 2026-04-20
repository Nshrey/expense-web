import { supabase } from '../supabaseClient';

function TransactionItem({ t, theme, setTransactions }) {
  const isCashIn = t.type === 'cash_in';

  return (
    <div
      style={{
        borderRadius: 12,
        padding: 14,
        marginTop: 12,
        background: theme.card,
        color: theme.text,
        border: `1px solid ${theme.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        transition: '0.2s',
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background =
          theme.background === '#121212'
            ? '#2a2a2a'
            : '#f0f0f0')
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = theme.card)
      }
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
          {isCashIn ? '+' : '-'} ₹ {t.amount}
        </div>

        <div style={{ fontSize: 12, opacity: 0.7 }}>
          {isCashIn ? 'Cash In' : 'Cash Out'}
        </div>

        {/* 🔥 DELETE */}
        <button
          onClick={async () => {
            const confirmDelete = window.confirm(
              'Delete this transaction?'
            );
            if (!confirmDelete) return;

            await supabase
              .from('transactions')
              .delete()
              .eq('id', t.id);

            // ✅ update UI without reload
            setTransactions((prev) =>
              prev.filter((item) => item.id !== t.id)
            );
          }}
          style={{
            marginTop: 6,
            background: 'transparent',
            border: 'none',
            color: 'red',
            cursor: 'pointer',
            fontSize: 12,
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TransactionItem;
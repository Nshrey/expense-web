function TransactionItem({ t }) {
  const isCashIn = t.type === 'cash_in';

  return (
<div
  style={{
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    background: '#fafafa',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: '0.2s',
  }}
  onMouseEnter={(e) =>
    (e.currentTarget.style.background = '#f0f0f0')
  }
  onMouseLeave={(e) =>
    (e.currentTarget.style.background = '#fafafa')
  }
>
      {/* Left */}
      <div>
        <div style={{ fontWeight: 'bold' }}>
          {t.category || 'No Category'}
        </div>

        <div style={{ marginTop: 4, fontSize: 12, color: '#555' }}>
  {t.party || '-'}
</div>

<div style={{ marginTop: 4, fontSize: 12, color: '#777' }}>
  {t.date} | {t.payment_mode}
</div>
      </div>

      {/* Right */}
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

        <div style={{ fontSize: 12 }}>
          {isCashIn ? 'Cash In' : 'Cash Out'}
        </div>
      </div>
    </div>
  );
}

export default TransactionItem;
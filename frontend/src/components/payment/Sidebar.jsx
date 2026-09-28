export default function Sidebar({ active, setActive }) {
  const items = [
    { id: "UPI", label: "UPI" },
    { id: "CARD", label: "Debit / Credit Card" },
    { id: "WALLET", label: "Wallets" },
    { id: "REDEEM", label: "Redeem Points" }
  ];

  return (
    <div style={box}>
      {items.map(i => (
        <div
          key={i.id}
          onClick={() => setActive(i.id)}
          style={{
            ...item,
            border: active === i.id ? "1px solid var(--accent-primary)" : "1px solid transparent",
            color: active === i.id ? "var(--text-primary)" : "var(--text-secondary)"
          }}
        >
          {i.label}
        </div>
      ))}
    </div>
  );
}

const box = {
  background: "var(--bg-secondary)",
  borderRadius: 14,
  padding: 15
};

const item = {
  padding: "14px",
  marginBottom: 10,
  cursor: "pointer",
  borderRadius: 10,
  background: "var(--bg-input)",
  color: "var(--text-secondary)"
};

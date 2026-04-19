function ThemeToggle({ darkMode, setDarkMode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          padding: '8px 12px',
          cursor: 'pointer',
        }}
      >
        {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
      </button>
    </div>
  );
}

export default ThemeToggle;
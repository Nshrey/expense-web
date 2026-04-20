function ThemeToggle({ darkMode, setDarkMode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        onClick={() => setDarkMode(!darkMode)}
        style={{
          width: 60,
          height: 30,
          borderRadius: 20,
          background: darkMode ? '#333' : '#ddd',
          display: 'flex',
          alignItems: 'center',
          padding: 4,
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
            transform: darkMode
              ? 'translateX(28px)'
              : 'translateX(0px)',
            transition: '0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
          }}
        >
          {darkMode ? '🌙' : '☀️'}
        </div>
      </div>
    </div>
  );
}

export default ThemeToggle;
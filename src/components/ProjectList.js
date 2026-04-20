import { supabase } from '../supabaseClient';

function ProjectList({
  projects,
  name,
  setName,
  addProject,
  openProject,
  theme,
}) {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 12 }}>

      {/* 🔥 HEADER */}
      <h1 style={{ marginBottom: 20 }}>Projects</h1>

      {/* 🔥 ADD PROJECT */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          marginBottom: 20,
        }}
      >
        <input
          placeholder="Enter project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            flex: 1,
            padding: 10,
            background: theme.input,
            color: theme.text,
            border: `1px solid ${theme.border}`,
            borderRadius: 6,
          }}
        />

        <button
          onClick={addProject}
          style={{
            padding: '10px 16px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Add
        </button>
      </div>

      {/* 🔥 PROJECT LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {projects.length === 0 && (
          <p style={{ opacity: 0.6 }}>No projects yet</p>
        )}

        {projects.map((project) => (
          <div
            key={project.id}
            style={{
              padding: 14,
              borderRadius: 10,
              background: theme.card,
              color: theme.text,
              border: `1px solid ${theme.border}`,
              cursor: 'pointer',
              transition: '0.2s',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
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
            {/* 🔥 LEFT: OPEN PROJECT */}
            <div
              onClick={() => openProject(project)}
              style={{ flex: 1, fontWeight: 'bold' }}
            >
              {project.name}
            </div>

            {/* 🔥 RIGHT: DELETE */}
            <button
              onClick={async (e) => {
                e.stopPropagation();

                const confirmDelete = window.confirm(
                  'Delete this project?'
                );
                if (!confirmDelete) return;

                await supabase
                  .from('projects')
                  .delete()
                  .eq('id', project.id);

                window.location.reload();
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'red',
                cursor: 'pointer',
                fontSize: 16,
              }}
            >
              🗑
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectList;
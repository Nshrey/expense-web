function ProjectList({ projects, name, setName, addProject, openProject }) {
  return (
    <>
      <h1>Projects</h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter project name"
      />
      <button onClick={addProject}>Add</button>

      {projects.map((p) => (
        <div
          key={p.id}
          onClick={() => openProject(p)}
          style={{
            marginTop: 10,
            padding: 10,
            border: '1px solid #ccc',
            cursor: 'pointer',
          }}
        >
          {p.name}
        </div>
      ))}
    </>
  );
}

export default ProjectList;
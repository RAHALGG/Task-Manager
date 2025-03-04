
const [projects, setProjects] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/projects');
      setProjects(response.data);
    } catch (error) {
      setError('حدث خطأ أثناء جلب المشاريع');
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchProjects();
}, []);

// في جزء العرض (render)
return (
  <div>
    {loading && <p>جاري التحميل...</p>}
    {error && <p className="error-message">{error}</p>}
    {!loading && !error && (
      // عرض قائمة المشاريع هنا
      <ul>
        {projects.map((project) => (
          <li key={project._id}>
            <Link to={`/projects/${project._id}`}>{project.title}</Link>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const [tasks, setTasks] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/projects/${projectId}/tasks`);
      setTasks(response.data);
    } catch (error) {
      setError('حدث خطأ أثناء جلب المهام');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchTasks();
}, [projectId]);

// في جزء العرض (render)
return (
  <div>
    {loading && <p>جاري تحميل المهام...</p>}
    {error && <p className="error-message">{error}</p>}
    {!loading && !error && (
      // عرض المهام هنا
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    )}
  </div>
);
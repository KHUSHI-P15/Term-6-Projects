// In-memory data store for simulation submissions.
// Replace this module with MongoDB model operations later.
const submissions = [];

export const addSubmission = (payload) => {
  const record = {
    id: Date.now().toString(),
    username: payload.username,
    password: payload.password,
    submittedAt: new Date().toISOString(),
    source: payload.source || "web"
  };

  submissions.push(record);
  return record;
};

export const getAllSubmissions = () => {
  return [...submissions].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
};

export const getAnalytics = () => {
  const all = getAllSubmissions();

  return {
    totalSubmissions: all.length,
    lastSubmissionAt: all.length ? all[0].submittedAt : null,
    recentSubmissions: all.slice(0, 5).map((item) => ({
      id: item.id,
      username: item.username,
      submittedAt: item.submittedAt,
      source: item.source
    }))
  };
};

import React, { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'

const top = () => {
    const [task, setTask] = useState('')
    const [array, setArray] = useState([])
    const [editId, setEditId] = useState(null);
    const [editText, setEditText] = useState("");
    const [Search, setSearch] = useState("")
    const [filter, setFilter] = useState("all");
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    useEffect(() => {
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    // ── LOGOUT ──
    const handleLogout = async () => {
        try {
            await axios.post("https://to-do-app-full-stack-6jto.onrender.com/api/auth/logout", {}, {
                withCredentials: true,
            });
        } catch (error) {
            console.error("Logout error:", error);
        }
        localStorage.removeItem("token");
        localStorage.removeItem("darkMode");
        window.location.href = "/login";
    };

    // ── ALL YOUR ORIGINAL LOGIC UNCHANGED ──
   const handleForm = async (e) => {
  e.preventDefault();
  if (!task.trim()) return;

  try {
    const res = await axios.post(
      "https://to-do-app-full-stack-6jto.onrender.com/api/todos",
      { title: task },
      { withCredentials: true }
    );

    // ✅ backend se real todo aayega (with _id)
    setArray([...array, res.data]);

    setTask("");
  } catch (error) {
    console.error("Error adding todo:", error);
  }
};

    useEffect(() => {
        const fetchData = async () => {
            try {
                await axios.get("https://to-do-app-full-stack-6jto.onrender.com/api/todos", { withCredentials: true }).then((res) => {
                    let newArray = [...array]
                    res.data.map((item) => { newArray.push(item) })
                    setArray(newArray)
                })
            } catch (error) {
                console.error("Error fetching todos:", error);
            }
        };
        fetchData();
    }, [])

    async function handleDelete(e, id) {
        e.preventDefault();
        try {
            await axios.delete(`https://to-do-app-full-stack-6jto.onrender.com/api/todos/${id}`, { withCredentials: true });
            let newArray = array.filter((item) => item._id !== id);
            setArray(newArray);
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    }

    async function toggleComplete(id) {
        try {
            const response = await axios.put(`https://to-do-app-full-stack-6jto.onrender.com/api/todos/${id}/toggle`, {}, { withCredentials: true });
            const updatedTodo = response.data;
            let newArray = array.map((item) => {
                if (item._id === response.data._id) return { ...item, completed: updatedTodo.completed };
                return item;
            });
            setArray(newArray);
        } catch (error) {
            console.error("Error toggling todo:", error);
        }
    }

    function updateTodo(item) {
        setEditId(item._id);
        setEditText(item.title);
    }

    async function handleUpdate(e, id) {
        e.preventDefault();
        try {
            const response = await axios.put(`https://to-do-app-full-stack-6jto.onrender.com/api/todos/${id}`, { title: editText }, { withCredentials: true });
            const updatedTodo = response.data;
            let newArray = array.map((item) => {
                if (item._id === response.data._id) return { ...item, title: updatedTodo.title };
                return item;
            });
            setArray(newArray);
            setEditId(null);
            setEditText("");
        } catch (error) {
            console.error("Error updating todo:", error);
        }
    }

    async function handleSearch(e) {
        e.preventDefault();
        try {
            if (!Search.trim()) {
                const response = await axios.get("https://to-do-app-full-stack-6jto.onrender.com/api/todos", { withCredentials: true });
                setArray(response.data);
                return;
            }
            const filteredTodos = array.filter(item =>
                item.title.toLowerCase().includes(Search.toLowerCase())
            );
            setArray(filteredTodos);
        } catch (error) {
            console.error("Error searching todos:", error);
        }
    }

    const filteredTodos = array.filter((item) => {
        if (filter === "completed") return item.completed;
        if (filter === "pending") return !item.completed;
        return true;
    });

    const d = darkMode;

    return (
        <div style={{
            minHeight: "100vh",
            background: d ? "#0f0f13" : "#eef0f7",
            fontFamily: "'DM Sans', sans-serif",
            transition: "background 0.25s"
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }

                .app-wrapper {
                    max-width: 680px;
                    margin: 0 auto;
                    padding: 24px 16px;
                }

                /* ── Topbar ── */
                .topbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: ${d ? "#1a1a24" : "#fff"};
                    border-radius: 16px;
                    padding: 12px 20px;
                    margin-bottom: 12px;
                    box-shadow: 0 2px 16px rgba(0,0,0,${d ? "0.3" : "0.06"});
                    border: 1px solid ${d ? "#2a2a3a" : "transparent"};
                }

                .topbar-left {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .brand-icon {
                    width: 36px; height: 36px;
                    background: linear-gradient(135deg, #6c63ff, #8b5cf6);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .brand-icon svg { width: 18px; height: 18px; fill: #fff; }

                .brand-name {
                    font-size: 0.95rem;
                    font-weight: 700;
                    color: ${d ? "#e2e2ff" : "#111"};
                    letter-spacing: -0.01em;
                }

                .topbar-right {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                /* Toggle */
                .toggle-wrap {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    cursor: pointer;
                }
                .toggle-label {
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: ${d ? "#666" : "#aaa"};
                }
                .toggle-track {
                    width: 40px; height: 22px;
                    background: ${d ? "#6c63ff" : "#ddd"};
                    border-radius: 999px;
                    position: relative;
                    border: none;
                    cursor: pointer;
                    outline: none;
                    transition: background 0.25s;
                    flex-shrink: 0;
                }
                .toggle-thumb {
                    position: absolute;
                    top: 3px;
                    left: ${d ? "20px" : "3px"};
                    width: 16px; height: 16px;
                    background: #fff;
                    border-radius: 50%;
                    transition: left 0.25s;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
                }

                /* Logout */
                .btn-logout {
                    padding: 6px 14px;
                    background: transparent;
                    color: ${d ? "#f87171" : "#dc2626"};
                    border: 1.5px solid ${d ? "#3a2020" : "#fecaca"};
                    border-radius: 8px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.78rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.15s, transform 0.1s;
                    white-space: nowrap;
                }
                .btn-logout:hover { background: ${d ? "#2a1515" : "#fff5f5"}; }
                .btn-logout:active { transform: scale(0.97); }

                /* ── Filter card ── */
                .filter-card {
                    background: ${d ? "#1a1a24" : "#fff"};
                    border-radius: 14px;
                    padding: 6px;
                    margin-bottom: 12px;
                    box-shadow: 0 2px 16px rgba(0,0,0,${d ? "0.3" : "0.06"});
                    border: 1px solid ${d ? "#2a2a3a" : "transparent"};
                    display: flex;
                    gap: 4px;
                }

                .filter-btn {
                    flex: 1;
                    padding: 8px 0;
                    border: none;
                    background: transparent;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.82rem;
                    font-weight: 500;
                    color: ${d ? "#666" : "#aaa"};
                    cursor: pointer;
                    border-radius: 9px;
                    transition: all 0.18s ease;
                }
                .filter-btn:hover {
                    color: ${d ? "#ccc" : "#555"};
                    background: ${d ? "#22222f" : "#f5f5f5"};
                }
                .active-all       { background: ${d ? "#1e1b3a" : "#f0eeff"} !important; color: #6c63ff !important; font-weight: 600; }
                .active-completed { background: ${d ? "#0f2a1a" : "#f0fdf4"} !important; color: #16a34a !important; font-weight: 600; }
                .active-pending   { background: ${d ? "#2a1f0a" : "#fffbeb"} !important; color: #d97706 !important; font-weight: 600; }

                /* ── Input card ── */
                .input-card {
                    background: ${d ? "#1a1a24" : "#fff"};
                    border-radius: 14px;
                    padding: 16px;
                    margin-bottom: 12px;
                    box-shadow: 0 2px 16px rgba(0,0,0,${d ? "0.3" : "0.06"});
                    border: 1px solid ${d ? "#2a2a3a" : "transparent"};
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .input-group {
                    display: flex;
                    gap: 8px;
                    align-items: center;
                    width: 100%;
                }

                .input-field {
                    flex: 1;
                    padding: 10px 14px;
                    border: 1.5px solid ${d ? "#2a2a3a" : "#ececec"};
                    border-radius: 10px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.875rem;
                    color: ${d ? "#e2e2ff" : "#111"};
                    background: ${d ? "#0f0f13" : "#f7f8fc"};
                    outline: none;
                    transition: border-color 0.18s, box-shadow 0.18s;
                    min-width: 0;
                }
                .input-field::placeholder { color: ${d ? "#444" : "#bbb"}; }
                .input-field:focus {
                    border-color: #6c63ff;
                    background: ${d ? "#1a1a24" : "#fff"};
                    box-shadow: 0 0 0 3px rgba(108,99,255,0.12);
                }

                .btn-add {
                    padding: 10px 18px;
                    background: linear-gradient(135deg, #6c63ff, #8b5cf6);
                    color: #fff;
                    border: none;
                    border-radius: 10px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.875rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: opacity 0.15s, transform 0.1s;
                    white-space: nowrap;
                    flex-shrink: 0;
                }
                .btn-add:hover { opacity: 0.9; }
                .btn-add:active { transform: scale(0.97); }

                .btn-search {
                    padding: 10px 18px;
                    background: transparent;
                    color: #6c63ff;
                    border: 1.5px solid ${d ? "#3a3060" : "#d4d0ff"};
                    border-radius: 10px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.875rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.15s, transform 0.1s;
                    white-space: nowrap;
                    flex-shrink: 0;
                }
                .btn-search:hover { background: ${d ? "#1e1b3a" : "#f0eeff"}; }
                .btn-search:active { transform: scale(0.97); }

                /* ── Todo list ── */
                .todo-list-card {
                    background: ${d ? "#1a1a24" : "#fff"};
                    border-radius: 14px;
                    padding: 8px;
                    box-shadow: 0 2px 16px rgba(0,0,0,${d ? "0.3" : "0.06"});
                    border: 1px solid ${d ? "#2a2a3a" : "transparent"};
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .todo-card {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 10px;
                    border-radius: 10px;
                    gap: 8px;
                    transition: background 0.15s;
                }
                .todo-card:hover { background: ${d ? "#22222f" : "#f7f8fc"}; }

                .todo-left {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    flex: 1;
                    min-width: 0;
                }

                .todo-index {
                    font-family: 'DM Mono', monospace;
                    font-size: 0.7rem;
                    color: ${d ? "#444" : "#ccc"};
                    min-width: 16px;
                    flex-shrink: 0;
                }

                .todo-title {
                    font-size: 0.875rem;
                    color: ${d ? "#e2e2ff" : "#222"};
                    font-weight: 400;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .todo-completed .todo-title {
                    text-decoration: line-through;
                    color: ${d ? "#444" : "#bbb"};
                }

                .edit-input {
                    padding: 7px 10px;
                    border: 1.5px solid #6c63ff;
                    border-radius: 8px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.85rem;
                    color: ${d ? "#e2e2ff" : "#111"};
                    background: ${d ? "#0f0f13" : "#f7f8fc"};
                    outline: none;
                    flex: 1;
                    min-width: 0;
                    box-shadow: 0 0 0 3px rgba(108,99,255,0.1);
                }

                .todo-actions {
                    display: flex;
                    gap: 5px;
                    align-items: center;
                    flex-shrink: 0;
                }

                .custom-checkbox {
                    width: 15px; height: 15px;
                    accent-color: #6c63ff;
                    cursor: pointer;
                    flex-shrink: 0;
                }

                .btn-save {
                    padding: 5px 12px;
                    background: #16a34a;
                    color: #fff;
                    border: none;
                    border-radius: 7px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.78rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: opacity 0.15s, transform 0.1s;
                    white-space: nowrap;
                    flex-shrink: 0;
                }
                .btn-save:hover { opacity: 0.88; }
                .btn-save:active { transform: scale(0.97); }

                .btn-edit {
                    padding: 5px 12px;
                    background: ${d ? "#1e1b3a" : "#f0eeff"};
                    color: #6c63ff;
                    border: none;
                    border-radius: 7px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.78rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.15s, transform 0.1s;
                    white-space: nowrap;
                }
                .btn-edit:hover { background: ${d ? "#2a2550" : "#e4e0ff"}; }
                .btn-edit:active { transform: scale(0.97); }

                .btn-delete {
                    padding: 5px 12px;
                    background: ${d ? "#1a1010" : "#fff0f0"};
                    color: ${d ? "#555" : "#ccc"};
                    border: none;
                    border-radius: 7px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 0.78rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.15s, color 0.15s, transform 0.1s;
                    white-space: nowrap;
                }
                .btn-delete:hover { background: ${d ? "#2a1515" : "#fee2e2"}; color: #dc2626; }
                .btn-delete:active { transform: scale(0.97); }

                .todo-separator {
                    height: 1px;
                    background: ${d ? "#222" : "#f3f3f3"};
                    margin: 0 4px;
                }

                .empty-state {
                    text-align: center;
                    padding: 40px 0;
                    color: ${d ? "#444" : "#ccc"};
                    font-size: 0.875rem;
                }

                /* ── Mobile responsive ── */
                @media (max-width: 480px) {
                    .app-wrapper { padding: 12px 10px; }

                    .topbar { padding: 10px 14px; border-radius: 12px; }
                    .brand-name { font-size: 0.85rem; }
                    .toggle-label { display: none; }
                    .btn-logout { padding: 5px 10px; font-size: 0.72rem; }

                    .filter-btn { font-size: 0.75rem; padding: 7px 0; }

                    .input-card { padding: 12px; }
                    .input-field { font-size: 0.82rem; padding: 9px 10px; }
                    .btn-add, .btn-search { padding: 9px 12px; font-size: 0.8rem; }

                    .todo-card { padding: 8px 6px; }
                    .todo-title { font-size: 0.82rem; }
                    .btn-edit, .btn-delete, .btn-save { padding: 4px 8px; font-size: 0.72rem; }

                    .edit-input { font-size: 0.8rem; padding: 6px 8px; }
                }
            `}</style>

            <div className="app-wrapper">

                {/* ── Topbar with dark mode + logout ── */}
                <div className="topbar">
                    <div className="topbar-left">
                        <div className="brand-icon">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2zm-1 13.5l-3.5-3.5 1.41-1.41L11 12.67l5.09-5.09L17.5 9 11 15.5z"/>
                            </svg>
                        </div>
                        <span className="brand-name">My Tasks</span>
                    </div>

                    <div className="topbar-right">
                        <div className="toggle-wrap" onClick={() => setDarkMode(!darkMode)}>
                            <span className="toggle-label">{d ? "Dark" : "Light"}</span>
                            <button className="toggle-track">
                                <div className="toggle-thumb" />
                            </button>
                        </div>
                        <button className="btn-logout" onClick={handleLogout}>
                            Log out
                        </button>
                    </div>
                </div>

                {/* ── Filter Tabs ── */}
                <div className="filter-card">
                    <button onClick={() => setFilter("all")} className={`filter-btn ${filter === "all" ? "active-all" : ""}`}>All</button>
                    <button onClick={() => setFilter("completed")} className={`filter-btn ${filter === "completed" ? "active-completed" : ""}`}>Completed</button>
                    <button onClick={() => setFilter("pending")} className={`filter-btn ${filter === "pending" ? "active-pending" : ""}`}>Pending</button>
                </div>

                {/* ── Add & Search ── */}
                <div className="input-card">
                    <form action="" style={{width: "100%"}}>
                        <div className="input-group">
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Add a new task..."
                                value={task}
                                onChange={(e) => setTask(e.target.value)}
                            />
                            <button className="btn-add" onClick={(e) => handleForm(e)}>+ Add</button>
                        </div>
                    </form>
                    <form action="" style={{width: "100%"}}>
                        <div className="input-group">
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Search tasks..."
                                value={Search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button className="btn-search" onClick={(e) => handleSearch(e)}>Search</button>
                        </div>
                    </form>
                </div>

                {/* ── Todo List ── */}
                <div className="todo-list-card">
                    {filteredTodos.length === 0 && (
                        <div className="empty-state">No tasks found.</div>
                    )}
                    {filteredTodos.map((item, index) => (
                        <div key={item._id}>
                            <div className={`todo-card ${item.completed ? "todo-completed" : ""}`}>
                                <div className="todo-left">
                                    <span className="todo-index">{index + 1}</span>
                                    {editId === item._id ? (
                                        <form action="" style={{flex: 1, minWidth: 0}}>
                                            <div className="input-group">
                                                <input
                                                    value={editText}
                                                    onChange={(e) => setEditText(e.target.value)}
                                                    className="edit-input"
                                                />
                                                <button className="btn-save" onClick={(e) => handleUpdate(e, item._id)}>Save</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <span className="todo-title">{item.title}</span>
                                    )}
                                </div>
                                <div className="todo-actions">
                                    <input
                                        type="checkbox"
                                        checked={item.completed}
                                        onChange={() => toggleComplete(item._id)}
                                        className="custom-checkbox"
                                    />
                                    <button className="btn-edit" onClick={() => updateTodo(item)}>Edit</button>
                                    <button className="btn-delete" onClick={(e) => handleDelete(e, item._id)}>Delete</button>
                                </div>
                            </div>
                            {index < filteredTodos.length - 1 && <div className="todo-separator" />}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default top
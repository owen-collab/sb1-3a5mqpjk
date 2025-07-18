import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Récupérer toutes les tâches au chargement
  useEffect(() => {
    fetchTasks()
  }, [])

  // Fonction pour récupérer les tâches
  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('id', { ascending: true })

      if (error) {
        throw error
      }

      setTasks(data || [])
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches:', error)
      setError('Erreur lors du chargement des tâches')
    } finally {
      setLoading(false)
    }
  }

  // Fonction pour ajouter une nouvelle tâche
  const addTask = async (e) => {
    e.preventDefault()
    
    if (!newTask.trim()) {
      return
    }

    try {
      setError(null)
      
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          { title: newTask.trim(), completed: false }
        ])
        .select()

      if (error) {
        throw error
      }

      // Ajouter la nouvelle tâche à la liste
      if (data && data.length > 0) {
        setTasks([...tasks, data[0]])
      }
      
      setNewTask('')
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la tâche:', error)
      setError('Erreur lors de l\'ajout de la tâche')
    }
  }

  // Fonction pour marquer une tâche comme complétée/non complétée
  const toggleTask = async (id, completed) => {
    try {
      setError(null)
      
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !completed })
        .eq('id', id)

      if (error) {
        throw error
      }

      // Mettre à jour la tâche dans la liste locale
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, completed: !completed } : task
      ))
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error)
      setError('Erreur lors de la mise à jour de la tâche')
    }
  }

  // Fonction pour supprimer une tâche
  const deleteTask = async (id) => {
    try {
      setError(null)
      
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      // Supprimer la tâche de la liste locale
      setTasks(tasks.filter(task => task.id !== id))
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error)
      setError('Erreur lors de la suppression de la tâche')
    }
  }

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Chargement des tâches...</div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="container">
        <h1>📝 Gestionnaire de Tâches</h1>
        <p className="subtitle">Connecté à Supabase</p>

        {error && (
          <div className="error">
            {error}
            <button onClick={fetchTasks} className="retry-btn">
              Réessayer
            </button>
          </div>
        )}

        {/* Formulaire d'ajout de tâche */}
        <form onSubmit={addTask} className="add-task-form">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Ajouter une nouvelle tâche..."
            className="task-input"
          />
          <button type="submit" className="add-btn">
            Ajouter
          </button>
        </form>

        {/* Liste des tâches */}
        <div className="tasks-container">
          <h2>Mes Tâches ({tasks.length})</h2>
          
          {tasks.length === 0 ? (
            <div className="no-tasks">
              <p>Aucune tâche pour le moment</p>
              <p>Ajoutez votre première tâche ci-dessus !</p>
            </div>
          ) : (
            <ul className="tasks-list">
              {tasks.map((task) => (
                <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <div className="task-content">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id, task.completed)}
                      className="task-checkbox"
                    />
                    <span className="task-title">{task.title}</span>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="delete-btn"
                    title="Supprimer la tâche"
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Statistiques */}
        <div className="stats">
          <div className="stat">
            <span className="stat-number">{tasks.filter(t => !t.completed).length}</span>
            <span className="stat-label">À faire</span>
          </div>
          <div className="stat">
            <span className="stat-number">{tasks.filter(t => t.completed).length}</span>
            <span className="stat-label">Terminées</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
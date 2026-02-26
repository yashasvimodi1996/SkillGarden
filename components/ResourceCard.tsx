'use client';

import { useOptimistic, useState } from 'react';

interface ResourceCardProps {
  resource: any;
  onStatusChange?: (resourceId: string, status: string) => void;
  onFeedback?: (resourceId: string, feedback: 'up' | 'down' | null) => void;
  onSave?: (resourceId: string, saved: boolean) => void;
}

export function ResourceCard({
  resource,
  onStatusChange,
  onFeedback,
  onSave,
}: ResourceCardProps) {
  const [isSaved, setIsSaved] = useState(resource.isSaved || false);
  const [feedback, setFeedback] = useState(resource.feedback || null);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return '📺';
      case 'article':
        return '📖';
      case 'community':
        return '👥';
      default:
        return '📚';
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'beginner':
        return { color: 'bg-green-100 text-green-800', label: '🌱 Beginner' };
      case 'intermediate':
        return { color: 'bg-blue-100 text-blue-800', label: '🌿 Intermediate' };
      case 'advanced':
        return { color: 'bg-purple-100 text-purple-800', label: '🌳 Advanced' };
      default:
        return { color: 'bg-gray-100 text-gray-800', label: level };
    }
  };

  const handleSave = async () => {
    const newSaved = !isSaved;
    setIsSaved(newSaved);

    try {
      await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId: resource.id,
          saved: newSaved,
        }),
      });
      onSave?.(resource.id, newSaved);
    } catch (error) {
      console.error('Failed to save resource:', error);
      setIsSaved(!newSaved);
    }
  };

  const handleFeedback = async (newFeedback: 'up' | 'down' | null) => {
    if (feedback === newFeedback) {
      setFeedback(null);
      newFeedback = null;
    } else {
      setFeedback(newFeedback);
    }

    try {
      await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId: resource.id,
          feedback: newFeedback,
        }),
      });
      onFeedback?.(resource.id, newFeedback);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  const handleStatusChange = async (status: string) => {
    try {
      await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId: resource.id,
          status,
        }),
      });
      onStatusChange?.(resource.id, status);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const levelBadge = getLevelBadge(resource.level);

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <span className="text-2xl">{getTypeIcon(resource.type)}</span>
        <button
          onClick={handleSave}
          className={`text-xl ${isSaved ? 'text-red-500' : 'text-gray-300'} hover:scale-110 transition-transform`}
        >
          ❤️
        </button>
      </div>

      <h3 className="text-lg font-bold mb-2 line-clamp-2">{resource.title}</h3>

      {resource.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{resource.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${levelBadge.color}`}>
          {levelBadge.label}
        </span>
        {resource.timeMinutes && (
          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
            ⏱️ {resource.timeMinutes} min
          </span>
        )}
        {resource.source && (
          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
            {resource.source}
          </span>
        )}
      </div>

      {resource.tags && resource.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {resource.tags.slice(0, 3).map((tag: any) => (
            <span
              key={tag.id}
              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
            >
              #{tag.tag.name}
            </span>
          ))}
          {resource.tags.length > 3 && (
            <span className="text-xs text-gray-500">+{resource.tags.length - 3}</span>
          )}
        </div>
      )}

      <div className="flex gap-2 mb-3">
        <button
          onClick={() => handleFeedback('up')}
          className={`text-sm px-2 py-1 rounded ${
            feedback === 'up' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          }`}
        >
          👍 Helpful
        </button>
        <button
          onClick={() => handleFeedback('down')}
          className={`text-sm px-2 py-1 rounded ${
            feedback === 'down' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'
          }`}
        >
          👎 Not helpful
        </button>
      </div>

      <div className="flex gap-2">
        <select
          value={resource.status || 'not-started'}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
        >
          <option value="not-started">Not Started</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Completed ✓</option>
        </select>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-sm px-4 py-1 whitespace-nowrap"
        >
          Open →
        </a>
      </div>
    </div>
  );
}

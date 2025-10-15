"use client";

import React, { useState } from 'react';
import { PlusCircle, Trash2, Copy, Check, BookOpen } from 'lucide-react';
import { useNotes } from './NotesContext';

const NotesPanel: React.FC = () => {
  const { notes, activeNote, setActiveNote, createNote, updateNote, deleteNote } = useNotes();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="notes-panel h-full flex flex-col bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-blue-400" />
          My Notes
        </h2>
        <button 
          onClick={() => createNote()}
          className="p-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center"
        >
          <PlusCircle className="w-4 h-4 mr-1" />
          <span>New Note</span>
        </button>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Notes sidebar */}
        <div className="w-1/3 border-r border-gray-700 overflow-y-auto">
          {notes.length === 0 ? (
            <div className="p-4 text-gray-400 text-center">
              No notes yet. Create your first note!
            </div>
          ) : (
            <ul className="divide-y divide-gray-700">
              {notes.map(note => (
                <li key={note.id}>
                  <button
                    onClick={() => setActiveNote(note)}
                    className={`w-full text-left p-3 hover:bg-gray-800 transition-colors ${
                      activeNote?.id === note.id ? 'bg-gray-800' : ''
                    }`}
                  >
                    <h3 className="font-medium text-white truncate">{note.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Note editor */}
        <div className="w-2/3 flex flex-col overflow-hidden">
          {activeNote ? (
            <>
              <div className="p-3 border-b border-gray-700 flex items-center">
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={(e) => updateNote({ ...activeNote, title: e.target.value })}
                  className="bg-transparent text-white font-medium border-none outline-none flex-1"
                  placeholder="Note title"
                />
                <div className="flex space-x-2">
                  <button 
                    onClick={() => copyToClipboard(activeNote.content)}
                    className="p-1.5 rounded-md hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                    title="Copy note"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={() => deleteNote(activeNote.id)}
                    className="p-1.5 rounded-md hover:bg-red-900/30 text-gray-400 hover:text-red-400 transition-colors"
                    title="Delete note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <textarea
                value={activeNote.content}
                onChange={(e) => updateNote({ ...activeNote, content: e.target.value })}
                className="flex-1 p-4 bg-transparent text-gray-200 resize-none outline-none w-full font-mono text-sm"
                placeholder="Start typing your notes here..."
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a note or create a new one
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesPanel;
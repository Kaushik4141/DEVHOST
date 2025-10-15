"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  docSource?: string;
};

interface NotesContextType {
  notes: Note[];
  activeNote: Note | null;
  setActiveNote: (note: Note | null) => void;
  createNote: (content?: string) => void;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  addContentToNote: (content: string) => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('doc_notes');
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);
        if (parsedNotes.length > 0) {
          setActiveNote(parsedNotes[0]);
        }
      } catch (e) {
        console.error('Failed to parse saved notes', e);
      }
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('doc_notes', JSON.stringify(notes));
  }, [notes]);

  const createNote = (content?: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: content || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      docSource: window.location.search || 'documentation'
    };
    
    setNotes([newNote, ...notes]);
    setActiveNote(newNote);
  };

  const updateNote = (updatedNote: Note) => {
    const updatedNotes = notes.map(note => 
      note.id === updatedNote.id 
        ? { ...updatedNote, updatedAt: new Date().toISOString() } 
        : note
    );
    setNotes(updatedNotes);
    setActiveNote(updatedNote);
  };

  const deleteNote = (id: string) => {
    const filteredNotes = notes.filter(note => note.id !== id);
    setNotes(filteredNotes);
    
    if (activeNote?.id === id) {
      setActiveNote(filteredNotes.length > 0 ? filteredNotes[0] : null);
    }
  };

  const addContentToNote = (content: string) => {
    if (activeNote) {
      const updatedContent = activeNote.content 
        ? `${activeNote.content}\n\n${content}` 
        : content;
      
      updateNote({
        ...activeNote,
        content: updatedContent
      });
    } else {
      createNote(content);
    }
  };

  return (
    <NotesContext.Provider value={{
      notes,
      activeNote,
      setActiveNote,
      createNote,
      updateNote,
      deleteNote,
      addContentToNote
    }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
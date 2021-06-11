package com.notetapp.noteapp.Repository;

import java.util.List;

import com.notetapp.noteapp.Model.Note;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

@Service
public interface NoteRepository extends JpaRepository<Note, Long> {

  @Query("SELECT u from Note u WHERE u.isDeleted = false AND u.isCompleted = false")
  List<Note> findAllNotes(Sort sort);

  List<Note> findByIsDeleted(Boolean isDeleted, Sort sort);

  @Query("SELECT u from Note u WHERE u.isDeleted = false AND u.isCompleted = true")
  List<Note> findByIsCompleted(Sort sort);

  @Query("SELECT u from Note u WHERE u.isDeleted = false AND u.isImportant = true")
  List<Note> findByIsImportant(Sort sort);

  
}

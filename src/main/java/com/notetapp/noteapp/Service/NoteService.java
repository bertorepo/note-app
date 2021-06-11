package com.notetapp.noteapp.Service;

import com.notetapp.noteapp.Model.Note;
import com.notetapp.noteapp.Repository.NoteRepository;
import java.util.List;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class NoteService {

  private NoteRepository noteRepository;
  private static final Sort SORT_DESC = Sort.by(Sort.Direction.DESC, "createdDate");

  @Autowired
  public NoteService(NoteRepository noteRepository) {
    this.noteRepository = noteRepository;
  }

  @Transactional
  public Note saveNote(Note note) {
    return noteRepository.save(note);
  }

  public List<Note> saveAllNotes(List<Note> notes) {
    return noteRepository.saveAll(notes);
  }

  public List<Note> getNotes() {
    return noteRepository.findAllNotes(SORT_DESC);
  }

  public Note findNote(long id) {
    return noteRepository.findById(id).orElse(null);
  }

  public String deleteNote(long id) {

    Note existingNote = findNote(id);
    existingNote.setIsDeleted(!existingNote.getIsDeleted());
    noteRepository.save(existingNote);

    return "Note has been deleted";
  }

  public Note updateNote(Note note) {
    Note existingNote = findNote(note.getId());
    existingNote.setTitle(note.getTitle());
    existingNote.setDescription(note.getDescription());
    existingNote.setDueDate(note.getDueDate());
    existingNote.setIsDeleted(note.getIsDeleted());
    existingNote.setIsImportant(note.getIsImportant());

    return saveNote(existingNote);
  }

  //SET NOTE TO BE COMPLETED
  public String setNoteCompleted(long id){
    Note existingNote = findNote(id);
    existingNote.setIsCompleted(!existingNote.getIsCompleted());
    noteRepository.save(existingNote);

    if(existingNote.getIsCompleted() == true){
      return "Note has been marked as Completed!";
    }else {
       return "Note has been marked Not Completed!";
    }

  }

  //restore deleted notes
  public String restoreDeletedNote(long id){
    Note existingNote = findNote(id);
    existingNote.setIsDeleted(false);
    noteRepository.save(existingNote);

    return "Note has been restored";
  }

  //empty deleted notes permanently
  public String emptyNotes(){
    List<Note> allDeletedNotes = filterByIsDeleted();
    noteRepository.deleteAll(allDeletedNotes);
    return "Permanently deleted Notes!";
  }

  // FILTER NOTES
  public List<Note> filterByIsCompleted(){
    return noteRepository.findByIsCompleted(SORT_DESC);
  }

  public List<Note> filterByIsImportant(){
    return noteRepository.findByIsImportant(SORT_DESC);
  }

  public List<Note> filterByIsDeleted(){
    return noteRepository.findByIsDeleted(true,SORT_DESC);
  }
}

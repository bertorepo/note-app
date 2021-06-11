package com.notetapp.noteapp.Controller;

import com.notetapp.noteapp.Model.Note;
import com.notetapp.noteapp.Service.NoteService;
import com.notetapp.noteapp.exception.ApiRequestException;
import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class NoteController {

  private NoteService noteService;

  @Autowired
  public NoteController(NoteService noteService) {
    this.noteService = noteService;
  }

  // SAVE NOTE
  @PostMapping("/addNote")
  public Note addNote(@RequestBody Note note) {
    return noteService.saveNote(note);
  }
  // SAVE LIST OF NOTES
  @PostMapping("/addAllNotes")
  public List<Note> addAllNotes(@RequestBody List<Note> notes) {
    return noteService.saveAllNotes(notes);
  }

  // GET ALL NOTES WHIS IS NOT DELETED
  @GetMapping("/notes")
  public ResponseEntity<List<Note>> findAllNotes() {
    List<Note> allNotes = noteService.getNotes();
    if (allNotes.isEmpty()) {
      throw new ApiRequestException("No available notes in the database");
    }
    return new ResponseEntity<>(allNotes, HttpStatus.OK);
  }

  // VIEW NOTE
  @GetMapping("/note/{id}")
  public Note findNote(@PathVariable("id") long id) {
    Note getNote = noteService.findNote(id);
    if (getNote == null) {
      throw new ApiRequestException("No note found associated with id" + id);
    }
    return getNote;
  }

  // UPDATE NOTE
  @PutMapping("/update")
  public Note updateNote(@RequestBody Note note) {
    Note getNote = noteService.findNote(note.getId());
    if (getNote == null) {
      throw new ApiRequestException(
        "No note found associated with id" + note.getId()
      );
    }

    return noteService.updateNote(note);
  }

  // DELETE NOTE Temporary
  @DeleteMapping("/delete/{id}")
  public String deleteNote(@PathVariable("id") long id) {
    Note getNote = noteService.findNote(id);
    if (getNote == null) {
      throw new NoSuchElementException(
        "No note found associated with id " + id
      );
    }
    return noteService.deleteNote(id);
  }

  //Empty notes which is deleted permanently
  @GetMapping("/empty/notes")
  public String emptyNotes(){
    return noteService.emptyNotes();
  }

  //SET NOTE TO BE COMPLETED
  @GetMapping("/note/complete/{id}")
  public String setNoteCompleted(@PathVariable("id") long id){
    return noteService.setNoteCompleted(id);
  }

  //restore deleted note
  @GetMapping("/note/restore/{id}")
  public String restoreDeletedNote(@PathVariable("id") long id){
    return noteService.restoreDeletedNote(id);
  }

  // FILTER NOTES BY IS_COMPLETED
  @GetMapping("/notes/completed")
  public ResponseEntity<List<Note>> filterByIsCompleted(){
    List<Note> getCompletedNotes = noteService.filterByIsCompleted();
    if(getCompletedNotes.isEmpty()){
      throw new ApiRequestException("No Notes has been completed yet");
    }
    return new ResponseEntity<>(getCompletedNotes, HttpStatus.OK);
  }

  // FILTER NOTES BY IS_IMPORTANT
  @GetMapping("/notes/important")
  public ResponseEntity<List<Note>> filterByIsImportant(){
    List<Note> getImportantNotes = noteService.filterByIsImportant();
    if(getImportantNotes.isEmpty()){
      throw new ApiRequestException("No Important Notes yet");
    }
    return new ResponseEntity<>(getImportantNotes, HttpStatus.OK);
  }

  // FILTER NOTES BY IS_DELETED
  @GetMapping("/notes/deleted")
  public ResponseEntity<List<Note>> filterByIsDeleted(){
    List<Note> getDeletedNotes = noteService.filterByIsDeleted();
    if(getDeletedNotes.isEmpty()){
      throw new ApiRequestException("You have no deleted Post");
    }
    return new ResponseEntity<>(getDeletedNotes, HttpStatus.OK);
  }
}

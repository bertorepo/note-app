package com.notetapp.noteapp.Model;

import java.sql.Timestamp;
import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.CreationTimestamp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
@Table(name = "note_tbl")
public class Note {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @Column(name = "note_title")
  private String title;

  @Column(name = "note_description")
  private String description;

  @Column(name="due_date")
  private LocalDate dueDate;

  @Column(name = "is_completed")
  private Boolean isCompleted;
  
  @Column(name = "is_deleted")
  private Boolean isDeleted;

  @Column(name = "is_Important")
  private Boolean isImportant;

  @CreationTimestamp
  @Column(name = "created_date", updatable = false)
  private Timestamp createdDate;


}

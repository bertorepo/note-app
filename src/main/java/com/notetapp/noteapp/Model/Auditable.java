package com.notetapp.noteapp.Model;

import java.util.Date;

import javax.persistence.Column;


import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import lombok.Data;
import lombok.ToString;


@Data
@ToString
public class Auditable {
  
  @CreatedDate
  @Column(name = "created_date", updatable = false)
  private Date createdDate;

  @LastModifiedDate
  @Column(name = "modified_date")
  private Date modifiedDate;
  
}

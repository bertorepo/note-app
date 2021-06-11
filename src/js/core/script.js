'use strict';

$(function () {
  var taskTitle,
    taskDescription,
    datePicker = $('.task-due-date'),
    sidebarToggle = $('.sidebar-toggle'),
    sidebarLeft = $('.sidebar-left'),
    overlay = $('.body-content-overlay'),
    taskModal = $('.center-todo-modal'),
    todoForm = $('#form-modal-note'),
    todoList = $('.todo-task-list-wrapper'),
    sidebarMenuList = $('.sidebar-menu-list'),
    loader = $('#section-block'),
    todoTaskList = $('.todo-task-list'),
    submitBtn = $('#submit-note'),
    todoItem = $('.todo-item'),
    filterNote = $('.list-group-filters'),
    menuToggle = $('.menu-toggle');

  // show modal to add todo
  $('#add-todo-btn').on('click', function () {
    $(submitBtn).show();
    $('#create-note-header').text('Create a Note');
    $('#update-note').hide();
    $(taskModal).modal('show');
  });

  // Main menu toggle should hide app menu
  if (menuToggle.length) {
    menuToggle.on('click', function (e) {
      sidebarLeft.removeClass('show');
      overlay.removeClass('show');
    });
  }

  //For chat sidebar on small screen
  if ($(window).width() > 992) {
    if (overlay.hasClass('show')) {
      overlay.removeClass('show');
    }
  }

  //flat picker
  function renderDatePicker(data) {
    return datePicker.flatpickr({
      dateFormat: 'Y-m-d',
      defaultDate: data ? data.dueDate : 'today',
      onReady: function (instance) {
        if (instance.isMobile) {
          $(instance.mobileInput).attr('step', null);
        }
      },
    });
  }

  // Toto sidebar toggle
  if (sidebarToggle.length) {
    sidebarToggle.on('click', function (e) {
      e.stopPropagation();
      sidebarLeft.toggleClass('show');
      overlay.addClass('show');
    });
  }

  //if overlay was click || the sidebar will close
  if (overlay.length) {
    overlay.on('click', function (e) {
      sidebarLeft.removeClass('show');
      overlay.removeClass('show');
      $(taskModal).modal('hide');
    });
  }

  // if it is not touch device
  if (!$.app.menu.is_touch_device()) {
    if (sidebarMenuList.length > 0) {
      var sidebarListScrollbar = new PerfectScrollbar(sidebarMenuList[0], {
        theme: 'dark',
      });
    }
    if (todoList.length > 0) {
      var taskListScrollbar = new PerfectScrollbar(todoList[0], {
        theme: 'dark',
      });
    }
  }
  // if it is a touch device like wrapper will be set to scroll
  else {
    sidebarMenuList.css('overflow', 'scroll');
    todoList.css('overflow', 'scroll');
  }

  //Add class active on click of sidebar filter list

  if (filterNote.length) {
    filterNote.find('a').on('click', function () {
      if (filterNote.find('a').hasClass('active')) {
        filterNote.find('a').removeClass('active');
      }
      $(this).addClass('active');
    });
  }

  /**
   * Start:Form validation using jquery validation
   */
  if (todoForm.length) {
    //method to add validation when user enter space in the input field
    $.validator.addMethod('noSpace', function (value, element) {
      return value == '' || value.trim().length != 0;
    });

    renderDatePicker(null);

    //handle validation
    todoForm.validate({
      rules: {
        title: {
          required: true,
          noSpace: true,
        },
        description: {
          required: true,
          noSpace: true,
        },
        dueDate: {
          required: true,
        },
      },
      messages: {
        title: 'Enter Note title',
        description: 'Enter description',
        dueDate: 'Due Date is required',
      },
    });
    //when submitting the form
    todoForm.on('submit', async function (e) {
      e.preventDefault();
      var isValid = todoForm.valid();
      if (isValid) {
        //load UI Blocking
        UILoading();

        var title = $('#title').val();
        var description = $('#description').val();
        var dueDate = $('#dueDate').val();

        var isImportant = () => {
          if ($('#customCheck2').prop('checked')) {
            return true;
          } else {
            return false;
          }
        };

        let URL = 'http://localhost:8080/api/addNote';

        const formData = {
          title: title,
          description: description,
          isCompleted: false,
          isDeleted: false,
          isImportant: isImportant(),
          dueDate: dueDate,
        };

        const config = {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        };

        try {
          const response = await axios.post(URL, formData, config);
          $(todoForm)[0].reset();
          if (response.status === 200) {
            sidebarLeft.removeClass('show');
            overlay.removeClass('show');
            showToaster('Notes save successfully', 'success');
            $(taskModal).modal('hide');
            overlay.removeClass('show');

            $(loader).unblock();
            getListOfNotes();
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  }
  /**
   * Start:Form validation using jquery validation
   */

  /**
   * Start:Fetching the Notes in the API
   */
  $(window).on('load', function () {
    getListOfNotes();
  });

  async function getListOfNotes() {
    if (todoList.length) {
      try {
        let URL = 'http://localhost:8080/api/notes';
        const response = await axios.get(URL);

        renderTodoItem(response.data);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function getImportantNotes() {
    if (todoList.length) {
      try {
        let URL = 'http://localhost:8080/api/notes/important';
        const response = await axios.get(URL);
        renderImportantItems(response.data);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function getCompletedNotes() {
    if (todoList.length) {
      try {
        let URL = 'http://localhost:8080/api/notes/completed';
        const response = await axios.get(URL);
        renderCompletedItems(response.data);
      } catch (error) {
        console.log(error);
      }
    }
  }
  async function getDeletedNotes() {
    if (todoList.length) {
      try {
        let URL = 'http://localhost:8080/api/notes/deleted';
        const response = await axios.get(URL);
        renderDeletedItems(response.data);
      } catch (error) {
        console.log(error);
      }
    }
  }

  //formatDate
  function formatDate(date) {
    var date = date,
      selectedDate = new Date(date),
      month = new Intl.DateTimeFormat('en', { month: 'short' }).format(
        selectedDate
      ),
      day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(
        selectedDate
      ),
      weekday = Intl.DateTimeFormat('en', { weekday: 'long' }).format(
        selectedDate
      ),
      dueDate = weekday + ', ' + month + ' ' + day;

    return dueDate;
  }

  function referNoteId(data) {
    // delete Notes
    $(document).on(
      'click',
      `.todo-task-list-wrapper #delete-note${data.id}`,
      function () {
        showAlert(
          'Delete?',
          'Do you want to Continue?',
          'Yes! Delete it!',
          'danger',
          function (result) {
            if (result.isConfirmed) {
              // delete the notes
              let noteId = $(`#note-id-${data.id}`).attr('value');
              deleteNote(noteId);
            }
          }
        );
      }
    );
    // end delete note

    // update notes
    if (todoForm.length) {
      $(document).on(
        'click',
        `.todo-task-list-wrapper #update-note${data.id}`,
        function (e) {
          taskModal.modal('show');
          $(submitBtn).hide();
          $('#update-note').show();
          $('#form-reset-btn').addClass('d-none');
          $('#cancel-modal-btn').removeClass('d-none');
          $('#create-note-header').text('Update Note');

          var $title = $(`.todo-title-${data.id}`).html();
          var $desc = $(`.todo-description-${data.id}`).html();

          if (data.isImportant == true) {
            todoForm.find('#customCheck2').prop('checked', true);
          } else {
            todoForm.find('#customCheck2').prop('checked', false);
          }

          renderDatePicker(data);

          todoForm.find('#title').val($title);
          todoForm.find('#description').val($desc);
          todoForm.find('#dueDate').val(data.dueDate);

          $('#update-note').on('click', function (e) {
            e.preventDefault();

            var isValid = todoForm.valid();

            if (isValid) {
              UILoading();
              var edit_title = $('#title').val();
              var edit_desc = $('#description').val();
              var edit_due_date = $('#dueDate').val();
              var isImportant = () => {
                if ($('#customCheck2').prop('checked')) {
                  return true;
                } else {
                  return false;
                }
              };

              const formaData = {
                id: data.id,
                title: edit_title,
                description: edit_desc,
                isCompleted: false,
                isDeleted: false,
                isImportant: isImportant(),
                dueDate: edit_due_date,
              };
              //  todo tom. update todo
              var updateTodo = updateNote(formaData);
              if (updateTodo) {
                UnblockUI();
              }
            }
          });

          $('#cancel-modal-btn, #close-modal').on('click', function (e) {
            $(todoForm)[0].reset();
          });
        }
      );
      // end update note
    }

    //mark note as complete
    $(document).on(
      'click',
      `.todo-task-list-wrapper #mark-note${data.id}`,
      function () {
        var title =
          data.isCompleted == true
            ? 'Mark as Incomplete?'
            : 'Mark as Completed?';
        var btnMessage =
          data.isCompleted == true ? 'Yes! Proceed' : 'Yes! Complete it!';
        var btnType = data.isCompleted == true ? 'warning' : 'success';

        showAlert(
          title,
          'Do you want to Continue?',
          btnMessage,
          btnType,
          function (result) {
            if (result.isConfirmed) {
              // delete the notes
              let noteId = $(`#note-id-${data.id}`).attr('value');
              if (data.isCompleted == true) {
                markNoteNotCompleted(noteId);
              } else {
                markNoteCompleted(noteId);
              }
            }
          }
        );
      }
    );

    //restore deleted note

    $(document).on(
      'click',
      `.todo-task-list-wrapper #restore-note${data.id}`,
      function () {
        showAlert(
          'Restore this Note?',
          'Do You want to continue?',
          'Yes! Restore',
          'info',
          function (result) {
            if (result.isConfirmed) {
              let noteId = $(`#note-id-${data.id}`).attr('value');
              restoreDeletedNote(noteId);
            }
          }
        );
      }
    );
  }

  /**
   * END:Fetching the Notes in the API
   */

  // filter all task
  if (filterNote.length) {
    $('#filter-task').on('click', function () {
      $('#empty-trash').hide();
      getListOfNotes();
    });
  }
  // filter important notes
  if (filterNote.length) {
    $('#filter-important').on('click', function () {
      $('#empty-trash').hide();
      getImportantNotes();
    });
  }
  // filter completed
  if (filterNote.length) {
    $('#filter-completed').on('click', function () {
      $('#empty-trash').hide();
      getCompletedNotes();
    });
  }
  // filter deleted
  if (filterNote.length) {
    $('#filter-deleted').on('click', function () {
      $('#empty-trash').show();
      getDeletedNotes();
    });
  }

  //empty deleted notes permanently

  $(document).on('click', '#empty-trash', function () {
    showAlert(
      'Delete Permanently?',
      'Do You want to continue?',
      'Yes! Deleted',
      'danger',
      function (result) {
        if (result.isConfirmed) {
          emptyNotesPermanently();
        }
      }
    );
  });

  /**
   * START:DELETE NOTES
   */

  async function deleteNote(id) {
    let URL = `http://localhost:8080/api/delete/${id}`;
    try {
      const response = await axios.delete(URL);
      if (response.status == 200) {
        showToaster('Note Deleted Successfully', 'warning');
        getListOfNotes();
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * END:DELETE NOTES
   */
  /**
   * START:MARK NOTE AS COMPLETED
   */

  async function markNoteCompleted(id) {
    let URL = `http://localhost:8080/api/note/complete/${id}`;
    try {
      const response = await axios.get(URL);
      if (response.status == 200) {
        showToaster('Note has mark as Completed', 'success');
        getListOfNotes();
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
  async function markNoteNotCompleted(id) {
    let URL = `http://localhost:8080/api/note/complete/${id}`;
    try {
      const response = await axios.get(URL);
      if (response.status == 200) {
        showToaster('Note has mark as Not Completed', 'warning');
        getCompletedNotes();
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * END:MARK NOTE AS COMPLETED
   */

  //restore deleted notes
  async function restoreDeletedNote(id) {
    let URL = `http://localhost:8080/api/note/restore/${id}`;

    try {
      const response = await axios.get(URL);
      if (response.status == 200) {
        showToaster('Note has been restored', 'success');
        getDeletedNotes();
      }
    } catch (error) {
      console.log(error);
    }
  }
  //empty deleted notes permanently
  async function emptyNotesPermanently() {
    let URL = 'http://localhost:8080/api/empty/notes';

    try {
      const response = await axios.get(URL);
      if (response.status == 200) {
        showToaster('Permanently deleted Notes', 'success');
        getDeletedNotes();
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * START:UPDATES
   */

  async function updateNote(data) {
    let URL = 'http://localhost:8080/api/update';

    const config = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await axios.put(URL, data, config);

      if (response.status == 200) {
        $(taskModal).modal('hide');
        $(taskModal).on('hidden.bs.modal', function () {
          location.reload();
          getListOfNotes();
        });
        showToaster('Notes Updated!', 'success');
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * END:UPDATES
   */

  //trigger loading UI
  function UILoading() {
    $(loader).block({
      message: '<div class="spinner-border text-white" role="status"></div>',
      css: {
        backgroundColor: 'transparent',
        border: '0',
      },
      overlayCSS: {
        opacity: 0.5,
      },
    });
  }

  function UnblockUI() {
    $(loader).unblock();
  }

  function showToaster(message, type) {
    toastr[type](message, '💾 Successfull!', {
      closeButton: true,
      tapToDismiss: false,
      timeOut: 1000,
      preventDuplicates: true,
      onHidden: function () {
        $(window).on('load', function () {
          getListOfNotes();
        });
      },
    });
  }

  function showAlert(title, message, btnMessage, type, callback) {
    Swal.fire({
      // icon: 'error',
      title: title,
      text: message,

      showCancelButton: true,
      confirmButtonText: btnMessage,
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: `btn btn-outline-${type}`,
        cancelButton: 'ml-2 btn btn-outline-warning',
      },
      buttonsStyling: false,
    }).then((result) => {
      callback(result);
    });
  }

  //function to accept res. and render in html
  function renderTodoItem(res) {
    let html = '';

    if (res.length == 0) {
      html += `
    <div id="no-notes-wrapper" class="text-center mt-5">
      <i class="fa fa-exclamation-triangle fa-3x text-muted mb-2"></i>
        <h1 class="h1 text-muted">
            No Notes available
        </h1> 
    </div>
    `;
    } else {
      res.map((data) => {
        var dueDate = formatDate(data.dueDate);
        html += `
      <li class="todo-item">
        <div class="todo-title-wrapper">
            <div class="todo-title-area">
              <button id="mark-note${
                data.id
              }" type="button" class="btn btn-icon btn-icon btn-sm btn-outline-primary waves-effect mr-1">
                <i class="text-primary fa fa-check"></i>
              </button>  
                <div class="title-wrapper">   
                  <input id="note-id-${data.id}" type="hidden" value="${
          data.id
        }"/>
                    <span class="todo-title-${data.id}">${data.title}</span>
                    <span class="d-none todo-description-${data.id}">${
          data.description
        }</span>
                </div>
            </div>
            <div class="todo-item-action">
                <div class="badge-wrapper mr-1">
                    <div class="badge badge-pill badge-light-warning">${
                      data.isImportant == true ? 'Important' : ''
                    }</div>
                </div>
                <small class="text-nowrap text-muted mr-1">${dueDate}</small>
                <div class="avatar">
                    <img src="../app-assets/images/portrait/small/avatar-s-4.jpg"
                        alt="user-avatar" height="32" width="32" />
                </div>
                <i id="update-note${
                  data.id
                }" class="ml-1 text-primary far fa-edit"></i>
                <i id="delete-note${
                  data.id
                }" class="ml-1 text-danger far fa-trash-alt"></i>   
            </div>
        </div>
    </li>
      `;
        referNoteId(data);
      });
    }
    $(todoTaskList).html(html);
  }

  //function to render important notes
  function renderImportantItems(res) {
    let html = '';
    if (res.length == 0) {
      html += `
    <div id="no-notes-wrapper" class="text-center mt-5">
      <i class="fa fa-exclamation-triangle fa-3x text-muted mb-2"></i>
        <h1 class="h1 text-muted">
            No Important Notes available
        </h1> 
    </div>
    `;
    } else {
      res.map((data) => {
        var dueDate = formatDate(data.dueDate);
        html += `
      <li class="todo-item">
        <div class="todo-title-wrapper">
            <div class="todo-title-area">
            <button id="mark-note${
              data.id
            }" type="button" class="btn btn-icon btn-icon btn-sm btn-outline-primary waves-effect mr-1">
              <i class="text-primary fa fa-check"></i>
            </button>  
                <div class="title-wrapper">
                   
                    <input id="note-id-${data.id}" type="hidden" value="${
          data.id
        }"/>
                    <span class="todo-title-${data.id}">${data.title}</span>
                    <span class="d-none todo-description-${data.id}">${
          data.description
        }</span>
                </div>
            </div>
            <div class="todo-item-action">
            
                <div class="badge-wrapper mr-1">
                    <div class="badge badge-pill badge-light-warning">${
                      data.isImportant == true ? 'Important' : ''
                    }</div>
                </div>
                <small class="text-nowrap text-muted mr-1">${dueDate}</small>
                <div class="avatar">
                    <img src="../app-assets/images/portrait/small/avatar-s-4.jpg"
                        alt="user-avatar" height="32" width="32" />
                </div>
          
                <i id="update-note${
                  data.id
                }" class="ml-1 text-primary far fa-edit"></i>
                <i id="delete-note${
                  data.id
                }" class="ml-1 text-danger far fa-trash-alt"></i>
            </div>
        </div>
    </li>
      `;
        referNoteId(data);
      });
    }
    $(todoTaskList).html(html);
  }

  //function to render completed notes
  function renderCompletedItems(res) {
    let html = '';
    if (res.length == 0) {
      html += `
    <div id="no-notes-wrapper" class="text-center mt-5">
      <i class="fa fa-exclamation-triangle fa-3x text-muted mb-2"></i>
        <h1 class="h1 text-muted">
            No Completed Notes available
        </h1> 
    </div>
    `;
    } else {
      res.map((data) => {
        var dueDate = formatDate(data.dueDate);
        html += `
      <li class="todo-item">
        <div class="todo-title-wrapper">
            <div class="todo-title-area">
            <button id="mark-note${
              data.id
            }" type="button" class="btn btn-icon btn-icon btn-sm btn-outline-warning waves-effect mr-1">
              <i class="text-warning fa fa-exclamation"></i>
            </button>  
                <div class="title-wrapper">
                    
                    <input id="note-id-${data.id}" type="hidden" value="${
          data.id
        }"/>
                  
                    <span class="todo-title-${data.id}">${data.title}</span>
                    <span class="d-none todo-description-${data.id}">${
          data.description
        }</span>
                </div>
            </div>
            <div class="todo-item-action">
            
                <div class="badge-wrapper mr-1">
                    <div class="badge badge-pill badge-light-primary">${
                      data.isCompleted == true ? 'Completed' : ''
                    }</div>
                </div>
                <small class="text-nowrap text-muted mr-1">${dueDate}</small>
                <div class="avatar">
                    <img src="../app-assets/images/portrait/small/avatar-s-4.jpg"
                        alt="user-avatar" height="32" width="32" />
                </div>
          
                <i id="update-note${
                  data.id
                }" class="ml-1 text-primary far fa-edit d-none"></i>
                <i id="delete-note${
                  data.id
                }" class="ml-1 text-danger far fa-trash-alt d-none"></i>
            </div>
        </div>
    </li>
      `;
        referNoteId(data);
      });
    }
    $(todoTaskList).html(html);
  }
  //function to render Deleted notes
  function renderDeletedItems(res) {
    let html = '';
    if (res.length == 0) {
      $('#empty-trash').hide();
      html += `
    <div id="no-notes-wrapper" class="text-center mt-5">
      <i class="fa fa-exclamation-triangle fa-3x text-muted mb-2"></i>
        <h1 class="h1 text-muted">
           Empty!
        </h1> 
    </div>
    `;
    } else {
      res.map((data) => {
        var dueDate = formatDate(data.dueDate);
        html += `
      <li class="todo-item">
        <div class="todo-title-wrapper">
            <div class="todo-title-area">
            <button id="restore-note${
              data.id
            }" type="button" class="btn btn-icon btn-icon btn-sm btn-outline-danger waves-effect mr-1">
              <i class="text-danger fa fa-sync-alt"></i>
            </button>  
                <div class="title-wrapper">
                   
                    <input id="note-id-${data.id}" type="hidden" value="${
          data.id
        }"/>
                    <span class="todo-title-${data.id}">${data.title}</span>
                    <span class="d-none todo-description-${data.id}">${
          data.description
        }</span>
                </div>
            </div>
            <div class="todo-item-action">
            
                <div class="badge-wrapper mr-1">
                    <div class="badge badge-pill badge-light-danger">${
                      data.isDeleted == true ? 'Deleted' : ''
                    }</div>
                </div>
                <small class="text-nowrap text-muted mr-1">${dueDate}</small>
                <div class="avatar">
                    <img src="../app-assets/images/portrait/small/avatar-s-4.jpg"
                        alt="user-avatar" height="32" width="32" />
                </div>
          
                <i id="update-note${
                  data.id
                }" class="ml-1 text-primary far fa-edit d-none"></i>
                <i id="delete-note${
                  data.id
                }" class="ml-1 text-danger far fa-trash-alt d-none"></i>
            </div>
        </div>
    </li>
      `;
        referNoteId(data);
      });
    }
    $(todoTaskList).html(html);
  }
});

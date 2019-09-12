/*form-Table*/
$(document).ready(function() {
  $.extend($.fn.dataTable.defaults, {
    "order": [0, 'asc']
  });
  var table = $('#form-Table').DataTable({
    "columns": [{
        "orderable": true,
        "width": "30px",

      },
      null,
      {
        "orderable": false,
        "width": "55px",
      },
      {
        "orderable": false,
        "width": "55px",
      },
      {
        "orderable": false,
        "width": "55px",
      },
    ],
  });

  table.on('order.dt search.dt', function() {
    table.column(0, {
      search: 'applied',
      order: 'applied'
    }).nodes().each(function(cell, i) {
      cell.innerHTML = i + 1;
    });
  }).draw();

});
/*txtSearch-form-Table*/
$(document).ready(function() {
  $('#form-Table').DataTable();


  $('#txtSearch').on('keyup', function() {
    $('#form-Table')
      .DataTable()
      .search($('#txtSearch').val(), false, true)
      .draw();
  });
});

$('#signupForm').on('submit', function (e) {
    e.preventDefault();
    let myText = $('#signup').text();
    $('#signup').attr('disabled', true);
    $('#signup').html(`
        <div class="spinner-border spinner-sm text-white" role="status">
            <span class="sr-only">Loading...</span>
        </div>
    `)
    var data = new FormData(this);
    data.append('signup', true)

    let xml = $.ajax({
        type: "POST",
        url: "request.php",
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        dataType: "JSON",
    });

    xml.done((response, status, jqxhr) => {
        $('#signupForm .alert').remove();
        $('#signup').attr('disabled', false);
        $('#signup').text(myText);

        if (response.status == 'success') {
            let alert = setResponse(response.message, 'success');
            alert.insertAfter('#header');
            window.location = '/signin.php'
        } else {
            let alert = setResponse(response.message, 'danger');
            alert.insertAfter('#header');
        }
    })

    xml.fail((Jqxhr, status, response) => {
        console.log(Jqxhr.responseText);
    })
});


$('#signinForm').on('submit', function (e) {
    e.preventDefault();
    let myText = $('#signin').text();
    $('#signin').attr('disabled', true);
    $('#signin').html(`
        <div class="spinner-border spinner-sm text-white" role="status">
            <span class="sr-only">Loading...</span>
        </div>
    `)
    var data = new FormData(this);
    data.append('signin', true)

    let xml = $.ajax({
        type: "POST",
        url: "request.php",
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        dataType: "JSON",
    });

    xml.done((response, status, jqxhr) => {
        $('#signinForm .alert').remove();
        $('#signin').attr('disabled', false);
        $('#signin').text(myText);

        if (response.status == 'success') {
            let alert = setResponse(response.message, 'success');
            alert.insertAfter('#header');
            window.location = '/'
        } else {
            let alert = setResponse(response.message, 'danger');
            alert.insertAfter('#header');
        }
    })

    xml.fail((Jqxhr, status, response) => {
        console.log(Jqxhr.responseText);
    })
});

function setResponse (message, type) {
    return $(`
          <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            <strong>${message}!</strong> 
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
    `);
}
export default class General {

    constructor() {

    }


    load () {
        let data = { 'info': true }
        let xml = this.setData(data);
        xml.done((response, status, jqxhr) => {
            this.closeLoader()
            if (response.image === null && response.gender == 'M') {
                var image = 'male.jpeg';
            } else if (response.image === null && response.gender == 'F') {
                var image = 'female.jpeg';
            } else {
                var image = response.image;
            }
            $('#sidebarImage').attr('src', `assets/images/${image}`)
            $('#sidebarUsername').text(response.username);
            $('#sidebarEmail').text(response.email);
        })
        xml.fail((jqxhr, status, response) => {
            console.log(jqxhr.responseText);
        })
    }



    logout () {
        let data = { 'logout': true }
        let xml = this.setData(data);
        xml.done((response, status, jqxhr) => {
            window.location = 'signin.php';
        })
        xml.fail((jqxhr, status, response) => {
            console.log(jqxhr.responseText);
        })
    }




    setResponse (message, type) {
        return $(`
              <div class="alert alert-${type} alert-dismissible fade show" role="alert" style="padding: 1rem !important">
                <strong style="font-size: small !important;">${message}!</strong> 
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
        `);
    }


    setPanel () {
        $('#inner_left_panel').addClass('open')
        $('#inner_right_panel').addClass('close')
    }
    revokePanel () {
        $('#inner_left_panel').removeClass('open')
        $('#inner_right_panel').removeClass('close')
    }

    setImage (image, gender) {
        if ((image == null || image == "") && gender == 'M') {
            return 'male.jpeg';
        } else if (image == null || image == "" && gender == 'F') {
            return 'female.jpeg';
        } else {
            return image;
        }
    }


    setData (data) {
        $('.loader').addClass('on')
        return $.ajax({
            method: 'POST',
            data: data,
            url: './request.php',
            dataType: 'JSON',
        })
    }
    setDataWithoutCache (data) {
        $('.loader').addClass('on')
        return $.ajax({
            method: 'POST',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            url: './request.php',
            dataType: 'JSON',
        })
    }

    closeLoader () { $('.loader').removeClass('on') }
}
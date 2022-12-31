import General from "./General.js";
export default class Settings extends General {
    constructor() {
        super();
    }

    setSettings (data) {
        var image = super.setImage(data.image, data.gender);
        let settingContainer = $(`<div id="settingDiv"></div>`)
        let form = $(`
            <form action="" id="settingForm" method="POST">
                <input type="text" class="form-control" name="username" id="" value="${data.username}" placeholder="Username">
                <input type="email" class="form-control" name="email" id="" value="${data.email}" placeholder="Email" readonly>
                <div class="gender">
                    <p>Gender :</p>
                    <label for="male">Male</label>
                    <input type="radio" name="gender" value="M" id="male"  ${(data.gender === 'M') ? 'checked' : ''}>
                    <label for="female">Female</label>
                    <input type="radio" name="gender" value="F" id="female" ${(data.gender === 'F') ? "checked" : ''}>
                </div>
                <input type="password" class="form-control" name="password" value="${data.password}" placeholder="Password" id="">
                <input type="password" class="form-control" name="password2" value="${data.password}" placeholder="Confirm Password" id="">
                <div class="formButtom">
                    <button type="submit" id="settingSub" class="btn">Save Settings</button>
                </div>
            </form>
        `)

        let imageArea = $(`
            <form class="settingsImage">
                <img src="./assets/images/${image}" alt="">
                <input type="file" name="image" id="changeImage" value="">
                <label class="btn" for="changeImage">Change Image</label>
            </form>
        `)


        form.on('submit', (e) => {
            e.preventDefault();
            this.settingFunction(e);
        })
        settingContainer.append(imageArea).append(form);
        $('#inner_left_panel').empty().append(settingContainer);
        $('#changeImage').on('change', (e) => {
            data = e.target.files[0];
            this.changeProfileImage(data)
        })
    }

    settings (data) {
        let xml = super.setData(data);
        xml.done((response, status, jqxhr) => {
            super.closeLoader();
            this.setSettings(response);
        })
        xml.fail((jqxhr, status, response) => {
            console.log(jqxhr.responseText);
        })
    }

    changeProfileImage (file) {
        let myText = $('.settingsImage label').text();
        $('.settingsImage label').attr('disabled', true);
        $('.settingsImage label').html(`
            <div class="spinner-border spinner-sm text-white" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        `)
        var data = new FormData();
        data.append('file', file)
        data.append('changeProfileImage', true)

        let xml = super.setDataWithoutCache(data)

        xml.done((response, status, jqxhr) => {
            $('.settingsImage .alert').remove();
            // $('.settingsImage label').attr('disabled', false);
            $('.settingsImage label').text(myText);

            if (response.status == 'success') {
                let alert = this.setResponse(response.message, 'success');
                let data = { 'getSetting': true }
                this.settings(data)
                this.load();
                $('.settingsImage').prepend(alert);
            } else {
                let alert = this.setResponse(response.message, 'danger');
                super.closeLoader()
                $('.settingsImage').prepend(alert);
            }
        })

        xml.fail((Jqxhr, status, response) => {
            console.log(Jqxhr.responseText);
        })
    }

    settingFunction (e) {
        let myText = $('#settingSub').text();
        $('#settingSub').attr('disabled', true);
        $('#settingSub').html(`
            <div class="spinner-border spinner-sm text-white" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        `)
        var data = new FormData(e.target);
        data.append('settingForm', true)

        let xml = super.setDataWithoutCache(data);

        xml.done((response, status, jqxhr) => {
            $('#settingForm .alert').remove();
            $('#settingSub').attr('disabled', false);
            $('#settingSub').text(myText);
            if (response.status == 'success') {
                let alert = super.setResponse(response.message, 'success');
                let data = { 'getSetting': true }
                this.settings(data)
                super.load();
                $('#settingForm').prepend(alert);
            } else {
                let alert = super.setResponse(response.message, 'danger');
                super.closeLoader();
                $('#settingForm').prepend(alert);
            }
        })
        xml.fail((Jqxhr, status, response) => {
            console.log(Jqxhr.responseText);
        })
    }
}
import General from "./General.js";
import Chat from "./Chat.js";
const chat = new Chat();
export default class Contact extends General {
    constructor() {
        super()
    }

    setContact (data = {}) {
        let contactContainer = $(`<div id="contactDiv" ></div>`)
        let contact = (data, image) => {
            return $(`
            <div class="userContact" data-info="${data.id}">
                <img src="./assets/images/${image}" alt="image">
                <p>${data.username}</p>
            </div>
        `)
        }
        $.each(data, (i, el) => {
            var image = super.setImage(el.image, el.gender);
            contactContainer.append(contact(el, image));
        });

        // for (let i = 1; i <= 30; i++) {
        //     data = { username: `test ${i}`, id: '1000' }
        //     if (i % 3 == 0) {
        //         var image = `user2.jpg`
        //     } else if (i % 5 == 0) {
        //         var image = `user3.jpg`
        //     } else {
        //         var image = `user1.jpg`
        //     }
        //     contactContainer.append(contact(data, image))
        // }

        contactContainer.find('.userContact').each((i, el) => {
            $(el).on('click', (e) => {
                let email = $(e.target).parent().data('info');
                super.revokePanel();
                this.startChat(email)
            })
        })
        $('#inner_left_panel').empty().append(contactContainer);
    }

    startChat (info) {
        chat.chats({
            userId: info,
            startChat: true,
        });
    }

    contacts (data) {
        let xml = super.setData(data);
        xml.done((response, status, jqxhr) => {
            super.closeLoader();
            this.setContact(response);
        })
        xml.fail((jqxhr, status, response) => {
            console.log(jqxhr.responseText);
        })
    }
}

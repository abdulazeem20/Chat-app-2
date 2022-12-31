import General from "./General.js";

export default class Chat extends General {
    constructor() {
        super()
    }

    setChat (data) {
        let friendId; let friendUsername; let image;
        if ('message' in data[0]) {
            if (data[0].senderId == data.sender) {
                image = super.setImage(data[0].receiverImage, data[0].receiverGender)
                friendUsername = data[0].receiverUsername
                friendId = data[0].receiverId
            } else {
                image = super.setImage(data[0].senderImage, data[0].senderGender)
                friendUsername = data[0].senderUsername
                friendId = data[0].senderId
            }
        } else {
            image = super.setImage(data[0].receiverImage, data[0].gender)
            friendUsername = data[0].receiverUsername
            friendId = data[0].receiverId
        }

        let contact = (data, image) => {
            return $(`
            <div id="activeContact">
                <p>Now Chatting with</p>
                <div class="activeContactInner">
                    <img src="./assets/images/${image}" alt="image">
                    <p>${friendUsername}</p>
                </div>
            </div>
        `)
        }
        let messageSide = $(`
            <div id="messageArea">
                <div class="messageBody">
                </div>
                <form id="sendMessageForm" method="POST" data-friend-id="${friendId}" class="messageTail">
                    <div class="form-group">
                        <input type="text" id="messageInput" placeholder="message" class="form-control" name="message" value="">

                        <label for="messageFile"><i class="fas fa-paperclip"></i></label>
                        <input type="file" name="sendFile" id="messageFile" value="" hidden>
                    </div>
                    <button id="sendMessage" class="btn" type="submit"> <i class="fa fa-paper-plane" aria-hidden="true"></i> </button>
                </form>
            </div>
        `)

        this.setMessage(messageSide, data)


        let updateMessage = () => {
            let data = {
                userId: messageSide.find('#sendMessageForm').data('friendId'),
                startChat: true
            }
            let xml = $.ajax({
                method: 'POST',
                data: data,
                url: './request.php',
                dataType: 'JSON',
            });
            xml.done((response, status, jqxhr) => {
                this.setMessage(messageSide, response)
            })

            xml.fail((jqxhr, status, response) => {
                // console.log(jqxhr.responseText);
            });

        }
        messageSide.find('.messageBody').on('scroll', () => {
            clearTimeout(window.scrollToBottom)
        })

        messageSide.find('.messageBody').scrollTop(
            messageSide.find('.messageBody')[0].scrollHeight
        )

        window.updatingMessage = setInterval(() => {
            updateMessage();
        }, 1000)

        window.scrollToBottom = setTimeout(() => {
            messageSide.find('.messageBody').scrollTop(
                messageSide.find('.messageBody')[0].scrollHeight
            )
        }, 100)

        messageSide.find('#sendMessageForm').on('submit', (e) => this.sendMessage(e, messageSide))
        $('#inner_left_panel').empty().append(contact(data, image));
        $('#inner_right_panel').empty().append(messageSide);
    }


    setMessage (container, data) {
        container.find('.messageBody').empty()
        let receivedAudio = new Audio('assets/sound/received.mp3')
        $.each(data, (i, el) => {
            if (i == 'status' || typeof (el) != 'object') return;
            if ('message' in el) {
                if (el.senderId == data.sender) {
                    container.find('.messageBody').append(this.rightMessage(el))
                } else {
                    if (el.received == 0 || el.seen == 0) {
                        receivedAudio.play();
                    }
                    container.find('.messageBody').append(this.leftMessage(el))
                }

            }
            if (!el.message) {
                container.find('.messageBody').append($(`
                        <h5 style="align-self: center;"> Message Will Start Appearing Soon </h5>
                    `))
                return
            };
        });
    }

    chats (data) {
        if ('userId' in data) {
            let xml = super.setData(data);
            xml.done((response, status, jqxhr) => {
                super.closeLoader()
                if (response.status === 'error') { this.setError(); return }
                this.setChat(response);
            })

            xml.fail((jqxhr, status, response) => {
                console.log(jqxhr.responseText);
            });
        } else {
            this.setError();
        }
    }

    latestMessage (data) {
        let xml = super.setData(data);
        $('#inner_right_panel').empty();
        $('#inner_left_panel').empty();
        xml.done((response, stauts, jqxhr) => {
            super.closeLoader();
            if (response.status == 'success') {
                $('#inner_left_panel').append($(`
                    <p style="color: #ffffff">Latest Messages ...</p>
                `))
                $.each(response, (i, el) => {
                    if (typeof (el) != 'object') return;
                    let friendId; let friendUsername; let image;
                    if (el.senderId == response.sender) {
                        image = super.setImage(el.receiverImage, el.receiverGender)
                        friendUsername = el.receiverUsername
                        friendId = el.receiverId
                    } else {
                        image = super.setImage(el.senderImage, el.senderGender)
                        friendUsername = el.senderUsername
                        friendId = el.senderId
                    }
                    let contact = $(`
                        <div id="latestContact" data-friend-id =${friendId}>
                            <div class="latestContactInner">
                                <img src="./assets/images/${image}" alt="image">
                                <p>${friendUsername}</p>
                            </div>
                        </div>
                    `)

                    $('#inner_left_panel').append(contact)
                    contact.each((i, el) => {
                        $(el).on('click', (e) => {
                            let userId = $(e.target).parents('#latestContact').data('friendId');
                            let data = {
                                userId: userId,
                                startChat: true
                            }
                            this.chats(data);
                        });
                    });
                })
            } else {
                this.setError();
            }
        })
        xml.fail((jqxhr, stauts, response) => {
            console.log(jqxhr.responseText);
        })
    }

    rightMessage (data) {
        let image = "";
        if (data.senderId == data.sender) {
            image = super.setImage(data.senderImage, data.senderGender)
        } else {
            image = super.setImage(data.receiverImage, data.receiverGender)
        }
        return $(`
        <div class="sent">
            <div class="main">
                ${data.message}
            </div>
            <span class="badge"></span>
            <img src="./assets/images/${image}" alt="">
            <div class="detail">
                ${data.date}
                ${(data.seen == 1) ?
                '<span class="readSeen seen"><i class="fas fa-check-double"></i></span>' :
                '<span class="readSeen"><i class="fas fa-check-double"></i></span>'}
            </div>
        </div>
        `)
    }

    leftMessage (data) {
        let image = "";
        if (data.senderId == data.sender) {
            image = super.setImage(data.senderImage, data.senderGender)
        } else {
            image = super.setImage(data.receiverImage, data.receiverGender)
        }
        return $(`
        <div class="received">
            <div class="main">
                ${data.message}
            </div>
            <span class="badge"></span>
            <img src="./assets/images/${image}" alt="">
            <div class="detail">
                ${data.date}
            </div>
        </div>
        `)
    }

    sendMessage (e, container) {
        e.preventDefault();
        if ($(e.target).find('#messageInput').val() == "") return;
        let data = new FormData(e.target);
        let sendAudio = new Audio('./assets/sound/sent.mp3')
        data.append('userId', $(e.target).data('friendId'))
        data.append('sendMessage', true)
        let xml = $.ajax({
            method: 'POST',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            url: './request.php',
            dataType: 'JSON',
        })
        $(e.target).find('#messageInput').val('')
        xml.done((response, status, jqxhr) => {
            // console.log(response);
            sendAudio.play();
        });

        xml.fail((jqxhr, status, response) => {
            console.log(jqxhr.responseText)
        });
    }

    setError () {
        let contact = $(`
            <div id="activeContact">
                <div class="activeContactInner">
                    <h5>No Contact Found</h5>
                </div>
            </div>
        `)
        $('#inner_left_panel').empty().append(contact);
        $('#inner_right_panel').empty();
    }

}
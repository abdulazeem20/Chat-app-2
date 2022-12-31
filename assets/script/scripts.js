import Contact from './module/Contact.js';
import Chat from './module/Chat.js'
import Settings from './module/Settings.js';
import General from './module/General.js';

const contact = new Contact();
const chat = new Chat();
const setting = new Settings();
let general = new General();

$(window).on('load', function () {
    general.load()
    // general.setPanel();
    // let data = { 'getContact': true }
    // contact.contacts(data)
    let data = { getLatestChat: true }
    chat.latestMessage(data);
})

$('#logout').on('click', () => {
    clearInterval(window.updatingMessage)
    var answer = confirm('Are you sure you want to logout ??');
    if (!answer) return
    general.logout();
})
$('#setting').on('click', () => {
    clearInterval(window.updatingMessage)
    general.setPanel()
    let data = { 'getSetting': true }
    setting.settings(data)
})
$('#contact').on('click', () => {
    clearInterval(window.updatingMessage)
    general.setPanel();
    let data = { 'getContact': true }
    contact.contacts(data)
})
$('#chat').on('click', () => {
    clearInterval(window.updatingMessage)
    general.revokePanel();
    let data = { getLatestChat: true }
    chat.latestMessage(data);
})



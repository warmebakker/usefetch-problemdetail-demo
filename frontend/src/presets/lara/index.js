import badgedirective from './badgedirective';
import blockui from './blockui';
import button from './button';
import card from './card';
import global from './global';
import inputtext from './inputtext';
import ripple from './ripple';
import selectbutton from './selectbutton';
import toast from './toast';
import tooltip from './tooltip';

export default {
    global,
    directives: {
        badge: badgedirective,
        ripple,
        tooltip
    },

    //forms
    inputtext,
    selectbutton,

    //buttons
    button,

    //panels
    card,

    //messages
    toast,

    //misc
    blockui,
};

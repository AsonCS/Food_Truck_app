var form_incped_quant_f = (incped_quant_f) => {
    alert('enviou pedido');
    history.back();
}

var form_fecped_pag = (fecped_pag) => {
    alert('fechou pedido');
    history.back();
}

var form_cadastro_cad = (cadastro_cad) => {
    alert('usuario incluido');
    history.back();
}

function initDOM(){
    sessionStorage.epedsDebug = 1;
    sessionStorage.epedsLog = 1;
    var login = new Login();    
}

class Login {
    constructor(){
        this.TAG = 'Login';
        document.getElementById('login_form_usu').onblur = this.emailValid;
        document.getElementById('login_form').onsubmit = this.formOnSubmit;
    }

    /**
     * 
     * @param {HTMLInputElement} input Input de e-mail.
     * @param {Event} ev Evento Blur.
     */
    emailValid(ev){
        var routeLogin = new RouteLogin();
        var obj = { email : document.getElementById('login_form_usu').value };
        routeLogin.emailValid(obj, (data) => {
            if(parseInt(data.valid_email) == 1){
                putLog('emailValid: ' + data.valid_email, this.TAG);
                document.getElementById('login_form_sen').removeAttribute('disabled');
                document.getElementById('login_form_btn').removeAttribute('disabled');
                document.getElementById('login_form_sen').parentNode.classList.remove('ui-state-disabled');
            }
        });
    }

    formOnSubmit(ev){
        return formIntercept(document.getElementById('login_form'), (form) => {
            var data = {
                email : 'test',
                valid_email : 0,
                valid_senha: 0,
                tentativa: 5
            };
            putLog('form intercept' , this.TAG);
            if(parseInt(data.valid_senha) == 1){
                putLog('emailSenha: ' + data.valid_senha + ', tentativa: ' + data.tentativa, this.TAG);
                location += '#ambientes';
            }else if(parseInt(data.valid_senha) == 0 && parseInt(data.tentativa) < 5){
                putLog('emailSenha: ' + data.valid_senha + ', tentativa: ' + data.tentativa, this.TAG);
                document.getElementById('login_form_sen_inc').removeAttribute('hidden');
                document.getElementById('login_form_sen').parentNode.classList.remove('ui-state-disabled');                
            }else{
                putLog('emailSenha: ' + data.valid_senha + ', tentativa: ' + data.tentativa, this.TAG);
                document.getElementById('login_form_sen').setAttribute('disabled','disabled');
                document.getElementById('login_form_btn').setAttribute('disabled','disabled');
                document.getElementById('login_form_sen').parentNode.classList.add('ui-state-disabled');
                document.getElementById('login_form_sen_ten').removeAttribute('hidden');
            }
            
        });
    }

}
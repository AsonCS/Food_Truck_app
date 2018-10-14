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
    getBaseRoute();
    document.getElementById('login_config_url').value = BASE_ROUTE;
    document.getElementById('login_config_url_btn').onclick = (ev) => {
        localStorage.epedsBaseRoute = BASE_ROUTE = document.getElementById('login_config_url').value;
    };
    new Login();
}




/**
 * 
 * Objeto da tela Login.
 * @type {Login}
 */
class Login {

    /**
     * 
     * @description Inicializa metodos da tela de Login.
     */
    constructor(){
        this.tentativa = 0;
        this.TAG = 'Login';
        this.routeLogin = new RouteLogin();
        document.getElementById('login_form_usu').onblur = (ev) => {
            this.emailValid(ev);
        };
        document.getElementById('login_form').onsubmit = (ev) => {
            return this.login(ev);
        };
        document.getElementById('login_form_sen_inc').onclick = (ev) => {
            this.rocover(ev);
        };
        document.getElementById('login_form_sen_ten').onclick = (ev) => {
            this.rocover(ev);
        };
    }

    /**
     * 
     * @description Valida e-mail digitado.
     * @param {Event} ev Evento Blur.
     */
    emailValid(ev){
        var obj = { email : document.getElementById('login_form_usu').value };
        this.routeLogin.emailValid(obj, (data) => {
            putLog('emailValid: ' + data.valid_email, this.TAG);
            if(parseInt(data.valid_email) == 1){
                document.getElementById('login_form_btn').removeAttribute('disabled');
                document.getElementById('login_form_sen_inc').setAttribute('hidden','hidden');
                document.getElementById('login_form_sen_ten').setAttribute('hidden','hidden');
            }else{
                document.getElementById('login_form_btn').setAttribute('disabled','disabled');
                document.getElementById('login_form_sen_inc').setAttribute('hidden','hidden');
                document.getElementById('login_form_sen_ten').setAttribute('hidden','hidden');
            }
        });
    }

    /**
     * 
     * @description Quando clica para entrar.
     * @param {Event} ev Evento Submit.
     */
    login(ev){
        var obj = { 
            email : document.getElementById('login_form_usu').value,
            senha : document.getElementById('login_form_sen').value,
            tentativa : this.tentativa
        };
        this.routeLogin.login(obj, (data) => {
            if(parseInt(data.valid_email) == 0){
                document.getElementById('login_form_btn').setAttribute('disabled','disabled');
                document.getElementById('login_form_sen_inc').setAttribute('hidden','hidden');
                document.getElementById('login_form_sen_ten').setAttribute('hidden','hidden');
            }else if(parseInt(data.valid_senha) == 1){
                document.getElementById('login_form').reset();
                putLog('efetuou login', this.TAG);
                location += '#ambientes';
            }else if(parseInt(data.valid_senha) == 0 && parseInt(data.tentativa) < 5){
                putLog('emailSenha: ' + data.valid_senha + ', tentativa: ' + data.tentativa, this.TAG);
                document.getElementById('login_form_sen_inc').removeAttribute('hidden');
                document.getElementById('login_form_sen_ten').setAttribute('hidden','hidden');             
            }else{
                putLog('emailSenha: ' + data.valid_senha + ', tentativa: ' + data.tentativa, this.TAG);
                document.getElementById('login_form_btn').setAttribute('disabled','disabled');
                document.getElementById('login_form_sen_inc').setAttribute('hidden','hidden');
                document.getElementById('login_form_sen_ten').removeAttribute('hidden');
            }
        });
        return false;
    }

    /**
     * 
     * @description Para esqueci a senha ou muitas tentativas.
     * @param {Event} ev Evento Click.
     */
    rocover(ev){
        var obj = { 
            email : document.getElementById('login_form_usu').value            
        };
        this.routeLogin.rocover(obj, (data) => {
            putLog('rocover', this.TAG);
            location += '#cadastro';
        });
    }

}
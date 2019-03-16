$(document).on('pagecontainerbeforeshow', (event, data) => {
    switch (data.toPage.attr('id')){
        case 'login' :
            new Login();
            break;
        case 'cadastro' :
            new Cadastro();
            break;
        case '' :
            break;
        case '' :
            break;
        case '' :
            break;
        case '' :
            break;
    }
});

function initDOM(){
    sessionStorage.epedsDebug = 1;
    sessionStorage.epedsLog = 1;
    $('#login_config_url').val(getBaseRoute());
    $('#login_config_url_btn').on('click', (ev) => {
        localStorage.epedsBaseRoute = $('#login_config_url').val();
    });
    window.tests = new Tests();
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
        $('#login_form_usu').on('blur', (ev) => { this.emailValid(ev) });
        $('#login_form').on('submit', (ev) => { try { this.login(ev) }finally{ return false }});
        $('#login_form_sen_inc').on('click', (ev) => { this.rocover(ev) });
        $('#login_form_sen_ten').on('click', (ev) => { this.rocover(ev) });
    }

    /**
     * 
     * @description Valida e-mail digitado.
     * @param {Event} ev Evento Blur.
     */
    emailValid(ev){
        var obj = { email : document.getElementById('login_form_usu').value };
        this.routeLogin.emailValid(obj, (data) => {
            tests.putLog('emailValid: ' + data.valid_email, this.TAG);
            if(parseInt(data.valid_email) == 1){
                $('#login_form_btn').removeAttr('disabled');
                $('#login_form_sen_inc').attr('hidden');
                $('#login_form_sen_ten').attr('hidden');
            }else{
                $('#login_form_btn').attr('disabled');
                $('#login_form_sen_inc').attr('hidden');
                $('#login_form_sen_ten').attr('hidden');
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
            email : $('#login_form_usu').val(),
            senha : $('#login_form_sen').val(),
            tentativa : this.tentativa
        };
        this.routeLogin.login(obj, (data) => {
            if(parseInt(data.valid_email) == 0){
                $('#login_form_btn').attr('disabled');
                $('#login_form_sen_inc').attr('hidden');
                $('#login_form_sen_ten').attr('hidden');
            }else if(parseInt(data.valid_senha) == 1){
                $('#login_form').trigger( "reset" );
                document.getElementById('login_form').reset();
                tests.putLog('efetuou login', this.TAG);
                $.mobile.navigate('#ambientes');
            }else if(parseInt(data.valid_senha) == 0 && parseInt(data.tentativa) < 5){
                tests.putLog('emailSenha: ' + data.valid_senha + ', tentativa: ' + data.tentativa, this.TAG);
                $('#login_form_sen_inc').removeAttr('hidden');
                $('#login_form_sen_ten').attr('hidden');            
            }else{
                tests.putLog('emailSenha: ' + data.valid_senha + ', tentativa: ' + data.tentativa, this.TAG);
                $('#login_form_btn').attr('disabled');
                $('#login_form_sen_inc').attr('hidden');
                $('#login_form_sen_ten').removeAttr('hidden');
            }
        });
    }

    /**
     * 
     * @description Para esqueci a senha ou muitas tentativas.
     * @param {Event} ev Evento Click.
     */
    rocover(ev){
        var obj = { 
            email : $('#login_form_usu').val()      
        };
        this.routeLogin.rocover(obj, (data) => {
            tests.putLog('rocover', this.TAG);
            setBundle('cadastro-recover', data);
            $.mobile.navigate('#cadastro');
        });
    }

}


/**
 * 
 * Objeto da tela Ambientes.
 * @type {Ambientes}
 */
class Ambientes {

    /**
     * 
     * @description Inicializa metodos da tela de Ambientes.
     */
    constructor(){
    }
}


/**
 * 
 * Objeto da tela Cadastro.
 * @type {Cadastro}
 */
class Cadastro {

    /**
     * 
     * @description Inicializa metodos da tela de Cadastro.
     */
    constructor(){
        this.TAG = 'Cadastro';
        this.routeCadastro = new RouteCadastro();
        $('#cadastro_cad').on('submit', (ev) => { try { }finally{ return false }});
        var data = getBundle('cadastro-recover');
        if(typeof(data) != 'undefined'){
            tests.putLog('recover', this.TAG, data);
            $('#cadastro_cad_nome').val(data.nome);
            $('#cadastro_cad_email').val(data.email);
            $('#cadastro_cad_chave').val(data.chave);
            $('#cadastro_cad_nivel').val(data.func).selectmenu( "refresh" );
        }else{
            data = getBundle('cadastro-update');
            if(typeof(data) != 'undefined'){
                tests.putLog('update', this.TAG, data);
                $('#cadastro_cad_nome').val(data.nome);
                $('#cadastro_cad_email').val(data.email);
                $('#cadastro_cad_chave').val(data.chave);
                $('#cadastro_cad_nivel').val(data.func).selectmenu( "refresh" );
                $('#cadastro_cad_senAnt').removeAttr('hidden');
            }else{
                tests.putLog('nao recover nem update', this.TAG);
            }
        }
    }

    /**
     * 
     * @description Valida e-mail no servidor.
     */
    emailValid(){
        
    }

    /**
     * 
     * @description Grava usuário no servidor.
     */
    gravar(){
        
    }

    /**
     * 
     * @description Atualiza usuário no servidor.
     */
    update(){
        
    }
}

/**
 * 
 * @description Verifica se o debug está configurado na propriedade sessionStorage.epedsDebug.
 */
function isDebug() { return typeof(sessionStorage.epedsDebug) == 'undefined' ? 0 : parseInt(sessionStorage.epedsDebug) }

/**
 * 
 * @description Verifica se o log está configurado na propriedade sessionStorage.epedsLog.
 */
function isLog() { return typeof(sessionStorage.epedsLog) == 'undefined' ? 0 : parseInt(sessionStorage.epedsLog) }

/**
 * 
 * @description função para gravar log.
 * @param {string} log Texto para ser gravado.
 * @param {string} TAG Tag para pesquisa, no formato 'TAG:'.
 */
function putLog(log, TAG = '') {
    if(isLog()){
        if(typeof(log) == 'string' || typeof(log) == 'number'){
            log = TAG.length > 0 ? TAG + ': ' + log : log;
            console.log(log);
        }
    }
}

/**
 * 
 * @description função para gravar log de erro.
 * @param {string} log Texto de erro para ser gravado.
 * @param {string} TAG Tag para pesquisa, no formato 'TAG:'.
 */
function putLogErro(log, TAG = '') {
    if(isLog()){
        if(typeof(log) == 'string' || typeof(log) == 'number'){
            log = TAG.length > 0 ? TAG + ': ' + log : log;
            console.error(log);
        }
    }
}

/**
 * 
 * @description Intercepta o submit de um formulário.
 * @param {HTMLFormElement} form Formulario para ser interceptado.
 * @param {Function} callback Função para executar depois de interromper o submit, recebe (form: HTMLFormElement) como parametro.
 */
function formIntercept (form, callback = (form) => {}){
    callback(form);
    form.reset();
    return false;
}

/**
 * 
 * Classe para comunicação com servidor, pode servir de base para rotas mais complexas.
 * @type {Cliente_API}
 * @property {constructor} constructor   - Configura rota e inicia atributos.
 * @property {string} route              - Default: 'api/' Rota para a API do servidor.
 * @property {string} TAG                - 'ClienteAPI'.
 * @property {Object} ajaxObj            - Default: '{}' Objeto com atributos e métodos necessários para envio por Ajax.
 * @property {Object} obj_debug          - Default: '{}' Retorno se debug ativo.
 * @property {Function} constructAjaxObj - Monta Objeto para Ajax.
 * @property {Function} post             - Envia dados para o servidor, executa log e debug se ativos.
 * @property {Function} setRoute         - Altera rota.
 */
class ClienteAPI {

    /**
     * 
     * @description Configura rota e inicia atributos.
     */
    constructor(){
        this.route = 'api/';
        this.ajaxObj = {};
        this.obj_debug = {};
        this.TAG = 'ClienteAPI';
    }

    /**
     * 
     * @description Monta Objeto para Ajax.
     * @param {Object} obj Objeto com atributos e métodos necessários para envio por Ajax
     */
    constructAjaxObj(obj = {}) {
        obj.data = typeof(obj.data) != 'object' ? null : obj.data;
        obj.type = typeof(obj.type) != 'string' ? 'POST' : obj.type;
        obj.contentType = typeof(obj.contentType) != 'string' ? 'application/json; charset=UTF-8' : obj.contentType;
        obj.url = typeof(obj.url) != 'string' ? this.route : this.route + obj.url;
        obj.success_callback = typeof(obj.success_callback) != 'function' ? (data, textStatus, jqXHR) => { } : obj.success_callback;
        obj.error_callback = typeof(obj.error_callback) != 'function' ? (jqXHR, textStatus, errorThrown) => { } : obj.error_callback;
        return obj;
    }

    /**
     * 
     * @description Envia dados para o servidor, executa log e debug se ativos.
     */
    post() {
        if(typeof(this.ajaxObj.data) == 'object'){
            if(isLog()){
                this.ajaxObj.success_callback = (data, textStatus, jqXHR) => {
                    putLog('response: ' + JSON.stringify(data), this.TAG);
                    this.ajaxObj.success_callback(data, textStatus, jqXHR);
                }
            }
            putLog(JSON.stringify(this.ajaxObj.data) + '\n' + this.ajaxObj.type + '\n' + this.ajaxObj.url, this.TAG);
            if(isDebug()){
                this.success_callback(this.obj_debug, 'debug', null);
            }else{
                $.ajax(this.ajaxObj);
            }
        }else{
            putLogErro('Objeto com data invalida.', this.TAG);
        }
    }

    /**
     * 
     * @description Altera rota.
     * @param {string} route Rota para a API do servidor.
     */
    setRoute(route){
        this.route = 'api/' + route;
    }

}

/**
 * 
 * Rota da area de Login para o servidor.
 * @type {RouteLogin}
 * @extends {ClienteAPI}
 * @property {constructor} constructor   - Configura rota e inicia atributos.
 * @property {string} route              - Default: 'api/login/' Rota para a API do servidor.
 * @property {Object} ajaxObj            - Default: '{}' Objeto com atributos e métodos necessários para envio por Ajax.
 * @property {Object} obj_debug          - Default: '{}' Retorno se debug ativo.
 * @property {Function} constructAjaxObj - Monta Objeto para Ajax.
 * @property {Function} post             - Envia dados para o servidor, executa log e debug se ativos.
 * @property {Function} setRoute         - Altera rota.
 */
class RouteLogin extends ClienteAPI {

    /**
     * 
     * @description Configura rota e inicia super classe.
     */
    constructor(route = ''){
        super();
        this.route += 'login/';
    }

    /**
     * 
     * @description Valida e-mail no servidor.
     * @param {!object} data Data para enviar para o servidor.
     * @param {!function} success_callback Data para enviar para o servidor params: (data: Object).
     */
    emailValid(data, success_callback){
        if(typeof(data) == 'object' && typeof(success_callback) == 'function'){
            this.ajaxObj.data = data;
            this.ajaxObj = this.constructAjaxObj(this.ajaxObj);
            this.ajaxObj.url = 'emailvalid';
            this.ajaxObj.success_callback = (data, textStatus, jqXHR) => {
                putLog('success', this.TAG);
                success_callback(data);
            };
            this.ajaxObj.error_callback = (jqXHR, textStatus, errorThrown) => {
                putLogErro('error', this.TAG);
            };
            if(isDebug()){
                this.ajaxObj.obj_debug = {
                    email : this.ajaxObj.data.email,
                    valid_email : 1
                };
                putLog('debug', this.TAG);
                success_callback(this.ajaxObj.obj_debug);
            }else{
                this.post();
            }            
        }else{
            putLogErro('error nos parametros', this.TAG);
        }
    }
}

/**
 * 
 * Rota da area de Cadastro para o servidor.
 * @type {RouteCadastro}
 */
class RouteCadastro extends ClienteAPI {

    /**
     * 
     * @param {string} route Rota para a API do servidor.
     * @param {Object} ajaxObj Objeto com atributos e métodos necessários para envio por Ajax.
     * @param {Object} obj_debug Retorno se debug ativo.
     */
    constructor(route = '', ajaxObj = {}, obj_debug = {}){
        super('cadastro/' + route, ajaxObj, obj_debug);
    }
}

/**
 * 
 * Rota da area de Ambientes para o servidor.
 * @type {RouteAmbientes}
 */
class RouteAmbientes extends ClienteAPI {

    /**
     * 
     * @param {string} route Rota para a API do servidor.
     * @param {Object} ajaxObj Objeto com atributos e métodos necessários para envio por Ajax.
     * @param {Object} obj_debug Retorno se debug ativo.
     */
    constructor(route = '', ajaxObj = {}, obj_debug = {}){
        super('ambientes/' + route, ajaxObj, obj_debug);
    }
}

/**
 * 
 * Rota da area de Cozinha para o servidor.
 * @type {RouteCozinha}
 */
class RouteCozinha extends ClienteAPI {

    /**
     * 
     * @param {string} route Rota para a API do servidor.
     * @param {Object} ajaxObj Objeto com atributos e métodos necessários para envio por Ajax.
     * @param {Object} obj_debug Retorno se debug ativo.
     */
    constructor(route = '', ajaxObj = {}, obj_debug = {}){
        super('cozinha/' + route, ajaxObj, obj_debug);
    }
}

/**
 * 
 * Rota da area de Copa para o servidor.
 * @type {RouteCopa}
 */
class RouteCopa extends ClienteAPI {

    /**
     * 
     * @param {string} route Rota para a API do servidor.
     * @param {Object} ajaxObj Objeto com atributos e métodos necessários para envio por Ajax.
     * @param {Object} obj_debug Retorno se debug ativo.
     */
    constructor(route = '', ajaxObj = {}, obj_debug = {}){
        super('copa/' + route, ajaxObj, obj_debug);
    }
}

/**
 * 
 * Rota da area de Caixa para o servidor.
 * @type {RouteCaixa}
 */
class RouteCaixa extends ClienteAPI {

    /**
     * 
     * @param {string} route Rota para a API do servidor.
     * @param {Object} ajaxObj Objeto com atributos e métodos necessários para envio por Ajax.
     * @param {Object} obj_debug Retorno se debug ativo.
     */
    constructor(route = '', ajaxObj = {}, obj_debug = {}){
        super('caixa/' + route, ajaxObj, obj_debug);
    }
}
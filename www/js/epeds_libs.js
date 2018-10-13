
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
    if(typeof(log) == 'string' || typeof(log) == 'number'){
        log = TAG.length > 0 ? TAG + ': ' + log : log;
        console.log(log);
    }
}

/**
 * 
 * @description função para gravar log de erro.
 * @param {string} log Texto de erro para ser gravado.
 * @param {string} TAG Tag para pesquisa, no formato 'TAG:'.
 */
function putLogErro(log, TAG = '') {
    if(typeof(log) == 'string' || typeof(log) == 'number'){
        log = TAG.length > 0 ? TAG + ': ' + log : log;
        console.error(log);
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
 */
class ClienteAPI {

    /**
     * 
     * @param {string} route Rota para a API do servidor.
     * @param {Object} ajaxObj Objeto com atributos e métodos necessários para envio por Ajax.
     * @param {Object} obj_debug Retorno se debug ativo.
     */
    constructor(route = '', ajaxObj = {}, obj_debug = {}){
        this.route = 'api/' + route;
        this.ajaxObj = this.constructAjaxObj(ajaxObj);
        this.obj_debug = obj_debug;
    }

    /**
     * 
     * @description Monta Objeto para Ajax.
     * @param {Object} obj Objeto com atributos e métodos necessários para envio por Ajax
     */
    constructAjaxObj(obj = {}) {
        obj.data = typeof(obj.data) != 'object' ? {} : obj.data;
        obj.type = typeof(obj.type) != 'string' ? 'POST' : obj.type;
        obj.contentType = typeof(obj.contentType) != 'string' ? 'application/json; charset=UTF-8' : obj.contentType;
        obj.url = typeof(obj.url) != 'string' ? this.route: obj.url;
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
                    putLog('response: ' + JSON.stringify(data), 'ClienteAPI');
                    this.ajaxObj.success_callback(data, textStatus, jqXHR);
                }
                putLog(JSON.stringify(this.ajaxObj.data) + '\n' + this.ajaxObj.type + '\n' + this.ajaxObj.url, 'ClienteAPI');
            }
            if(isDebug()){
                this.success_callback(this.obj_debug, 'debug', null);
                return;
            }
            $.ajax(this.ajaxObj);
        }else{
            putLogErro('Objeto com data invalida.', 'ClienteAPI');
        }
    }

}

/**
 * 
 * Rota da area de Login para o servidor.
 * @type {RouteLogin}
 */
class RouteLogin extends ClienteAPI {

    /**
     * 
     * @param {string} route Rota para a API do servidor.
     * @param {Object} ajaxObj Objeto com atributos e métodos necessários para envio por Ajax.
     * @param {Object} obj_debug Retorno se debug ativo.
     */
    constructor(route = '', ajaxObj = {}, obj_debug = {}){
        super('login/' + route, ajaxObj, obj_debug);
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

function getBaseRoute(){
    if(typeof(localStorage.epedsBaseRoute) != 'string' || localStorage.epedsBaseRoute == ''){
        return localStorage.epedsBaseRoute = "http://127.0.0.1:3000/";
    }else{
        return localStorage.epedsBaseRoute;
    }
}

var Bundle = [];

function getBundle(key){
    if(typeof(key) != 'string') return undefined;
    return Bundle[key];
}

function setBundle(key, value){
    if(typeof(key) != 'string') return false;
    if(typeof(value) == 'undefined') return false;
    Bundle[key] = value;
    return true;
}


/**
 * 
 * Objeto responsavel pelos testes de desenvolvimento
 * @type {Tests}
 * @property {constructor} constructor Verifica se o debug e log estão configurados nas propriedades de sessionStorage.
 * @property {Function} routeDebug Simula respostas do servidor.
 * @property {Function} isDebug Testa se Debug está ativo.
 * @property {Function} isLog Testa se Log está ativo.
 * @property {Function} putLog Função para gravar log.
 * @property {Function} putLogErro Função para gravar log de erro.
 */
class Tests {

    /**
     * 
     * @description Verifica se o debug e log estão configurados nas propriedades de sessionStorage.
     */
    constructor(){
        this.epedsDebug = typeof(sessionStorage.epedsDebug) == 'undefined' ? 0 : parseInt(sessionStorage.epedsDebug);
        this.epedsLog = typeof(sessionStorage.epedsLog) == 'undefined' ? 0 : parseInt(sessionStorage.epedsLog);
    }

    /**
     * 
     * @description Simula respostas do servidor.
     * @param {object} obj Objeto que seria enviado para servidor
     */
    routeDebug(obj){
        switch (obj.url){
            case 'emailvalid':
                obj.success_callback({
                    email : "test",
                    valid_email : 1
                }, 'debug', null);
                break;
            case 'login':
                obj.success_callback({
                    email : "test",
                    valid_email : 1,
                    valid_senha: 0,
                    senha : "123",
                    tentativa: 6
                }, 'debug', null);
                break;
            case 'rocover':
                obj.success_callback({
                    email : "test",
                    nome : "Anderson",
                    func : "OPRAC",
                    chave : "XXXX-XXXX"
                }, 'debug', null);
                break;
            case 'gravar':
                obj.success_callback({}, 'debug', null);
                break;
            case 'update':
                obj.success_callback({}, 'debug', null);
                break;
            case '':
                obj.success_callback({}, 'debug', null);
                break;
            case '':
                obj.success_callback({}, 'debug', null);
                break;
            case '':
                obj.success_callback({}, 'debug', null);
                break;
            default:
                obj.success_callback({}, 'debug', null);
        }
    }

    /**
     * 
     * @description  Testa se Debug está ativo
     * @returns {number} Retorna Debug ( 0 | 1 ).
     */
    isDebug(){ return this.epedsDebug; }

    /**
     * 
     * @description  Testa se Log está ativo
     * @returns {number} Retorna Log ( 0 | 1 ).
     */
    isLog() { return this.epedsDebug; }

    /**
     * 
     * @description Função para gravar log.
     * @param {string} log Texto para ser gravado.
     * @param {string} TAG Tag para pesquisa, no formato 'TAG:'.
     */
    putLog(log, TAG = '', obj) {
        if(this.epedsDebug){
            if(typeof(log) == 'string' || typeof(log) == 'number'){
                log = typeof(TAG) == 'string' && TAG.length > 0 ? TAG + ': ' + log : log;
                if(typeof(obj) == 'object'){
                    console.log(log,obj);
                }else{
                    console.log(log);
                }
            }
        }
    }

    /**
     * 
     * @description Função para gravar log de erro.
     * @param {string} log Texto de erro para ser gravado.
     * @param {string} TAG Tag para pesquisa, no formato 'TAG:'.
     */
    putLogErro(log, TAG = '') {
        //if(this.epedsDebug){
            if(typeof(log) == 'string' || typeof(log) == 'number'){
                log = typeof(TAG) == 'string' && TAG.length > 0 ? TAG + ': ' + log : log;
                console.error(log);
            }
        //}
    }
}


/**
 * 
 * Classe para comunicação com servidor, pode servir de base para rotas mais complexas.
 * @type {Cliente_API}
 * @property {constructor} constructor   - Configura rota e inicia atributos.
 * @property {string} route              - Default: 'api/' Rota para a API do servidor.
 * @property {string} TAG                - 'ClienteAPI'.
 * @property {Object} ajaxObj            - Default: '{}' Objeto com atributos e métodos necessários para envio por Ajax.
 * @property {Function} constructAjaxObj - Monta Objeto para Ajax.
 * @property {Function} postPad          - Envio padrão para o servidor.
 * @property {Function} post             - Envia dados para o servidor, executa log e debug se ativos.
 * @property {Function} setRoute         - Altera rota.
 */
class ClienteAPI {

    /**
     * 
     * @description Configura rota e inicia atributos.
     */
    constructor(route = '', TAG = 'ClienteAPI'){
        this.baseRoute = this.route = getBaseRoute() + 'api/' + route;        
        this.ajaxObj = {};
        this.TAG = TAG;
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
     * @description Envio padrão para o servidor.
     * @param {!object} data Data para enviar para o servidor.
     * @param {!function} success_callback Função para executar se tiver sucesso params: (data: Object).
     */
    postPad(data, success_callback, route = ''){
        if(typeof(data) == 'object' && typeof(success_callback) == 'function' && typeof(route) == 'string'){
            this.ajaxObj.data = data;
            this.ajaxObj = this.constructAjaxObj(this.ajaxObj);
            this.ajaxObj.url = route;
            this.ajaxObj.success_callback = (data, textStatus, jqXHR) => {
                tests.putLog('postPad response', this.TAG, data);
                success_callback(data);
            };
            this.ajaxObj.error_callback = (jqXHR, textStatus, errorThrown) => {
                tests.putLogErro('postPad error', this.TAG);
            };
            this.post();
        }else{
            tests.putLogErro('postPad error nos parametros', this.TAG);
        }
    }

    /**
     * 
     * @description Envia dados para o servidor, executa log e debug se ativos.
     */
    post() {
        if(typeof(this.ajaxObj.data) == 'object'){
            tests.putLog('post', this.TAG, this.ajaxObj);
            if(tests.isDebug()){
                tests.routeDebug(this.ajaxObj);
            }else{
                $.ajax(this.ajaxObj);
            }
        }else{
            tests.putLogErro('Objeto com data invalida.', this.TAG);
        }
    }

    /**
     * 
     * @description Altera rota.
     * @param {string} route Rota para a API do servidor.
     */
    setRoute(route){
        this.route = this.baseRoute + route;
    }

}


/**
 * 
 * Rota da area de Login para o servidor.
 * @type {RouteLogin}
 * @extends {ClienteAPI}
 * @property {constructor} constructor   - Configura rota e inicia atributos.
 * @property {string} route              - Default: 'api/login/' Rota para a API do servidor.
 * @property {string} TAG                - 'RouteLogin'.
 * @property {Object} ajaxObj            - Default: '{}' Objeto com atributos e métodos necessários para envio por Ajax.
 * @property {Function} constructAjaxObj - Monta Objeto para Ajax.
 * @property {Function} postPad          - Envio padrão para o servidor.
 * @property {Function} post             - Envia dados para o servidor, executa log e debug se ativos.
 * @property {Function} setRoute         - Altera rota.
 * @property {Function} init             - Requisita informações da pagina no servidor.
 * @property {Function} emailValid       - Valida e-mail no servidor.
 * @property {Function} login            - Valida e-mail e senha no servidor.
 * @property {Function} rocover          - Envia rota recover para o servidor.
 */
class RouteLogin extends ClienteAPI {

    /**
     * 
     * @description Configura rota e TAG no construtor da super classe.
     */
    constructor(){
        super('login/', 'RouteLogin');
    }

    /**
     * 
     * @description Requisita informações da pagina no servidor.
     * @param {!object} data Data para enviar para o servidor.
     * @param {!function} success_callback Função para executar se tiver sucesso params: (data: Object).
     */
    init(data, success_callback){
        this.postPad(data, success_callback, 'init');
    }

    /**
     * 
     * @description Valida e-mail no servidor.
     * @param {!object} data Data para enviar para o servidor.
     * @param {!function} success_callback Função para executar se tiver sucesso params: (data: Object).
     */
    emailValid(data, success_callback){
        this.postPad(data, success_callback, 'emailvalid');
    }

    /**
     * 
     * @description Valida e-mail e senha no servidor.
     * @param {!object} data Data para enviar para o servidor.
     * @param {!function} success_callback Função para executar se tiver sucesso params: (data: Object).
     */
    login(data, success_callback){
        this.postPad(data, success_callback, 'login');
    }

    /**
     * 
     * @description Envia rota recover para o servidor.
     * @param {!object} data Data para enviar para o servidor.
     * @param {!function} success_callback Função para executar se tiver sucesso params: (data: Object).
     */
    rocover(data, success_callback){
        this.postPad(data, success_callback, 'rocover');
    }
}


/**
 * 
 * Rota da area de Cadastro para o servidor.
 * @type {RouteCadastro}
 * @extends {ClienteAPI}
 * @property {constructor} constructor   - Configura rota e inicia atributos.
 * @property {string} route              - Default: 'api/cadastros/' Rota para a API do servidor.
 * @property {string} TAG                - 'ClienteAPI'.
 * @property {Object} ajaxObj            - Default: '{}' Objeto com atributos e métodos necessários para envio por Ajax.
 * @property {Function} constructAjaxObj - Monta Objeto para Ajax.
 * @property {Function} postPad          - Envio padrão para o servidor.
 * @property {Function} post             - Envia dados para o servidor, executa log e debug se ativos.
 * @property {Function} setRoute         - Altera rota.
 * @property {Function} init             - Requisita informações da pagina no servidor.
 * @property {Function} emailValid       - Valida e-mail no servidor.
 * @property {Function} gravar           - Grava usuário no servidor.
 * @property {Function} update           - Atualiza usuário no servidor.
 */
class RouteCadastro extends ClienteAPI {

    /**
     * 
     * @description Configura rota e TAG no construtor da super classe.
     */
    constructor(){
        super('cadastro/', 'RouteCadastro');
    }

    /**
     * 
     * @description Requisita informações da pagina no servidor.
     * @param {!object} data Data para enviar para o servidor.
     * @param {!function} success_callback Função para executar se tiver sucesso params: (data: Object).
     */
    init(data, success_callback){
        this.postPad(data, success_callback, 'init');
    }

    /**
     * 
     * @description Valida e-mail no servidor.
     * @param {!object} data Data para enviar para o servidor.
     * @param {!function} success_callback Função para executar se tiver sucesso params: (data: Object).
     */
    emailValid(data, success_callback){
        this.postPad(data, success_callback, 'emailvalid');
    }

    /**
     * 
     * @description Grava usuário no servidor.
     * @param {!object} data Data para enviar para o servidor.
     * @param {!function} success_callback Função para executar se tiver sucesso params: (data: Object).
     */
    gravar(data, success_callback){
        this.postPad(data, success_callback, 'gravar');
    }

    /**
     * 
     * @description Atualiza usuário no servidor.
     * @param {!object} data Data para enviar para o servidor.
     * @param {!function} success_callback Função para executar se tiver sucesso params: (data: Object).
     */
    update(data, success_callback){
        this.postPad(data, success_callback, 'update');
    }
}


/**
 * 
 * Rota da area de Ambientes para o servidor.
 * @type {RouteAmbientes}
 * @extends {ClienteAPI}
 * @property {constructor} constructor   - Configura rota e inicia atributos.
 * @property {string} route              - Default: 'api/ambientes/' Rota para a API do servidor.
 * @property {string} TAG                - 'ClienteAPI'.
 * @property {Object} ajaxObj            - Default: '{}' Objeto com atributos e métodos necessários para envio por Ajax.
 * @property {Function} constructAjaxObj - Monta Objeto para Ajax.
 * @property {Function} postPad          - Envio padrão para o servidor.
 * @property {Function} post             - Envia dados para o servidor, executa log e debug se ativos.
 * @property {Function} setRoute         - Altera rota.
 * @property {Function} init             - Requisita informações da pagina no servidor.
 * @property {Function} out              - Encerra sessão no servidor.
 * @property {Function} ambiente         - Redireciona ambiente no servidor.
 */
class RouteAmbientes extends ClienteAPI {

    /**
     * 
     * @description Configura rota e TAG no construtor da super classe.
     */
    constructor(){
        super('ambientes/', 'RouteAmbientes');
    }

    /**
     * 
     * @description Requisita informações da pagina no servidor.
     * @param {!object} data Data para enviar para o servidor.
     * @param {!function} success_callback Função para executar se tiver sucesso params: (data: Object).
     */
    init(data, success_callback){
        this.postPad(data, success_callback, 'init');
    }

    /**
     * 
     * @description Encerra sessão no servidor.
     * @param {!object} data Data para enviar para o servidor.
     * @param {!function} success_callback Função para executar se tiver sucesso params: (data: Object).
     */
    out(data, success_callback){
        this.postPad(data, success_callback, 'out');
    }

    /**
     * 
     * @description Redireciona ambiente no servidor.
     * @param {!object} data Data para enviar para o servidor.
     * @param {!function} success_callback Função para executar se tiver sucesso params: (data: Object).
     */
    ambiente(data, success_callback){
        this.postPad(data, success_callback, 'ambiente');
    }
}


/**
 * 
 * Rota da area de Cozinha para o servidor.
 * @type {RouteCozinha}
 * @extends {ClienteAPI}
 * @property {constructor} constructor   - Configura rota e inicia atributos.
 * @property {string} route              - Default: 'api/cadastros' Rota para a API do servidor.
 * @property {string} TAG                - 'ClienteAPI'.
 * @property {Object} ajaxObj            - Default: '{}' Objeto com atributos e métodos necessários para envio por Ajax.
 * @property {Function} constructAjaxObj - Monta Objeto para Ajax.
 * @property {Function} postPad          - Envio padrão para o servidor.
 * @property {Function} post             - Envia dados para o servidor, executa log e debug se ativos.
 * @property {Function} setRoute         - Altera rota.
 * @property {Function} init             - Requisita informações da pagina no servidor.
 */
class RouteCozinha extends ClienteAPI {

    /**
     * 
     * @description Configura rota e TAG no construtor da super classe.
     */
    constructor(){
        super('/', '');
    }
}


/**
 * 
 * Rota da area de Copa para o servidor.
 * @type {RouteCopa}
 * @extends {ClienteAPI}
 * @property {constructor} constructor   - Configura rota e inicia atributos.
 * @property {string} route              - Default: 'api/cadastros' Rota para a API do servidor.
 * @property {string} TAG                - 'ClienteAPI'.
 * @property {Object} ajaxObj            - Default: '{}' Objeto com atributos e métodos necessários para envio por Ajax.
 * @property {Function} constructAjaxObj - Monta Objeto para Ajax.
 * @property {Function} postPad          - Envio padrão para o servidor.
 * @property {Function} post             - Envia dados para o servidor, executa log e debug se ativos.
 * @property {Function} setRoute         - Altera rota.
 * @property {Function} init             - Requisita informações da pagina no servidor.
 */
class RouteCopa extends ClienteAPI {

    /**
     * 
     * @description Configura rota e TAG no construtor da super classe.
     */
    constructor(){
        super('/', '');
    }
}


/**
 * 
 * Rota da area de Caixa para o servidor.
 * @type {RouteCaixa}
 * @extends {ClienteAPI}
 * @property {constructor} constructor   - Configura rota e inicia atributos.
 * @property {string} route              - Default: 'api/caixa/' Rota para a API do servidor.
 * @property {string} TAG                - 'ClienteAPI'.
 * @property {Object} ajaxObj            - Default: '{}' Objeto com atributos e métodos necessários para envio por Ajax.
 * @property {Function} constructAjaxObj - Monta Objeto para Ajax.
 * @property {Function} postPad          - Envio padrão para o servidor.
 * @property {Function} post             - Envia dados para o servidor, executa log e debug se ativos.
 * @property {Function} setRoute         - Altera rota.
 * @property {Function} init             - Requisita informações da pagina no servidor.
 */
class RouteCaixa extends ClienteAPI {

    /**
     * 
     * @description Configura rota e TAG no construtor da super classe.
     */
    constructor(){
        super('caixa/', 'RouteCaixa');
    }

    /**
     * 
     * @description Requisita informações da pagina no servidor.
     * @param {!object} data Data para enviar para o servidor.
     * @param {!function} success_callback Função para executar se tiver sucesso params: (data: Object).
     */
    init(data, success_callback){
        this.postPad(data, success_callback, 'init');
    }

    /**
     * 
     * @description Requisita informações da pagina no servidor.
     * @param {!object} data Data para enviar para o servidor.
     * @param {!function} success_callback Função para executar se tiver sucesso params: (data: Object).
     */
    init(data, success_callback){
        this.postPad(data, success_callback, 'init');
    }

    /**
     * 
     * @description Requisita informações da pagina no servidor.
     * @param {!object} data Data para enviar para o servidor.
     * @param {!function} success_callback Função para executar se tiver sucesso params: (data: Object).
     */
    init(data, success_callback){
        this.postPad(data, success_callback, 'init');
    }

    /**
     * 
     * @description Requisita informações da pagina no servidor.
     * @param {!object} data Data para enviar para o servidor.
     * @param {!function} success_callback Função para executar se tiver sucesso params: (data: Object).
     */
    init(data, success_callback){
        this.postPad(data, success_callback, 'init');
    }

    /**
     * 
     * @description Requisita informações da pagina no servidor.
     * @param {!object} data Data para enviar para o servidor.
     * @param {!function} success_callback Função para executar se tiver sucesso params: (data: Object).
     */
    init(data, success_callback){
        this.postPad(data, success_callback, 'init');
    }

    /**
     * 
     * @description Requisita informações da pagina no servidor.
     * @param {!object} data Data para enviar para o servidor.
     * @param {!function} success_callback Função para executar se tiver sucesso params: (data: Object).
     */
    init(data, success_callback){
        this.postPad(data, success_callback, 'init');
    }

    /**
     * 
     * @description Requisita informações da pagina no servidor.
     * @param {!object} data Data para enviar para o servidor.
     * @param {!function} success_callback Função para executar se tiver sucesso params: (data: Object).
     */
    init(data, success_callback){
        this.postPad(data, success_callback, 'init');
    }

    /**
     * 
     * @description Requisita informações da pagina no servidor.
     * @param {!object} data Data para enviar para o servidor.
     * @param {!function} success_callback Função para executar se tiver sucesso params: (data: Object).
     */
    init(data, success_callback){
        this.postPad(data, success_callback, 'init');
    }

    /**
     * 
     * @description Requisita informações da pagina no servidor.
     * @param {!object} data Data para enviar para o servidor.
     * @param {!function} success_callback Função para executar se tiver sucesso params: (data: Object).
     */
    init(data, success_callback){
        this.postPad(data, success_callback, 'init');
    }

    /**
     * 
     * @description Requisita informações da pagina no servidor.
     * @param {!object} data Data para enviar para o servidor.
     * @param {!function} success_callback Função para executar se tiver sucesso params: (data: Object).
     */
    init(data, success_callback){
        this.postPad(data, success_callback, 'init');
    }

    /**
     * 
     * @description Requisita informações da pagina no servidor.
     * @param {!object} data Data para enviar para o servidor.
     * @param {!function} success_callback Função para executar se tiver sucesso params: (data: Object).
     */
    init(data, success_callback){
        this.postPad(data, success_callback, 'init');
    }

    /**
     * 
     * @description Requisita informações da pagina no servidor.
     * @param {!object} data Data para enviar para o servidor.
     * @param {!function} success_callback Função para executar se tiver sucesso params: (data: Object).
     */
    init(data, success_callback){
        this.postPad(data, success_callback, 'init');
    }
}
var form_incped_quant_f = (incped_quant_f) => {
    alert('enviou pedido');
    incped_quant_f.reset();
    history.back();
    return false;
}

var form_fecped_pag = (fecped_pag) => {
    alert('fechou pedido');
    fecped_pag.reset();
    history.back();
    return false;
}

var form_cadastro_cad = (cadastro_cad) => {
    cadastro_cad.reset();
    alert('usuario incluido');
    history.back();
    return false;
}
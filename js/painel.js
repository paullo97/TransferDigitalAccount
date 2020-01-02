//Função que evita o usuario retornar a pagina 
$(document).ready(function(){
  history.pushState(null, null, document.URL);
  window.addEventListener('popstate', function () {
    history.pushState(null, null, document.URL);
  }); 
}); 

//Função que pega o nome do operador logado
function queryString(parameter) {  
  var loc = location.search.substring(1, location.search.length);   
  var param_value = false;   
  var params = loc.split("&");   
  for (i=0; i<params.length;i++) {   
      param_name = params[i].substring(0,params[i].indexOf('='));   
      if (param_name == parameter) {                                          
          param_value = params[i].substring(params[i].indexOf('=')+1)   
      }   
  }   
  if (param_value) {   
      return param_value;   
  }   
  else {   
      return undefined;   
  }   
}


$(document).on('keypress',function(e){
  if(e.which == 13) { //Codigo enter
    if(document.getElementById('cpf').value == ''){
      swal("Erro!", "Informe os dados da conta", "error");
    }
    else if(document.getElementById('valor').value != '' || document.getElementById('valor').value != 0 || document.getElementById('nome').value != ''){
      $("#transfer").click();
    }
    else{
      $("#button-addon2").click(); 
    }
  }
});

//Função de formatação de valor
function k(i) {
	var v = i.value.replace(/\D/g,'');
	v = (v/100).toFixed(2) + '';
	v = v.replace(".", ",");
	v = v.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
	v = v.replace(/(\d)(\d{3}),/g, "$1.$2,");
	i.value = v;
}

//Função que verifica se existe conta criada no app da moneto 
function ExisteConta(cpf){
  if(cpf == ''){
    swal("Erro!", "Informe o CPF", "error");
    // alert("Informe o CPF");
  }
  else{
    cpf = cpf.replace(".",""); 
    cpf = cpf.replace("-",""); 
    cpf = cpf.replace(".",""); 
    var settings = {
      "url": "https://dev.moneto.com.br/044c9a55/api//account/exist",
      "method": "POST",
      "timeout": 0,
      "Access-Control-Allow-Origin":"*",
      "headers": {
        "Content-Type": "application/json",
        "Moneto-Tenant-Id": "a15a9628-3b20-421a-9740-47817c2390c6"
      },
      "data": "{\n\t\"fiscal_id\":\""+cpf+"\"\n}",
    };

    $.ajax(settings).done(function (data){
      if(data.exist){
        document.getElementById('nome').value = data.name;
        document.getElementById("status").innerHTML = data.status;
        if(data.status == "approved" || data.status == "complete"){
          $("#status").css("color","green"); 
        }
        else if(data.status != "approved"){
          $("#status").css("color","yellow"); 
        }
        $("#valor").focus();
      }
      else{
        swal("Erro!", "CPF não encontrado", "error");
        document.getElementById('cpf').value = "";
        document.getElementById('nome').value = "";
        document.getElementById('valor').value == "";  
      }
    }).fail(function(data){
      //alert("CPF não encontrado");
      swal("Erro!", "CPF não encontrado", "error");
    }); 
  }
};

function Sair(){
  window.location.assign("../index.html");
};

//Função com a mensagem 
function ClearFields(){
  document.getElementById('cpf').value = "";
  document.getElementById('nome').value = "";
  document.getElementById('status').innerHTML = "";
  document.getElementById('valor').value = "";
  swal("Limpo", "Os Campos foram limpos", "success");
}

//Função sem a mensagem 
function ClearFields1(){
  document.getElementById('cpf').value = "";
  document.getElementById('nome').value = "";
  document.getElementById('status').innerHTML = "";
  document.getElementById('valor').value = "";
}

function moeda(a, e, r, t) {
  let n = ""
    , h = j = 0
    , u = tamanho2 = 0
    , l = ajd2 = ""
    , o = window.Event ? t.which : t.keyCode;
  if (13 == o || 8 == o)
      return !0;
  if (n = String.fromCharCode(o),
  -1 == "0123456789".indexOf(n))
      return !1;
  for (u = a.value.length,
  h = 0; h < u && ("0" == a.value.charAt(h) || a.value.charAt(h) == r); h++)
      ;
  for (l = ""; h < u; h++)
      -1 != "0123456789".indexOf(a.value.charAt(h)) && (l += a.value.charAt(h));
  if (l += n,
  0 == (u = l.length) && (a.value = ""),
  1 == u && (a.value = "0" + r + "0" + l),
  2 == u && (a.value = "0" + r + l),
  u > 2) {
      for (ajd2 = "",
      j = 0,
      h = u - 3; h >= 0; h--)
          3 == j && (ajd2 += e,
          j = 0),
          ajd2 += l.charAt(h),
          j++;
      for (a.value = "",
      tamanho2 = ajd2.length,
      h = tamanho2 - 1; h >= 0; h--)
          a.value += ajd2.charAt(h);
      a.value += r + l.substr(u - 2, u)
  }
  return !1
}

// Transferência Entre Contas Moneto 
function TransferAccount(cpf, valor){
  var nome = document.getElementById('nome').value;
  if(cpf == '' || valor == '' || nome == ''){
    swal("Erro!", "Informe todos os Campos!", "error");
  }
  else {
    swal({
      title: "Tem certeza dessa Transferencia?",
      text: "Você esta prestes a realizar uma transferencia! \n Valor: R$"+valor+" \n Para: "+nome.toUpperCase()+" \n De CPF: "+cpf,
      icon: "warning",
      buttons:true,
      closeOnEsc: false, 
      closeOnClickOutside: false
    }).then((opcao) => {
      switch (opcao) {
        case true:
          cpf = cpf.replace(".",""); 
          cpf = cpf.replace("-",""); 
          cpf = cpf.replace(".",""); 
          if(valor.length <= 5){
            valor = valor.replace(",","");
          }
          else {
            valor = valor.replace(",","");
            valor = valor.replace(".",""); 
          }
          var data = {};
          var usuario = queryString("operador"); 
        
          data = {fiscal_id: cpf, value: valor, operador: usuario};

          $.ajax({
            type: "POST",
            url: "http://ts1.drogabella.com/moneto/api/cards/TransferDigitalAccountWEB",
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json"}).done(function() {
              // alert( "Transferencia feita com sucesso!" );
              swal("Sucesso", "Transferencia feita com sucesso!", "success", {timer: 1000, buttons: false, closeOnEsc: false, closeOnClickOutside: false});
              ClearFields1(); 
            }).fail(function(data){
                // alert("Erro ao Realizar a operação");
                swal("Erro!", "Erro ao Realizar a operação", "error");
              })
          break;
        default:
          swal("Erro!", "Transação não realizada", "error", {timer: 1000, buttons: false, closeOnEsc: false, closeOnClickOutside: false});
          break;
      }
    });
  }
}
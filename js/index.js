// var urlAPI = "http://localhost:59610/api/login/";
var urlAPI = "http://ts1.drogabella.com/moneto/api/login/";

//Função que não permite que o usuario volte ou avance telas
$(document).ready(function(){
  history.pushState(null, null, document.URL);
  window.addEventListener('popstate', function () {
    history.pushState(null, null, document.URL);
  });
});  

//Função para quando apertar enter 
$(document).on('keypress',function(e){
  if(e.which == 13) { //Codigo enter
    if(document.getElementById('pass').value == '' || document.getElementById('name').value == ''){
      // alert("Preencha todos os campos"); 
      swal("Erro!", "Preencha todos os campos", "error");
    }
    else{
      $("#entrar").click();
    }
  }
});

//Validação de login
function Valida(name, pass){
  if(name == '')
    return false; 
  else if(pass == '')
    return false; 
  else 
    return true;
};

function Login(name, pass){
    if(Valida(name, pass)){
      name = name.toUpperCase(); //os dados no banco de dados estão todos maiusculos 
      pass = pass.toUpperCase(); 
      $.ajax({
      type: "GET",
      url: urlAPI + "Existe",
      data: {
          nome: name,
          senha: pass}
      }).done(function(data){
        if(data){
          window.location = "pags/painel.html?operador="+name;
          // window.location.assign("pags/painel.html");
        }
        else{
          document.getElementById("pass").value = "";
          // alert('Credenciais Incorretas, por favor digite novamente!');
          swal("Erro!", "Credenciais Incorretas, por favor digite novamente!", "error");
        }
      }).fail(function(){
        swal("Erro!", "Ocorreu uma Falha, por favor digite novamente!", "error");
        // alert('Ocorreu uma Falha, por favor digite novamente!');
      })
  }
  else{
    // alert("Preencha todos os campos");
    swal("Erro!", "Preencha todos os campos", "error");
  }
};